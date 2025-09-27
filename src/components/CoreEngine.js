'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiWallet, 
  FiCheck, 
  FiLoader, 
  FiAlertTriangle,
  FiTarget,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiDollarSign,
  FiGift,
  FiUsers
} from 'react-icons/fi';

// BSC Network Configuration
const BSC_NETWORK = {
  chainId: '0x38', // 56 in decimal
  chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed1.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';
const RLT_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)'
];

const RandomLottoParticipationEngine = () => {
  // Wallet State
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: null,
    provider: null,
    chainId: null,
    isLoading: false,
    error: null
  });

  // Balance State (Real + Simulated)
  const [balanceState, setBalanceState] = useState({
    realRLT: '0',
    simulatedRLT: '0',
    bnbBalance: '0',
    isLoading: false
  });

  // Participation State
  const [participationState, setParticipationState] = useState({
    amount: '',
    isParticipating: false,
    poolTotal: '12450', // Simulated pool total
    poolThreshold: '50000',
    myTickets: 0,
    participationHistory: []
  });

  // App State (Simulated data)
  const [appState, setAppState] = useState({
    simulatedBalances: {}, // { [address]: balance }
    totalParticipants: 2847,
    currentRound: 42,
    lastDrawWinner: null
  });

  const [telegramUser, setTelegramUser] = useState(null);

  // Get Telegram user data
  useEffect(() => {
    try {
      const telegram = window?.Telegram?.WebApp;
      if (telegram?.initDataUnsafe?.user) {
        setTelegramUser({
          firstName: telegram.initDataUnsafe.user.first_name,
          username: telegram.initDataUnsafe.user.username,
          id: telegram.initDataUnsafe.user.id
        });
      }
    } catch (error) {
      console.log('Telegram WebApp not available');
    }
  }, []);

  // Switch to BSC Network
  const switchToBSC = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_NETWORK.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add BSC network to wallet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Connect Wallet
  const connectWallet = useCallback(async (method = 'metamask') => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get current chain
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Switch to BSC if not already on it
      if (chainId !== 56) {
        await switchToBSC();
        // Refresh provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newNetwork = await newProvider.getNetwork();
        
        setWalletState({
          isConnected: true,
          address,
          provider: newProvider,
          chainId: Number(newNetwork.chainId),
          isLoading: false,
          error: null
        });
      } else {
        setWalletState({
          isConnected: true,
          address,
          provider,
          chainId,
          isLoading: false,
          error: null
        });
      }

      // Load balances
      await loadBalances(address, provider);

      // Initialize simulated balance if not exists
      setAppState(prev => ({
        ...prev,
        simulatedBalances: {
          ...prev.simulatedBalances,
          [address.toLowerCase()]: prev.simulatedBalances[address.toLowerCase()] || 0
        }
      }));

    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  }, [switchToBSC]);

  // Load Real Balances from Blockchain
  const loadBalances = useCallback(async (address, provider) => {
    setBalanceState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get BNB balance
      const bnbBalance = await provider.getBalance(address);
      const bnbFormatted = ethers.formatEther(bnbBalance);

      // Get RLT token balance
      const rltContract = new ethers.Contract(RLT_CONTRACT_ADDRESS, RLT_ABI, provider);
      const rltBalance = await rltContract.balanceOf(address);
      const decimals = await rltContract.decimals();
      const rltFormatted = ethers.formatUnits(rltBalance, decimals);

      setBalanceState({
        realRLT: rltFormatted,
        simulatedRLT: appState.simulatedBalances[address.toLowerCase()] || '0',
        bnbBalance: bnbFormatted,
        isLoading: false
      });

    } catch (error) {
      console.error('Failed to load balances:', error);
      setBalanceState(prev => ({ ...prev, isLoading: false }));
    }
  }, [appState.simulatedBalances]);

  // Simulate RLT Transfer for Participation
  const simulateParticipation = useCallback(async () => {
    if (!participationState.amount || !walletState.address) return;

    const amount = parseFloat(participationState.amount);
    const userAddress = walletState.address.toLowerCase();
    const currentSimulatedBalance = appState.simulatedBalances[userAddress] || 0;

    if (amount <= 0 || amount > 10000) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'Participation amount must be between 1 and 10,000 RLT' 
      }));
      return;
    }

    // Check if user has enough simulated balance (or use real balance as reference)
    const availableBalance = Math.max(
      parseFloat(balanceState.realRLT), 
      currentSimulatedBalance
    );

    if (amount > availableBalance) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'Insufficient RLT balance for participation' 
      }));
      return;
    }

    setParticipationState(prev => ({ ...prev, isParticipating: true }));

    try {
      // Simulate transfer delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update simulated balances
      const newSimulatedBalance = Math.max(0, currentSimulatedBalance - amount);
      
      setAppState(prev => ({
        ...prev,
        simulatedBalances: {
          ...prev.simulatedBalances,
          [userAddress]: newSimulatedBalance
        },
        totalParticipants: prev.totalParticipants + 1
      }));

      // Update balance state
      setBalanceState(prev => ({
        ...prev,
        simulatedRLT: newSimulatedBalance.toString()
      }));

      // Update participation state
      const tickets = Math.floor(amount / 100); // 100 RLT = 1 ticket
      setParticipationState(prev => ({
        ...prev,
        amount: '',
        myTickets: prev.myTickets + tickets,
        poolTotal: (parseFloat(prev.poolTotal) + amount).toString(),
        participationHistory: [
          {
            id: Date.now(),
            amount,
            tickets,
            timestamp: new Date(),
            status: 'confirmed'
          },
          ...prev.participationHistory
        ],
        isParticipating: false
      }));

      // Check if threshold reached for simulated draw
      const newPoolTotal = parseFloat(participationState.poolTotal) + amount;
      if (newPoolTotal >= parseFloat(participationState.poolThreshold)) {
        setTimeout(() => {
          simulateDraw();
        }, 3000);
      }

      // Clear any errors
      setWalletState(prev => ({ ...prev, error: null }));

    } catch (error) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'Participation simulation failed' 
      }));
      setParticipationState(prev => ({ ...prev, isParticipating: false }));
    }
  }, [participationState.amount, walletState.address, appState.simulatedBalances, balanceState.realRLT, participationState.poolTotal, participationState.poolThreshold]);

  // Simulate Draw when threshold reached
  const simulateDraw = useCallback(() => {
    const winners = [
      walletState.address,
      '0x742d35Cc6334C45532B85C6b2d7C6F3f9C5a9A8B',
      '0x8Ba1f109551bD432803012645Hac136c59e693B9'
    ];
    
    const randomWinner = winners[Math.floor(Math.random() * winners.length)];
    const prizeAmount = parseFloat(participationState.poolTotal) * 0.6; // 60% of pool

    setAppState(prev => ({
      ...prev,
      lastDrawWinner: randomWinner,
      currentRound: prev.currentRound + 1
    }));

    // If current user won, add to their simulated balance
    if (randomWinner.toLowerCase() === walletState.address?.toLowerCase()) {
      const userAddress = walletState.address.toLowerCase();
      setAppState(prev => ({
        ...prev,
        simulatedBalances: {
          ...prev.simulatedBalances,
          [userAddress]: (prev.simulatedBalances[userAddress] || 0) + prizeAmount
        }
      }));
      
      setBalanceState(prev => ({
        ...prev,
        simulatedRLT: ((prev.simulatedRLT || 0) + prizeAmount).toString()
      }));
    }

    // Reset pool
    setParticipationState(prev => ({
      ...prev,
      poolTotal: '0',
      myTickets: 0
    }));

  }, [walletState.address, participationState.poolTotal]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      chainId: null,
      isLoading: false,
      error: null
    });
    
    setBalanceState({
      realRLT: '0',
      simulatedRLT: '0',
      bnbBalance: '0',
      isLoading: false
    });
  }, []);

  // Handle account/network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState.address, connectWallet, disconnectWallet]);

  // Auto-refresh balances
  useEffect(() => {
    if (walletState.isConnected && walletState.address && walletState.provider) {
      const interval = setInterval(() => {
        loadBalances(walletState.address, walletState.provider);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [walletState.isConnected, walletState.address, walletState.provider, loadBalances]);

  const canParticipate = walletState.isConnected && 
                        participationState.amount && 
                        parseFloat(participationState.amount) > 0 &&
                        parseFloat(participationState.amount) <= Math.max(
                          parseFloat(balanceState.realRLT),
                          appState.simulatedBalances[walletState.address?.toLowerCase()] || 0
                        );

  if (!walletState.isConnected) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="glass-warm rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="glass-content relative z-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 glass-light rounded-3xl flex items-center justify-center mx-auto mb-4 relative">
                <FiWallet className="w-8 h-8 text-green-400" />
                <div className="absolute inset-0 bg-green-400/20 rounded-3xl animate-pulse"></div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Connect to BSC Network</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connect your wallet to participate in RandomLotto draws using RLT tokens on Binance Smart Chain
              </p>
            </div>

            <button
              onClick={() => connectWallet('metamask')}
              disabled={walletState.isLoading}
              className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-3">
                {walletState.isLoading ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiWallet className="w-5 h-5" />
                )}
                <span>{walletState.isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </div>
            </button>

            {walletState.error && (
              <div className="mt-4 p-4 glass-dark border-2 border-red-400/30 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{walletState.error}</p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="glass-cool rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <FiShield className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Secure Connection</h4>
                    <p className="text-xs text-gray-400">We never store your private keys</p>
                  </div>
                </div>
              </div>

              <div className="glass-cool rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <FiGift className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Demo Mode</h4>
                    <p className="text-xs text-gray-400">Simulated transfers, real blockchain data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWrongNetwork = walletState.chainId !== 56;

  return (
    <motion.div 
      className="w-full max-w-md mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wrong Network Warning */}
      {isWrongNetwork && (
        <div className="glass-dark border-2 border-yellow-400/30 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400 font-bold">Wrong Network</p>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Please switch to Binance Smart Chain to continue
          </p>
          <button
            onClick={switchToBSC}
            className="glass-button w-full py-2 rounded-xl text-white font-medium"
          >
            Switch to BSC
          </button>
        </div>
      )}

      {/* Wallet Info */}
      <div className="glass-light rounded-3xl p-6">
        <div className="glass-content">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass-warm rounded-2xl flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold">
                  {telegramUser?.firstName || 'Player'}
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>

          {/* Balances Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-dark rounded-2xl p-4 text-center relative overflow-hidden">
              {balanceState.isLoading && (
                <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center rounded-2xl">
                  <FiLoader className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              <div className="text-lg font-bold text-white">
                {parseFloat(balanceState.realRLT).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Real RLT Balance</div>
              <div className="text-xs text-green-400 mt-1">On-Chain</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {parseFloat(balanceState.simulatedRLT || '0').toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Available RLT</div>
              <div className="text-xs text-blue-400 mt-1">Simulated</div>
            </div>
          </div>

          {/* BNB Balance */}
          <div className="glass-cool rounded-2xl p-3 text-center">
            <div className="text-sm font-bold text-white">
              {parseFloat(balanceState.bnbBalance).toFixed(4)} BNB
            </div>
            <div className="text-xs text-gray-400">Network Balance</div>
          </div>
        </div>
      </div>

      {/* Participation Form */}
      <div className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="glass-content relative z-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiTarget className="w-5 h-5 text-green-400" />
            <span>Join Lottery Draw</span>
          </h3>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Participation Amount (100 RLT = 1 Ticket)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={participationState.amount}
                  onChange={(e) => setParticipationState(prev => ({ 
                    ...prev, 
                    amount: e.target.value 
                  }))}
                  className="w-full glass-dark rounded-2xl p-4 text-white placeholder-gray-400 border-2 border-gray-600/30 focus:border-green-400/50 transition-colors"
                  placeholder="Enter amount (100-10,000 RLT)"
                />
                <div className="absolute right-4 top-4 text-sm text-gray-400">
                  RLT
                </div>
              </div>
              {participationState.amount && (
                <p className="text-xs text-gray-400 mt-2">
                  = {Math.floor(parseFloat(participationState.amount) / 100)} tickets
                </p>
              )}
            </div>

            {/* Pool Status */}
            <div className="glass-cool rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Current Pool</span>
                <span className="text-sm font-bold text-white">
                  {parseFloat(participationState.poolTotal).toLocaleString()} / {parseFloat(participationState.poolThreshold).toLocaleString()} RLT
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((participationState.poolTotal / participationState.poolThreshold) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  <FiUsers className="w-3 h-3 inline mr-1" />
                  {appState.totalParticipants.toLocaleString()} players
                </span>
                <span>Round #{appState.currentRound}</span>
              </div>
            </div>

            {/* Participate Button */}
            <button
              onClick={simulateParticipation}
              disabled={!canParticipate || participationState.isParticipating || isWrongNetwork}
              className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {participationState.isParticipating ? (
                <div className="flex items-center justify-center space-x-2">
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FiZap className="w-5 h-5" />
                  <span>
                    Participate ({participationState.amount || '0'} RLT)
                  </span>
                </div>
              )}
            </button>

            {/* My Tickets */}
            {participationState.myTickets > 0 && (
              <div className="glass-dark rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {participationState.myTickets}
                  </div>
                  <div className="text-sm text-gray-400">Your Active Tickets</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {participationState.participationHistory.length > 0 && (
        <div className="glass-dark rounded-2xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center space-x-2">
            <FiTrendingUp className="w-4 h-4 text-blue-400" />
            <span>Recent Activity</span>
          </h4>
          <div className="space-y-2">
            {participationState.participationHistory.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 glass-cool rounded-xl">
                <div>
                  <div className="text-sm text-white font-medium">
                    Participated: {activity.amount} RLT
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.tickets} tickets • {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-green-400 font-medium">
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {walletState.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-dark border-2 border-red-400/30 rounded-2xl p-4"
          >
            <div className="flex items-center space-x-2">
              <FiAlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{walletState.error}</p>
            </div>
            <button
              onClick={() => setWalletState(prev => ({ ...prev, error: null }))}
              className="text-xs text-gray-400 hover:text-white transition-colors mt-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner Announcement */}
      {appState.lastDrawWinner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-warm border-2 border-yellow-400/30 rounded-2xl p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <FiGift className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400 font-bold">Draw Complete!</p>
          </div>
          <p className="text-white text-sm">
            Winner: {appState.lastDrawWinner.slice(0, 6)}...{appState.lastDrawWinner.slice(-4)}
            {appState.lastDrawWinner.toLowerCase() === walletState.address?.toLowerCase() && (
              <span className="text-green-400 font-bold ml-2">🎉 That's you!</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Info Card */}
      <div className="glass-cool rounded-2xl p-4">
        <div className="glass-content">
          <div className="flex items-start space-x-3">
            <FiShield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold mb-1">Demo Mode Active</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                This demo uses real RLT balance data from BSC but simulates transfers locally. 
                No actual tokens are moved on the blockchain. Perfect for testing the lottery experience!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RandomLottoParticipationEngine;

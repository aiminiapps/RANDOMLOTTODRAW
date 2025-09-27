'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiLoader, 
  FiAlertTriangle,
  FiTarget,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiDollarSign,
  FiGift,
  FiUsers,
  FiStar,
  FiCreditCard,
  FiExternalLink,
  FiRefreshCw,
  FiAward,
  FiHash,
  FiCalendar,
  FiClock,
  FiShoppingCart,
  FiCopy
} from 'react-icons/fi';
import { CiWallet } from "react-icons/ci";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther, formatUnits } from 'viem';
import { bsc } from 'wagmi/chains';

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';

const RandomLottoParticipationEngine = () => {
  // Wagmi hooks for EVM wallets
  const { address, isConnected, connector, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { switchChain } = useSwitchChain();
  const tonWallet = useTonWallet();
  
  // Get balances
  const { data: bnbBalance } = useBalance({ address });
  const { data: rltBalance } = useBalance({ 
    address, 
    token: RLT_CONTRACT_ADDRESS
  });

  // Detect Telegram environment
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  const isWrongNetwork = chainId && chainId !== bsc.id;
  
  // Use TON or EVM based on environment
  const isWalletConnected = isTelegram ? !!tonWallet : isConnected;
  const walletAddress = isTelegram ? tonWallet?.account?.address : address;

  // Balance State (Real + Simulated)
  const [balanceState, setBalanceState] = useState({
    realRLT: '0',
    simulatedRLT: '0',
    nativeBalance: '0',
    isLoading: false
  });

  // Participation State
  const [participationState, setParticipationState] = useState({
    amount: '',
    isParticipating: false,
    poolTotal: '0',
    poolThreshold: '1000',
    myTickets: 0,
    myPasses: [],
    participationHistory: []
  });

  // App State
  const [appState, setAppState] = useState({
    simulatedBalances: {},
    totalParticipants: 0,
    currentRound: 1,
    lastDrawWinner: null
  });

  // UI State
  const [uiState, setUiState] = useState({
    error: null,
    showPassModal: false,
    activePass: null,
    showBuyModal: false,
    copiedAddress: false
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

  // Update balances when wallet connects
  useEffect(() => {
    if (walletAddress) {
      if (isTelegram) {
        // TON wallet - set mock balance
        setBalanceState({
          realRLT: '0', // TON doesn't have RLT
          simulatedRLT: '0',
          nativeBalance: '0', // Would need TON balance API
          isLoading: false
        });
      } else {
        // EVM wallet - use real balances
        setBalanceState({
          realRLT: rltBalance ? formatUnits(rltBalance.value, rltBalance.decimals) : '0',
          simulatedRLT: appState.simulatedBalances[walletAddress.toLowerCase()] || '0',
          nativeBalance: bnbBalance ? formatEther(bnbBalance.value) : '0',
          isLoading: false
        });
      }
    } else {
      setBalanceState({
        realRLT: '0',
        simulatedRLT: '0',
        nativeBalance: '0',
        isLoading: false
      });
    }
  }, [walletAddress, rltBalance, bnbBalance, appState.simulatedBalances, isTelegram]);

  // Switch to BSC Network
  const switchToBSC = useCallback(async () => {
    if (switchChain && !isTelegram) {
      try {
        await switchChain({ chainId: bsc.id });
      } catch (error) {
        console.error('Failed to switch to BSC:', error);
        setUiState(prev => ({ ...prev, error: 'Failed to switch network' }));
      }
    }
  }, [switchChain, isTelegram]);

  // Generate unique pass ID
  const generatePassId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    const network = isTelegram ? 'TON' : 'RLT';
    return `${network}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;
  };

  // Generate pass pattern
  const generatePassPattern = (passId) => {
    const seed = passId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patterns = [
      'repeating-linear-gradient(45deg, rgba(163,255,18,0.1) 0px, rgba(163,255,18,0.1) 10px, transparent 10px, transparent 20px)',
      'repeating-linear-gradient(90deg, rgba(163,255,18,0.05) 0px, rgba(163,255,18,0.05) 15px, transparent 15px, transparent 30px)',
      'radial-gradient(circle at 20% 80%, rgba(163,255,18,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(163,255,18,0.05) 0%, transparent 50%)',
      'linear-gradient(135deg, rgba(163,255,18,0.08) 0%, transparent 50%, rgba(163,255,18,0.08) 100%)'
    ];
    return patterns[seed % patterns.length];
  };

  // Purchase Pass
  const purchasePass = useCallback(() => {
    const requiredAmount = isTelegram ? 1.0 : 500; // 1 TON or 500 RLT
    const currentBalance = isTelegram ? 
      parseFloat(balanceState.nativeBalance) : 
      parseFloat(balanceState.realRLT);
    
    if (currentBalance < requiredAmount) {
      setUiState(prev => ({ ...prev, showBuyModal: true }));
      return;
    }

    const passId = generatePassId();
    const newPass = {
      id: passId,
      purchaseDate: new Date(),
      tickets: isTelegram ? 10 : 5, // Different ticket amounts for different networks
      status: 'active',
      pattern: generatePassPattern(passId),
      roundValid: appState.currentRound,
      tokenSpent: requiredAmount,
      network: isTelegram ? 'TON' : 'BSC'
    };

    setParticipationState(prev => ({
      ...prev,
      myPasses: [newPass, ...prev.myPasses],
      myTickets: prev.myTickets + newPass.tickets,
      poolTotal: (parseFloat(prev.poolTotal) + requiredAmount).toFixed(2),
      participationHistory: [
        {
          id: Date.now(),
          type: 'pass_purchase',
          amount: requiredAmount,
          tickets: newPass.tickets,
          timestamp: new Date(),
          status: 'confirmed'
        },
        ...prev.participationHistory
      ]
    }));

    setAppState(prev => ({
      ...prev,
      totalParticipants: prev.totalParticipants + 1
    }));

    setUiState(prev => ({ 
      ...prev, 
      activePass: newPass,
      showPassModal: true 
    }));

  }, [balanceState.realRLT, balanceState.nativeBalance, isTelegram, appState.currentRound]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setUiState(prev => ({ ...prev, copiedAddress: true }));
        setTimeout(() => {
          setUiState(prev => ({ ...prev, copiedAddress: false }));
        }, 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  }, [walletAddress]);

  // Digital Pass Component
  const DigitalPass = ({ pass, isModal = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl border-2 border-green-400/30 ${
        isModal ? 'w-80 h-48' : 'w-full h-32'
      }`}
      style={{ background: pass.pattern }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/60 to-green-900/80"></div>
      
      {/* Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
      
      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-bold text-sm">RandomLotto {pass.network}</h3>
            <p className="text-green-400 text-xs font-mono">{pass.id}</p>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-lg">{pass.tickets}</div>
            <div className="text-xs text-gray-300">Tickets</div>
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-gray-300">Round #{pass.roundValid}</div>
            <div className="text-white text-xs">{pass.tokenSpent} {pass.network === 'TON' ? 'TON' : 'RLT'}</div>
          </div>
          <div className="text-right">
            <div className="text-white text-xs">
              {pass.purchaseDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/60 to-transparent animate-pulse"></div>
    </motion.div>
  );

  // Buy Modal
  const BuyModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setUiState(prev => ({ ...prev, showBuyModal: false }))}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-warm rounded-3xl p-6 max-w-sm w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-content relative z-10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 glass-light rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Need More {isTelegram ? 'TON' : 'RLT'}?</h3>
            <p className="text-sm text-gray-300">
              You need at least {isTelegram ? '1 TON' : '500 RLT'} to purchase a lottery pass
            </p>
          </div>

          <div className="space-y-3">
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {isTelegram ? 
                  parseFloat(balanceState.nativeBalance).toFixed(2) + ' TON' :
                  parseFloat(balanceState.realRLT).toFixed(2) + ' RLT'
                }
              </div>
              <div className="text-sm text-gray-400">Current Balance</div>
            </div>

            <button
              onClick={() => {
                if (isTelegram) {
                  window.open('https://t.me/wallet', '_blank');
                } else {
                  window.open('https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=' + RLT_CONTRACT_ADDRESS, '_blank');
                }
              }}
              className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiExternalLink className="w-5 h-5" />
                <span>Buy {isTelegram ? 'TON' : 'RLT'}</span>
              </div>
            </button>

            <button
              onClick={() => setUiState(prev => ({ ...prev, showBuyModal: false }))}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Pass Modal
  const PassModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setUiState(prev => ({ ...prev, showPassModal: false }))}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl p-6 max-w-sm w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-content relative z-10">
          <div className="text-center mb-6">
            <FiCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Pass Purchased!</h3>
            <p className="text-sm text-gray-300">
              Your digital lottery pass has been activated
            </p>
          </div>

          {uiState.activePass && (
            <div className="mb-6">
              <DigitalPass pass={uiState.activePass} isModal={true} />
            </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-dark rounded-2xl p-3 text-center">
                <div className="text-lg font-bold text-green-400">{uiState.activePass?.tickets}</div>
                <div className="text-xs text-gray-400">Tickets</div>
              </div>
              <div className="glass-dark rounded-2xl p-3 text-center">
                <div className="text-lg font-bold text-white">#{appState.currentRound}</div>
                <div className="text-xs text-gray-400">Round</div>
              </div>
            </div>

            <button
              onClick={() => setUiState(prev => ({ ...prev, showPassModal: false }))}
              className="glass-button w-full py-3 rounded-2xl font-bold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const hasEnoughBalance = isTelegram ? 
    parseFloat(balanceState.nativeBalance) >= 1.0 :
    parseFloat(balanceState.realRLT) >= 500;

  // Not connected state
  if (!isWalletConnected) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="glass-warm rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="glass-content relative z-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 glass-light rounded-3xl flex items-center justify-center mx-auto mb-4 relative">
                <CiWallet className="w-8 h-8 text-green-400" />
                <div className="absolute inset-0 bg-green-400/20 rounded-3xl animate-pulse"></div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Connect {isTelegram ? 'TON' : 'Crypto'} Wallet</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connect your wallet to participate in RandomLotto draws using {isTelegram ? 'TON tokens' : 'RLT tokens on Binance Smart Chain'}
              </p>
            </div>

            {isTelegram ? (
              <div className="glass glass-particles p-4 rounded-xl mb-6">
                <div className="flex flex-col items-center space-y-3">
                  <h3 className="text-white font-bold flex items-center space-x-2">
                    <CiWallet />
                    <span>Connect TON Wallet</span>
                  </h3>
                  <TonConnectButton />
                </div>
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3">
                  <CiWallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </div>
              </button>
            )}

            {uiState.error && (
              <div className="mt-4 p-4 glass-dark border-2 border-red-400/30 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{uiState.error}</p>
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
                    <p className="text-xs text-gray-400">Real wallet data, simulated transfers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wrong Network Warning for EVM */}
      {!isTelegram && isWrongNetwork && (
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

      {/* Wallet Header */}
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
                <button
                  onClick={copyAddress}
                  className="text-sm text-gray-400 font-mono hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                  {uiState.copiedAddress ? (
                    <FiCheck className="w-3 h-3 text-green-400" />
                  ) : (
                    <FiCopy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Refresh balances would go here
                }}
                disabled={balanceState.isLoading}
                className="p-2 glass-dark rounded-xl hover:glass-light transition-all duration-200"
              >
                <FiRefreshCw className={`w-4 h-4 text-gray-400 ${balanceState.isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  if (isTelegram) {
                    // TON disconnect would be handled by TonConnect
                  } else {
                    disconnect();
                  }
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Enhanced Balance Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-dark rounded-2xl p-4 text-center relative overflow-hidden">
              {balanceState.isLoading && (
                <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center rounded-2xl">
                  <FiLoader className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              <div className={`text-lg font-bold ${!hasEnoughBalance ? 'text-red-400' : 'text-white'}`}>
                {isTelegram ? 
                  parseFloat(balanceState.nativeBalance).toFixed(2) :
                  parseFloat(balanceState.realRLT).toLocaleString()
                }
              </div>
              <div className="text-xs text-gray-400">{isTelegram ? 'TON' : 'RLT'} Balance</div>
              <div className="text-xs text-green-400 mt-1">{isTelegram ? 'TON Network' : 'On-Chain'}</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {participationState.myTickets}
              </div>
              <div className="text-xs text-gray-400">My Tickets</div>
              <div className="text-xs text-blue-400 mt-1">Active</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {!hasEnoughBalance ? (
              <button
                onClick={() => setUiState(prev => ({ ...prev, showBuyModal: true }))}
                className="glass-button py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FiShoppingCart className="w-4 h-4" />
                  <span>Buy {isTelegram ? 'TON' : 'RLT'}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={purchasePass}
                className="glass-button py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FiCreditCard className="w-4 h-4" />
                  <span>Buy Pass</span>
                </div>
              </button>
            )}
            
            <button
              onClick={() => {
                const explorerUrl = isTelegram ?
                  `https://tonscan.org/address/${walletAddress}` :
                  `https://bscscan.com/address/${walletAddress}`;
                window.open(explorerUrl, '_blank');
              }}
              className="glass py-3 rounded-2xl font-bold text-white border-2 border-gray-600/30 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiExternalLink className="w-4 h-4" />
                <span>Explorer</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* My Passes Section */}
      {participationState.myPasses.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <div className="glass-content">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FiCreditCard className="w-5 h-5 text-green-400" />
              <span>My Passes</span>
              <span className="text-sm text-gray-400">({participationState.myPasses.length})</span>
            </h3>

            <div className="space-y-3">
              {participationState.myPasses.slice(0, 3).map((pass, index) => (
                <DigitalPass key={pass.id} pass={pass} />
              ))}
            </div>

            {participationState.myPasses.length > 3 && (
              <button className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                View All Passes ({participationState.myPasses.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pool Status */}
      <div className="glass-cool rounded-2xl p-6">
        <div className="glass-content">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiTarget className="w-5 h-5 text-blue-400" />
            <span>Current Draw</span>
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Prize Pool</span>
              <span className="text-lg font-bold text-white">
                {parseFloat(participationState.poolTotal).toLocaleString()} {isTelegram ? 'TON' : 'RLT'}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-3 rounded-full transition-all duration-1000 relative"
                style={{ 
                  width: `${Math.min((participationState.poolTotal / participationState.poolThreshold) * 100, 100)}%` 
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-bold text-white">
                  {appState.totalParticipants.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Players</div>
              </div>
              <div>
                <div className="text-sm font-bold text-green-400">
                  #{appState.currentRound}
                </div>
                <div className="text-xs text-gray-400">Round</div>
              </div>
              <div>
                <div className="text-sm font-bold text-purple-400">
                  {participationState.myTickets}
                </div>
                <div className="text-xs text-gray-400">My Tickets</div>
              </div>
            </div>
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
                    Participated: {activity.amount} {isTelegram ? 'TON' : 'RLT'}
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
        {uiState.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-dark border-2 border-red-400/30 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiAlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{uiState.error}</p>
              </div>
              <button
                onClick={() => setUiState(prev => ({ ...prev, error: null }))}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
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
            {appState.lastDrawWinner.toLowerCase() === walletAddress?.toLowerCase() && (
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
              <h4 className="text-white font-bold mb-1">{isTelegram ? 'TON' : 'Demo'} Mode Active</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isTelegram ? 
                  'Using real TON wallet connection. Purchase passes with actual TON tokens for lottery participation.' :
                  'This demo uses real RLT balance data from BSC but simulates transfers locally. No actual tokens are moved on the blockchain.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {uiState.showPassModal && <PassModal />}
        {uiState.showBuyModal && <BuyModal />}
      </AnimatePresence>
    </motion.div>
  );
};

export default RandomLottoParticipationEngine;

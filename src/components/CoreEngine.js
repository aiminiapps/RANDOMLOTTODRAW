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
  FiCopy,
  FiFilm,
  FiScissors
} from 'react-icons/fi';
import { CiWallet } from "react-icons/ci";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther, formatUnits } from 'viem';
import { bsc } from 'wagmi/chains';

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';

// TON RLT Token Contract (hypothetical - you'd need the actual TON RLT contract)
const TON_RLT_CONTRACT = 'EQC...'; // Your RLT token contract on TON

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

  // Balance State (Real RLT only, no native tokens)
  const [balanceState, setBalanceState] = useState({
    rltBalance: '0',
    nativeBalance: '0', // For gas fees only
    isLoading: false,
    tonRltBalance: '0' // RLT on TON network
  });

  // Participation State
  const [participationState, setParticipationState] = useState({
    amount: '',
    isParticipating: false,
    poolTotal: '0',
    poolThreshold: '50000',
    myTickets: 0,
    myPasses: [],
    participationHistory: [],
    demoTickets: [] // Demo tickets for users without RLT
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

  // Mock function to get TON RLT balance (replace with actual TON RLT contract call)
  const getTonRltBalance = useCallback(async (address) => {
    // Mock implementation - replace with actual TON RLT balance fetching
    try {
      // This would be replaced with actual TON RLT contract call
      // For now, return 0 to simulate no RLT on TON
      return '0';
    } catch (error) {
      console.error('Failed to fetch TON RLT balance:', error);
      return '0';
    }
  }, []);

  // Update balances when wallet connects
  useEffect(() => {
    const updateBalances = async () => {
      if (walletAddress) {
        if (isTelegram) {
          // TON wallet - get RLT balance on TON network
          const tonRlt = await getTonRltBalance(walletAddress);
          setBalanceState({
            rltBalance: '0', // No EVM RLT on TON
            nativeBalance: '0', // TON native balance would be fetched separately
            tonRltBalance: tonRlt,
            isLoading: false
          });
        } else {
          // EVM wallet - use real RLT balance on BSC
          setBalanceState({
            rltBalance: rltBalance ? formatUnits(rltBalance.value, rltBalance.decimals) : '0',
            nativeBalance: bnbBalance ? formatEther(bnbBalance.value) : '0',
            tonRltBalance: '0',
            isLoading: false
          });
        }
      } else {
        setBalanceState({
          rltBalance: '0',
          nativeBalance: '0',
          tonRltBalance: '0',
          isLoading: false
        });
      }
    };

    updateBalances();
  }, [walletAddress, rltBalance, bnbBalance, isTelegram, getTonRltBalance]);

  // Generate demo tickets for users without RLT
  useEffect(() => {
    if (walletAddress && !participationState.demoTickets.length) {
      const currentRltBalance = isTelegram ? 
        parseFloat(balanceState.tonRltBalance) : 
        parseFloat(balanceState.rltBalance);
      
      // If user has no RLT, generate demo tickets
      if (currentRltBalance === 0) {
        const demoTickets = Array.from({ length: 3 }, (_, index) => ({
          id: `DEMO-${Date.now()}-${index}`,
          type: 'demo',
          tickets: 1,
          network: isTelegram ? 'TON' : 'BSC',
          purchaseDate: new Date(),
          isDemo: true,
          status: 'demo'
        }));
        
        setParticipationState(prev => ({
          ...prev,
          demoTickets
        }));
      }
    }
  }, [walletAddress, balanceState.rltBalance, balanceState.tonRltBalance, isTelegram, participationState.demoTickets.length]);

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
    const network = isTelegram ? 'TON' : 'BSC';
    return `RLT-${network}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;
  };

  // Generate pass pattern
  const generatePassPattern = (passId, isDemo = false) => {
    const seed = passId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (isDemo) {
      return 'repeating-linear-gradient(45deg, rgba(100,100,100,0.1) 0px, rgba(100,100,100,0.1) 10px, transparent 10px, transparent 20px)';
    }
    
    const patterns = [
      'repeating-linear-gradient(45deg, rgba(163,255,18,0.1) 0px, rgba(163,255,18,0.1) 10px, transparent 10px, transparent 20px)',
      'repeating-linear-gradient(90deg, rgba(163,255,18,0.05) 0px, rgba(163,255,18,0.05) 15px, transparent 15px, transparent 30px)',
      'radial-gradient(circle at 20% 80%, rgba(163,255,18,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(163,255,18,0.05) 0%, transparent 50%)',
      'linear-gradient(135deg, rgba(163,255,18,0.08) 0%, transparent 50%, rgba(163,255,18,0.08) 100%)'
    ];
    return patterns[seed % patterns.length];
  };

  // Purchase Pass with RLT
  const purchasePass = useCallback(() => {
    const requiredRLT = 500; // 500 RLT for a pass
    const currentRltBalance = isTelegram ? 
      parseFloat(balanceState.tonRltBalance) : 
      parseFloat(balanceState.rltBalance);
    
    if (currentRltBalance < requiredRLT) {
      setUiState(prev => ({ ...prev, showBuyModal: true }));
      return;
    }

    const passId = generatePassId();
    const newPass = {
      id: passId,
      purchaseDate: new Date(),
      tickets: 5, // 500 RLT = 5 tickets
      status: 'active',
      pattern: generatePassPattern(passId),
      roundValid: appState.currentRound,
      rltSpent: requiredRLT,
      network: isTelegram ? 'TON' : 'BSC',
      isDemo: false,
      type: 'premium'
    };

    setParticipationState(prev => ({
      ...prev,
      myPasses: [newPass, ...prev.myPasses],
      myTickets: prev.myTickets + newPass.tickets,
      poolTotal: (parseFloat(prev.poolTotal) + requiredRLT).toFixed(0),
      participationHistory: [
        {
          id: Date.now(),
          type: 'pass_purchase',
          amount: requiredRLT,
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

  }, [balanceState.rltBalance, balanceState.tonRltBalance, isTelegram, appState.currentRound]);

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

  // Premium Movie-Style Ticket Component
  const PremiumTicket = ({ pass, isModal = false, isDemoTicket = false }) => {
    const ticketData = isDemoTicket ? pass : pass;
    const isDemo = isDemoTicket || ticketData.isDemo;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-2xl ${
          isModal ? 'w-80 h-56' : 'w-full h-44'
        } ${isDemo ? 'opacity-75' : ''}`}
        style={{ 
          background: isDemo ? 
            'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)' :
            'linear-gradient(135deg, #0B3D2E 0%, #145A32 50%, #0B3D2E 100%)'
        }}
      >
        {/* Movie ticket perforated edge */}
        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-white/20"></div>
        
        {/* Ticket hole punches */}
        <div className="absolute left-1 top-4 w-1 h-1 bg-gray-900 rounded-full"></div>
        <div className="absolute left-1 top-8 w-1 h-1 bg-gray-900 rounded-full"></div>
        <div className="absolute left-1 bottom-8 w-1 h-1 bg-gray-900 rounded-full"></div>
        <div className="absolute left-1 bottom-4 w-1 h-1 bg-gray-900 rounded-full"></div>
        
        {/* Demo watermark overlay */}
        {isDemo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl font-black text-gray-600/20 rotate-12 select-none">
              DEMO
            </div>
          </div>
        )}
        
        {/* Holographic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
        
        <div className="relative z-10 p-6 h-full flex flex-col justify-between ml-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FiFilm className={`w-4 h-4 ${isDemo ? 'text-gray-400' : 'text-green-400'}`} />
                <h3 className={`font-bold text-sm ${isDemo ? 'text-gray-300' : 'text-white'}`}>
                  RandomLotto {isDemo ? 'DEMO' : ticketData.network}
                </h3>
              </div>
              <p className={`text-xs font-mono ${isDemo ? 'text-gray-500' : 'text-green-400'}`}>
                {ticketData.id}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${isDemo ? 'text-gray-400' : 'text-yellow-400'}`}>
                {ticketData.tickets}
              </div>
              <div className={`text-xs ${isDemo ? 'text-gray-500' : 'text-gray-300'}`}>
                {ticketData.tickets === 1 ? 'TICKET' : 'TICKETS'}
              </div>
            </div>
          </div>
          
          {/* Movie ticket details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={isDemo ? 'text-gray-500' : 'text-gray-300'}>ROUND</span>
              <span className={`font-bold ${isDemo ? 'text-gray-400' : 'text-white'}`}>
                #{ticketData.roundValid || appState.currentRound}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={isDemo ? 'text-gray-500' : 'text-gray-300'}>SEAT</span>
              <span className={`font-bold font-mono ${isDemo ? 'text-gray-400' : 'text-white'}`}>
                {isDemo ? 'DEMO-A1' : `${ticketData.network}-${ticketData.tickets}`}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={isDemo ? 'text-gray-500' : 'text-gray-300'}>DATE</span>
              <span className={`font-bold ${isDemo ? 'text-gray-400' : 'text-white'}`}>
                {ticketData.purchaseDate ? ticketData.purchaseDate.toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
            {!isDemo && ticketData.rltSpent && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">PRICE</span>
                <span className="font-bold text-green-400">{ticketData.rltSpent} RLT</span>
              </div>
            )}
          </div>
          
          {/* Status badge */}
          <div className="flex justify-between items-end">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              isDemo ? 'bg-gray-600/50 text-gray-300' : 'bg-green-500/20 text-green-400'
            }`}>
              {isDemo ? 'DEMO TICKET' : 'VALID'}
            </div>
            <div className="text-right">
              <FiScissors className={`w-3 h-3 ${isDemo ? 'text-gray-500' : 'text-gray-400'} rotate-90`} />
            </div>
          </div>
        </div>

        {/* Barcode at bottom */}
        <div className="absolute bottom-2 left-8 right-4 h-6 bg-gradient-to-r from-transparent via-white/10 to-transparent">
          <div className="flex space-x-px h-full items-end">
            {Array.from({ length: 20 }, (_, i) => (
              <div 
                key={i} 
                className={`${isDemo ? 'bg-gray-600' : 'bg-white/30'} w-0.5`}
                style={{ height: `${20 + (i % 4) * 10}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Buy RLT Modal
  const BuyRLTModal = () => (
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
            <h3 className="text-xl font-bold text-white mb-2">Need RLT Tokens?</h3>
            <p className="text-sm text-gray-300">
              You need at least 500 RLT to purchase a lottery pass
            </p>
          </div>

          <div className="space-y-3">
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {isTelegram ? 
                  parseFloat(balanceState.tonRltBalance).toFixed(0) + ' RLT' :
                  parseFloat(balanceState.rltBalance).toFixed(0) + ' RLT'
                }
              </div>
              <div className="text-sm text-gray-400">Current RLT Balance</div>
              <div className="text-xs text-gray-500 mt-1">
                {isTelegram ? 'TON Network' : 'BSC Network'}
              </div>
            </div>

            <button
              onClick={() => {
                if (isTelegram) {
                  // Link to TON RLT DEX (would need actual TON DEX for RLT)
                  window.open('https://dedust.io/', '_blank');
                } else {
                  // Link to PancakeSwap for RLT on BSC
                  window.open('https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=' + RLT_CONTRACT_ADDRESS, '_blank');
                }
              }}
              className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiExternalLink className="w-5 h-5" />
                <span>Buy RLT on {isTelegram ? 'DeDust' : 'PancakeSwap'}</span>
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
            <h3 className="text-xl font-bold text-white mb-2">Ticket Purchased!</h3>
            <p className="text-sm text-gray-300">
              Your premium lottery ticket has been issued
            </p>
          </div>

          {uiState.activePass && (
            <div className="mb-6">
              <PremiumTicket pass={uiState.activePass} isModal={true} />
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

  const hasEnoughRLT = isTelegram ? 
    parseFloat(balanceState.tonRltBalance) >= 500 :
    parseFloat(balanceState.rltBalance) >= 500;

  const currentRltBalance = isTelegram ? balanceState.tonRltBalance : balanceState.rltBalance;

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
              <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connect your wallet to participate in RandomLotto draws using RLT tokens
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
                  <p className="text-gray-400 text-xs text-center">
                    Connect to access RLT tokens on TON network
                  </p>
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
                    <h4 className="text-white font-bold text-sm">RLT Token Required</h4>
                    <p className="text-xs text-gray-400">Uses RLT tokens on {isTelegram ? 'TON' : 'BSC'} network</p>
                  </div>
                </div>
              </div>

              <div className="glass-cool rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <FiFilm className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Premium Tickets</h4>
                    <p className="text-xs text-gray-400">Movie-style lottery tickets with unique IDs</p>
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
            Please switch to Binance Smart Chain to access RLT tokens
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

          {/* Enhanced Balance Display - RLT Only */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-dark rounded-2xl p-4 text-center relative overflow-hidden">
              {balanceState.isLoading && (
                <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center rounded-2xl">
                  <FiLoader className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              <div className={`text-lg font-bold ${!hasEnoughRLT ? 'text-red-400' : 'text-white'}`}>
                {parseFloat(currentRltBalance).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">RLT Balance</div>
              <div className="text-xs text-green-400 mt-1">{isTelegram ? 'TON Network' : 'BSC Network'}</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {participationState.myTickets}
              </div>
              <div className="text-xs text-gray-400">My Tickets</div>
              <div className="text-xs text-blue-400 mt-1">Active</div>
            </div>
          </div>

          {/* Network & Gas Info */}
          <div className="glass-cool rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Network</span>
              <span className="text-sm font-bold text-white">
                {isTelegram ? 'TON' : 'BSC'} • RLT Token
              </span>
            </div>
            {!isTelegram && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-300">Gas Balance</span>
                <span className="text-sm font-bold text-blue-400">
                  {parseFloat(balanceState.nativeBalance).toFixed(4)} BNB
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            {!hasEnoughRLT ? (
              <button
                onClick={() => setUiState(prev => ({ ...prev, showBuyModal: true }))}
                className="glass-button py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FiShoppingCart className="w-4 h-4" />
                  <span>Buy RLT</span>
                </div>
              </button>
            ) : (
              <button
                onClick={purchasePass}
                className="glass-button py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FiFilm className="w-4 h-4" />
                  <span>Buy Ticket</span>
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

      {/* Demo Tickets Section (for users without RLT) */}
      {participationState.demoTickets.length > 0 && parseFloat(currentRltBalance) === 0 && (
        <div className="glass rounded-3xl p-6">
          <div className="glass-content">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FiFilm className="w-5 h-5 text-gray-400" />
              <span>Demo Tickets</span>
              <span className="text-sm text-gray-400">(Preview Only)</span>
            </h3>

            <div className="space-y-3 mb-4">
              {participationState.demoTickets.map((ticket, index) => (
                <PremiumTicket key={ticket.id} pass={ticket} isDemoTicket={true} />
              ))}
            </div>

            <div className="glass-dark rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">
                These are demo tickets. Purchase RLT tokens to get real lottery tickets.
              </p>
              <button
                onClick={() => setUiState(prev => ({ ...prev, showBuyModal: true }))}
                className="glass-button py-2 px-4 rounded-xl text-white font-medium text-sm"
              >
                Get RLT to Play
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Real Tickets Section */}
      {participationState.myPasses.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <div className="glass-content">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FiFilm className="w-5 h-5 text-green-400" />
              <span>My Tickets</span>
              <span className="text-sm text-gray-400">({participationState.myPasses.length})</span>
            </h3>

            <div className="space-y-3">
              {participationState.myPasses.slice(0, 3).map((pass, index) => (
                <PremiumTicket key={pass.id} pass={pass} />
              ))}
            </div>

            {participationState.myPasses.length > 3 && (
              <button className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                View All Tickets ({participationState.myPasses.length})
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
                {parseFloat(participationState.poolTotal).toLocaleString()} RLT
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

      {/* Info Card */}
      <div className="glass-cool rounded-2xl p-4">
        <div className="glass-content">
          <div className="flex items-start space-x-3">
            <FiShield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold mb-1">RLT Token Lottery</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Purchase premium movie-style tickets with RLT tokens. 500 RLT = 5 tickets. 
                {parseFloat(currentRltBalance) === 0 && ' Demo tickets shown - get RLT to participate!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {uiState.showPassModal && <PassModal />}
        {uiState.showBuyModal && <BuyRLTModal />}
      </AnimatePresence>
    </motion.div>
  );
};

export default RandomLottoParticipationEngine;

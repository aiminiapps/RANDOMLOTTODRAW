'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiLoader, FiAlertTriangle, FiTarget, FiZap, FiShield,
  FiTrendingUp, FiDollarSign, FiGift, FiUsers, FiStar, FiCreditCard,
  FiExternalLink, FiRefreshCw, FiAward, FiHash, FiCalendar, FiClock,
  FiShoppingCart, FiCopy, FiFilm, FiScissors, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiInfo, FiHelpCircle, FiTrendingDown,
   FiPieChart, FiActivity, FiEye, FiEyeOff
} from 'react-icons/fi';
import { IoBarChartOutline } from "react-icons/io5";
import { CiWallet } from "react-icons/ci";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther, formatUnits } from 'viem';
import { bsc } from 'wagmi/chains';

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';

const EnhancedRandomLottoEngine = () => {
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

  // Detect environment
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  const isWrongNetwork = chainId && chainId !== bsc.id;
  const isWalletConnected = isTelegram ? !!tonWallet : isConnected;
  const walletAddress = isTelegram ? tonWallet?.account?.address : address;

  // Enhanced State Management
  const [balanceState, setBalanceState] = useState({
    rltBalance: '0',
    nativeBalance: '0',
    isLoading: false,
    tonRltBalance: '0'
  });

  const [participationState, setParticipationState] = useState({
    myTickets: 0,
    myPasses: [],
    participationHistory: [],
    demoTickets: [],
    totalSpent: 0,
    winChance: 0
  });

  const [appState, setAppState] = useState({
    totalParticipants: 1247,
    currentRound: 15,
    lastDrawWinner: null,
    poolTotal: '42350',
    nextDrawTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    recentWinners: [
      { address: '0x1234...5678', amount: '2500 RLT', time: '2h ago' },
      { address: '0xabcd...efgh', amount: '1800 RLT', time: '4h ago' },
      { address: '0x9876...4321', amount: '3200 RLT', time: '6h ago' }
    ]
  });

  const [uiState, setUiState] = useState({
    error: null,
    showPassModal: false,
    activePass: null,
    showBuyModal: false,
    copiedAddress: false,
    showTutorial: false,
    soundEnabled: true,
    showStats: false,
    currentView: 'home', // 'home', 'tickets', 'stats', 'history'
    isDrawing: false,
    showWinners: false,
    animateBalance: false
  });

  const [telegramUser, setTelegramUser] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Initialize app
  useEffect(() => {
    // Get Telegram user data
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

    // Initialize demo data for unconnected users
    if (!isWalletConnected) {
      const guestTickets = Array.from({ length: 2 }, (_, index) => ({
        id: `GUEST-${Date.now()}-${index}`,
        type: 'guest',
        tickets: 1,
        network: 'DEMO',
        purchaseDate: new Date(),
        isDemo: true,
        status: 'preview'
      }));
      
      setParticipationState(prev => ({
        ...prev,
        demoTickets: guestTickets
      }));
    }

    // Start countdown timer
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = appState.nextDrawTime.getTime() - now;
      
      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWalletConnected, appState.nextDrawTime]);

  // Mock TON RLT balance fetch
  const getTonRltBalance = useCallback(async (address) => {
    try {
      return '0'; // Mock implementation
    } catch (error) {
      console.error('Failed to fetch TON RLT balance:', error);
      return '0';
    }
  }, []);

  // Update balances when wallet connects
  useEffect(() => {
    const updateBalances = async () => {
      if (walletAddress) {
        setBalanceState(prev => ({ ...prev, isLoading: true }));
        
        if (isTelegram) {
          const tonRlt = await getTonRltBalance(walletAddress);
          setBalanceState({
            rltBalance: '0',
            nativeBalance: '0',
            tonRltBalance: tonRlt,
            isLoading: false
          });
        } else {
          setBalanceState({
            rltBalance: rltBalance ? formatUnits(rltBalance.value, rltBalance.decimals) : '0',
            nativeBalance: bnbBalance ? formatEther(bnbBalance.value) : '0',
            tonRltBalance: '0',
            isLoading: false
          });
          
          // Animate balance update
          setUiState(prev => ({ ...prev, animateBalance: true }));
          setTimeout(() => {
            setUiState(prev => ({ ...prev, animateBalance: false }));
          }, 1000);
        }

        // Generate demo tickets if no RLT
        const currentRltBalance = isTelegram ? 
          parseFloat(balanceState.tonRltBalance) : 
          parseFloat(balanceState.rltBalance);
          
        if (currentRltBalance === 0 && !participationState.demoTickets.length) {
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
            demoTickets,
            winChance: Math.random() * 5 // Mock win chance
          }));
        }
      }
    };

    updateBalances();
  }, [walletAddress, rltBalance, bnbBalance, isTelegram, getTonRltBalance]);

  // Play sound effect (mock)
  const playSound = useCallback((soundType) => {
    if (uiState.soundEnabled) {
      // Mock sound - in real app you'd play actual sounds
      console.log(`Playing sound: ${soundType}`);
    }
  }, [uiState.soundEnabled]);

  // Generate unique pass ID
  const generatePassId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    const network = isTelegram ? 'TON' : 'BSC';
    return `RLT-${network}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;
  };

  // Enhanced Premium Ticket Component
  const EnhancedPremiumTicket = ({ pass, isModal = false, isDemoTicket = false }) => {
    const ticketData = isDemoTicket ? pass : pass;
    const isDemo = isDemoTicket || ticketData.isDemo || ticketData.type === 'guest';
    const isGuest = ticketData.type === 'guest';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        whileHover={{ scale: isModal ? 1 : 1.02, rotateY: 5 }}
        className={`relative overflow-hidden rounded-2xl ${
          isModal ? 'w-80 h-52' : 'w-full h-36'
        } ${isDemo ? 'opacity-80' : ''} cursor-pointer`}
        style={{ 
          background: isGuest ? 
            'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #4338ca 100%)' :
            isDemo ? 
              'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)' :
              'linear-gradient(135deg, #0B3D2E 0%, #145A32 50%, #0B3D2E 100%)'
        }}
      >
        {/* Animated background particles */}
        {!isDemo && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Ticket perforated edge */}
        <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute left-3 top-0 h-full border-l-2 border-dashed border-white/20"></div>
        
        {/* Ticket hole punches */}
        {Array.from({ length: 4 }, (_, i) => (
          <div 
            key={i}
            className="absolute left-1 w-1.5 h-1.5 bg-gray-900 rounded-full"
            style={{ top: `${20 + i * 20}%` }}
          />
        ))}
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {isGuest && (
            <div className="px-2 py-1 bg-indigo-500/80 rounded-full text-xs font-bold text-white">
              GUEST
            </div>
          )}
          {isDemo && !isGuest && (
            <div className="px-2 py-1 bg-gray-600/80 rounded-full text-xs font-bold text-gray-200">
              DEMO
            </div>
          )}
          {!isDemo && !isGuest && (
            <div className="px-2 py-1 bg-green-500/80 rounded-full text-xs font-bold text-white">
              LIVE
            </div>
          )}
        </div>

        {/* Demo watermark */}
        {(isDemo || isGuest) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="text-6xl font-black text-gray-600/10 rotate-12 select-none"
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {isGuest ? 'PREVIEW' : 'DEMO'}
            </motion.div>
          </div>
        )}
        
        {/* Holographic effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"
          animate={{ x: [-100, 300] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10 p-4 h-full flex flex-col justify-between ml-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <FiFilm className={`w-4 h-4 ${
                    isGuest ? 'text-indigo-300' :
                    isDemo ? 'text-gray-400' : 'text-green-400'
                  }`} />
                </motion.div>
                <h3 className={`font-bold text-sm ${
                  isGuest ? 'text-indigo-100' :
                  isDemo ? 'text-gray-300' : 'text-white'
                }`}>
                  RandomLotto {isGuest ? 'PREVIEW' : isDemo ? 'DEMO' : ticketData.network}
                </h3>
              </div>
              <p className={`text-xs font-mono ${
                isGuest ? 'text-indigo-400' :
                isDemo ? 'text-gray-500' : 'text-green-400'
              }`}>
                {ticketData.id}
              </p>
            </div>
            
            <div className="text-right">
              <motion.div 
                className={`text-2xl font-black ${
                  isGuest ? 'text-indigo-300' :
                  isDemo ? 'text-gray-400' : 'text-yellow-400'
                }`}
                animate={!isDemo ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {ticketData.tickets}
              </motion.div>
              <div className={`text-xs ${
                isGuest ? 'text-indigo-500' :
                isDemo ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {ticketData.tickets === 1 ? 'TICKET' : 'TICKETS'}
              </div>
            </div>
          </div>
          
          {/* Movie ticket details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={isGuest ? 'text-indigo-500' : isDemo ? 'text-gray-500' : 'text-gray-300'}>
                ROUND
              </span>
              <span className={`font-bold ${
                isGuest ? 'text-indigo-200' :
                isDemo ? 'text-gray-400' : 'text-white'
              }`}>
                #{ticketData.roundValid || appState.currentRound}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className={isGuest ? 'text-indigo-500' : isDemo ? 'text-gray-500' : 'text-gray-300'}>
                SEAT
              </span>
              <span className={`font-bold font-mono ${
                isGuest ? 'text-indigo-200' :
                isDemo ? 'text-gray-400' : 'text-white'
              }`}>
                {isGuest ? 'PREV-A1' : isDemo ? 'DEMO-A1' : `${ticketData.network}-${ticketData.tickets}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className={isGuest ? 'text-indigo-500' : isDemo ? 'text-gray-500' : 'text-gray-300'}>
                DATE
              </span>
              <span className={`font-bold ${
                isGuest ? 'text-indigo-200' :
                isDemo ? 'text-gray-400' : 'text-white'
              }`}>
                {ticketData.purchaseDate ? ticketData.purchaseDate.toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
            
            {!isDemo && !isGuest && ticketData.rltSpent && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">PRICE</span>
                <span className="font-bold text-green-400">{ticketData.rltSpent} RLT</span>
              </div>
            )}
          </div>
          
          {/* Status and scissors */}
          <div className="flex justify-between items-end">
            <motion.div 
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                isGuest ? 'bg-indigo-500/30 text-indigo-300' :
                isDemo ? 'bg-gray-600/50 text-gray-300' : 'bg-green-500/20 text-green-400'
              }`}
              animate={!isDemo ? { 
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0.3)',
                  '0 0 0 8px rgba(34, 197, 94, 0)',
                ] 
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isGuest ? 'PREVIEW MODE' : isDemo ? 'DEMO TICKET' : 'VALID ENTRY'}
            </motion.div>
            
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiScissors className={`w-3 h-3 ${
                isGuest ? 'text-indigo-500' :
                isDemo ? 'text-gray-500' : 'text-gray-400'
              } rotate-90`} />
            </motion.div>
          </div>
        </div>

        {/* Animated barcode */}
        <div className="absolute bottom-2 left-8 right-4 h-6">
          <div className="flex space-x-px h-full items-end overflow-hidden">
            {Array.from({ length: 25 }, (_, i) => (
              <motion.div 
                key={i} 
                className={`${
                  isGuest ? 'bg-indigo-400/60' :
                  isDemo ? 'bg-gray-600' : 'bg-white/30'
                } w-0.5`}
                style={{ height: `${20 + (i % 4) * 15}%` }}
                animate={!isDemo ? {
                  opacity: [0.3, 1, 0.3],
                  scaleY: [0.8, 1, 0.8]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Navigation Component
  const NavigationTabs = () => (
    <div className="glass rounded-2xl p-1 mb-6">
      <div className="flex space-x-1">
        {[
          { id: 'home', icon: FiTarget, label: 'Home' },
          { id: 'tickets', icon: FiFilm, label: 'Tickets' },
          { id: 'stats', icon: IoBarChartOutline, label: 'Stats' },
          { id: 'history', icon: FiClock, label: 'History' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setUiState(prev => ({ ...prev, currentView: tab.id }))}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              uiState.currentView === tab.id
                ? 'glass-button text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Live Statistics Component
  const LiveStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <FiActivity className="w-5 h-5 text-green-400" />
          <span>Live Statistics</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-dark rounded-2xl p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-green-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {appState.totalParticipants.toLocaleString()}
            </motion.div>
            <div className="text-xs text-gray-400">Total Players</div>
          </div>
          
          <div className="glass-dark rounded-2xl p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-blue-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              {appState.poolTotal}
            </motion.div>
            <div className="text-xs text-gray-400">RLT Pool</div>
          </div>
        </div>

        <div className="glass-cool rounded-2xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center space-x-2">
            <FiTrendingUp className="w-4 h-4 text-green-400" />
            <span>Recent Winners</span>
          </h4>
          <div className="space-y-2">
            {appState.recentWinners.map((winner, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-between p-2 glass-dark rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <div className="text-sm text-white font-mono">
                    {winner.address}
                  </div>
                  <div className="text-xs text-gray-400">{winner.time}</div>
                </div>
                <div className="text-sm font-bold text-green-400">
                  {winner.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Countdown Timer Component
  const CountdownTimer = () => (
    <motion.div
      className="glass-cool rounded-2xl p-4 mb-4"
      animate={{ 
        boxShadow: [
          '0 0 20px rgba(163, 255, 18, 0.1)',
          '0 0 30px rgba(163, 255, 18, 0.2)',
          '0 0 20px rgba(163, 255, 18, 0.1)'
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-bold flex items-center space-x-2">
          <FiClock className="w-4 h-4 text-green-400" />
          <span>Next Draw</span>
        </h4>
        <button
          onClick={() => playSound('click')}
          className="p-1 glass-dark rounded-lg hover:glass-light transition-all duration-200"
        >
          {uiState.soundEnabled ? 
            <FiVolume2 className="w-3 h-3 text-gray-400" /> : 
            <FiVolumeX className="w-3 h-3 text-gray-400" />
          }
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Hours', value: countdown.hours },
          { label: 'Minutes', value: countdown.minutes },
          { label: 'Seconds', value: countdown.seconds }
        ].map((item, index) => (
          <div key={item.label} className="text-center">
            <motion.div 
              className="text-2xl font-black text-green-400"
              animate={{ scale: index === 2 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {item.value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Tutorial Component
  const TutorialOverlay = () => (
    <AnimatePresence>
      {uiState.showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setUiState(prev => ({ ...prev, showTutorial: false }))}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-warm rounded-3xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <FiHelpCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">How to Play</h3>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                <div>Connect your wallet to access your RLT tokens</div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                <div>Purchase lottery tickets with 500 RLT (= 5 tickets)</div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                <div>Wait for the draw and check if you won!</div>
              </div>
            </div>
            
            <button
              onClick={() => setUiState(prev => ({ ...prev, showTutorial: false }))}
              className="glass-button w-full py-3 rounded-2xl font-bold text-white mt-6"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Main Content Renderer
  const renderContent = () => {
    switch (uiState.currentView) {
      case 'stats':
        return <LiveStats />;
      
      case 'tickets':
        return (
          <div className="space-y-4">
            {participationState.myPasses.length > 0 ? (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">My Tickets</h3>
                <div className="space-y-3">
                  {participationState.myPasses.map((pass, index) => (
                    <EnhancedPremiumTicket key={pass.id} pass={pass} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-6 text-center">
                <FiFilm className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No tickets yet</p>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Participation History</h3>
            {participationState.participationHistory.length > 0 ? (
              <div className="space-y-3">
                {participationState.participationHistory.map((activity) => (
                  <div key={activity.id} className="glass-dark rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">
                        {activity.amount} RLT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No history yet</p>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <CountdownTimer />
            
            {/* Pool Status */}
            <div className="glass-cool rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <FiTarget className="w-5 h-5 text-blue-400" />
                <span>Current Prize Pool</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Total Pool</span>
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {parseFloat(appState.poolTotal).toLocaleString()} RLT
                  </motion.span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-3 rounded-full relative"
                    style={{ width: `${Math.min((appState.poolTotal / 100000) * 100, 100)}%` }}
                    animate={{
                      background: [
                        'linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)',
                        'linear-gradient(to right, #3b82f6, #8b5cf6, #10b981)',
                        'linear-gradient(to right, #8b5cf6, #10b981, #3b82f6)',
                        'linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)'
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">
                      {appState.totalParticipants.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Players</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      #{appState.currentRound}
                    </div>
                    <div className="text-xs text-gray-400">Round</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">
                      {participationState.myTickets}
                    </div>
                    <div className="text-xs text-gray-400">My Tickets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const currentRltBalance = isTelegram ? balanceState.tonRltBalance : balanceState.rltBalance;
  const hasEnoughRLT = parseFloat(currentRltBalance) >= 500;

  return (
    <motion.div 
      className="w-full max-w-md mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with floating action buttons */}
      <div className="relative">
        <div className="glass-light rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white">RandomLotto</h1>
              <p className="text-sm text-green-400">Blockchain Lottery Platform</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUiState(prev => ({ ...prev, showTutorial: true }))}
                className="p-2 glass-dark rounded-xl hover:glass-light transition-all duration-200"
              >
                <FiHelpCircle className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setUiState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                className="p-2 glass-dark rounded-xl hover:glass-light transition-all duration-200"
              >
                {uiState.soundEnabled ? 
                  <FiVolume2 className="w-4 h-4 text-green-400" /> : 
                  <FiVolumeX className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>

          {isWalletConnected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 glass-warm rounded-2xl flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {telegramUser?.firstName || 'Player'}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      setUiState(prev => ({ ...prev, copiedAddress: true }));
                      playSound('copy');
                      setTimeout(() => {
                        setUiState(prev => ({ ...prev, copiedAddress: false }));
                      }, 2000);
                    }}
                    className="text-sm text-gray-400 font-mono hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                    {uiState.copiedAddress ? 
                      <FiCheck className="w-3 h-3 text-green-400" /> : 
                      <FiCopy className="w-3 h-3" />
                    }
                  </button>
                </div>
              </div>
              
              <motion.div 
                className={`text-right ${uiState.animateBalance ? 'animate-pulse' : ''}`}
                animate={hasEnoughRLT ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className={`text-xl font-bold ${hasEnoughRLT ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(currentRltBalance).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">RLT Balance</div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FiTarget className="w-12 h-12 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-lg font-bold text-white mb-2">Welcome to RandomLotto</h2>
              <p className="text-sm text-gray-300 mb-4">
                Experience blockchain lottery with real RLT tokens
              </p>
              
              {isTelegram ? (
                <div className="glass glass-particles p-4 rounded-xl">
                  <TonConnectButton />
                </div>
              ) : (
                <button
                  onClick={() => {
                    open();
                    playSound('click');
                  }}
                  className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <CiWallet className="w-5 h-5" />
                    <span>Connect Wallet</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <NavigationTabs />

      {/* Demo/Guest Tickets Section for non-connected users */}
      {!isWalletConnected && participationState.demoTickets.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiEye className="w-5 h-5 text-indigo-400" />
            <span>Preview Tickets</span>
            <div className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
              Guest Mode
            </div>
          </h3>

          <div className="space-y-3 mb-4">
            {participationState.demoTickets.map((ticket, index) => (
              <EnhancedPremiumTicket key={ticket.id} pass={ticket} isDemoTicket={true} />
            ))}
          </div>

          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-gray-300 text-sm mb-3">
              🎭 These are preview tickets showing how the lottery system works.
            </p>
            <p className="text-indigo-400 text-sm mb-4">
              Connect your wallet and get RLT tokens to participate in real draws!
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUiState(prev => ({ ...prev, showTutorial: true }))}
                className="glass py-2 px-4 rounded-xl text-white font-medium text-sm border border-gray-600/30 hover:border-indigo-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FiInfo className="w-4 h-4" />
                  <span>How it Works</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  if (isTelegram) {
                    // Show TON Connect
                  } else {
                    open();
                  }
                  playSound('click');
                }}
                className="glass-button py-2 px-4 rounded-xl text-white font-medium text-sm hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CiWallet className="w-4 h-4" />
                  <span>Get Started</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Tickets Section for connected users without RLT */}
      {isWalletConnected && participationState.demoTickets.length > 0 && parseFloat(currentRltBalance) === 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiFilm className="w-5 h-5 text-gray-400" />
            <span>Demo Tickets</span>
            <span className="text-sm text-gray-400">(Preview Only)</span>
          </h3>

          <div className="space-y-3 mb-4">
            {participationState.demoTickets.map((ticket, index) => (
              <EnhancedPremiumTicket key={ticket.id} pass={ticket} isDemoTicket={true} />
            ))}
          </div>

          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-3">
              These are demo tickets showing the lottery experience.
            </p>
            <button
              onClick={() => setUiState(prev => ({ ...prev, showBuyModal: true }))}
              className="glass-button py-2 px-4 rounded-xl text-white font-medium"
            >
              Get RLT to Play Real
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}

      {/* Floating Action Button for Quick Actions */}
      {isWalletConnected && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <button
            onClick={() => {
              if (hasEnoughRLT) {
                // Trigger purchase flow
                playSound('purchase');
              } else {
                setUiState(prev => ({ ...prev, showBuyModal: true }));
              }
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
              hasEnoughRLT 
                ? 'glass-button hover:scale-110' 
                : 'bg-red-500/80 hover:bg-red-500'
            }`}
            style={{
              boxShadow: hasEnoughRLT 
                ? '0 0 30px rgba(163, 255, 18, 0.4)' 
                : '0 0 30px rgba(239, 68, 68, 0.4)'
            }}
          >
            {hasEnoughRLT ? <FiZap className="w-6 h-6" /> : <FiShoppingCart className="w-6 h-6" />}
          </button>
        </motion.div>
      )}

      {/* Tutorial Overlay */}
      <TutorialOverlay />

      {/* All existing modals would go here with enhanced animations */}
      {/* ... (Buy Modal, Pass Modal, etc.) */}
    </motion.div>
  );
};

export default EnhancedRandomLottoEngine;

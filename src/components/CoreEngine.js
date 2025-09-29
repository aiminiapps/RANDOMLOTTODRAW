'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiLoader, FiAlertTriangle, FiTarget, FiZap, FiShield,
  FiTrendingUp, FiDollarSign, FiGift, FiUsers, FiStar, FiCreditCard,
  FiExternalLink, FiRefreshCw, FiAward, FiHash, FiCalendar, FiClock,
  FiShoppingCart, FiCopy, FiFilm, FiScissors, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiInfo, FiHelpCircle, FiTrendingDown,
   FiPieChart, FiActivity, FiEye, FiEyeOff, FiHome
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

// Memoized Premium Ticket Component (Prevents re-rendering)
const EnhancedPremiumTicket = React.memo(({ pass, isModal = false, isDemoTicket = false }) => {
  const ticketData = isDemoTicket ? pass : pass;
  const isDemo = isDemoTicket || ticketData.isDemo || ticketData.type === 'guest';
  const isGuest = ticketData.type === 'guest';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      whileHover={{ scale: isModal ? 1 : 1.02, rotateY: 5 }}
      className={`relative overflow-hidden rounded-3xl ${
        isModal ? 'w-80 h-64' : 'w-full h-48' // Increased height significantly
      } ${isDemo ? 'opacity-85' : ''} cursor-pointer shadow-2xl`}
      style={{ 
        background: isGuest ? 
          'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #4338ca 100%)' :
          isDemo ? 
            'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)' :
            'linear-gradient(135deg, #0B3D2E 0%, #145A32 50%, #0B3D2E 100%)',
        boxShadow: isDemo ? 
          '0 10px 30px rgba(0,0,0,0.3)' : 
          '0 15px 40px rgba(163, 255, 18, 0.2)'
      }}
    >
      {/* Animated background particles */}
      {!isDemo && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 bg-white/25 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Left perforated edge - wider */}
      <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
      <div className="absolute left-4 top-0 h-full border-l-2 border-dashed border-white/25"></div>
      
      {/* Ticket hole punches - more spaced */}
      {Array.from({ length: 6 }, (_, i) => (
        <div 
          key={`hole-${i}`}
          className="absolute left-1.5 w-2 h-2 bg-gray-900 rounded-full shadow-inner"
          style={{ top: `${15 + i * 12}%` }}
        />
      ))}
      
      {/* Top status badges */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {isGuest && (
          <motion.div 
            className="px-3 py-1.5 bg-indigo-500/90 rounded-full text-xs font-bold text-white shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            GUEST MODE
          </motion.div>
        )}
        {isDemo && !isGuest && (
          <div className="px-3 py-1.5 bg-gray-600/90 rounded-full text-xs font-bold text-gray-200 shadow-lg">
            DEMO TICKET
          </div>
        )}
        {!isDemo && !isGuest && (
          <motion.div 
            className="px-3 py-1.5 bg-green-500/90 rounded-full text-xs font-bold text-white shadow-lg"
            animate={{ 
              boxShadow: [
                '0 0 10px rgba(34, 197, 94, 0.4)',
                '0 0 20px rgba(34, 197, 94, 0.6)',
                '0 0 10px rgba(34, 197, 94, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LIVE ENTRY
          </motion.div>
        )}
      </div>

      {/* Main watermark - larger and more prominent */}
      {(isDemo || isGuest) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            className="text-8xl font-black text-gray-600/8 rotate-12 select-none"
            animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {isGuest ? 'PREVIEW' : 'DEMO'}
          </motion.div>
        </div>
      )}
      
      {/* Holographic scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-12"
        animate={{ x: [-200, 400] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-between ml-4">
        {/* Header Section - More space */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <FiFilm className={`w-6 h-6 ${
                  isGuest ? 'text-indigo-300' :
                  isDemo ? 'text-gray-400' : 'text-green-400'
                }`} />
              </motion.div>
              <h3 className={`font-bold text-lg ${
                isGuest ? 'text-indigo-100' :
                isDemo ? 'text-gray-300' : 'text-white'
              }`}>
                RandomLotto {isGuest ? 'PREVIEW' : isDemo ? 'DEMO' : ticketData.network}
              </h3>
            </div>
            <p className={`text-sm font-mono tracking-wider ${
              isGuest ? 'text-indigo-400' :
              isDemo ? 'text-gray-500' : 'text-green-400'
            }`}>
              {ticketData.id}
            </p>
          </div>
          
          <div className="text-right">
            <motion.div 
              className={`text-4xl font-black ${
                isGuest ? 'text-indigo-300' :
                isDemo ? 'text-gray-400' : 'text-yellow-400'
              }`}
              animate={!isDemo ? { 
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 10px currentColor',
                  '0 0 20px currentColor',
                  '0 0 10px currentColor'
                ]
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {ticketData.tickets}
            </motion.div>
            <div className={`text-sm font-medium ${
              isGuest ? 'text-indigo-500' :
              isDemo ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {ticketData.tickets === 1 ? 'TICKET' : 'TICKETS'}
            </div>
          </div>
        </div>
        
        {/* Middle Section - Movie ticket details with more space */}
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={isGuest ? 'text-indigo-500' : isDemo ? 'text-gray-500' : 'text-gray-300'}>
                  ROUND
                </span>
                <span className={`font-bold ${
                  isGuest ? 'text-indigo-200' :
                  isDemo ? 'text-gray-400' : 'text-white'
                }`}>
                  #{ticketData.roundValid || 15}
                </span>
              </div>
              
              <div className="flex justify-between">
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
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
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
                <div className="flex justify-between">
                  <span className="text-gray-300">PRICE</span>
                  <span className="font-bold text-green-400">{ticketData.rltSpent} RLT</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Status and elements */}
        <div className="flex justify-between items-end">
          <motion.div 
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              isGuest ? 'bg-indigo-500/30 text-indigo-300' :
              isDemo ? 'bg-gray-600/50 text-gray-300' : 'bg-green-500/20 text-green-400'
            }`}
            animate={!isDemo && !isGuest ? { 
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                '0 0 0 10px rgba(34, 197, 94, 0)',
              ] 
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isGuest ? 'PREVIEW MODE' : isDemo ? 'DEMO TICKET' : 'VALID ENTRY'}
          </motion.div>
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiScissors className={`w-4 h-4 ${
              isGuest ? 'text-indigo-500' :
              isDemo ? 'text-gray-500' : 'text-gray-400'
            } rotate-90`} />
          </motion.div>
        </div>
      </div>

      {/* Enhanced animated barcode */}
      <div className="absolute bottom-3 left-10 right-6 h-8">
        <div className="flex space-x-px h-full items-end overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div 
              key={`bar-${i}`}
              className={`${
                isGuest ? 'bg-indigo-400/70' :
                isDemo ? 'bg-gray-600' : 'bg-white/40'
              } w-0.5`}
              style={{ height: `${25 + (i % 5) * 15}%` }}
              animate={!isDemo ? {
                opacity: [0.4, 1, 0.4],
                scaleY: [0.8, 1.1, 0.8]
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

EnhancedPremiumTicket.displayName = 'EnhancedPremiumTicket';

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
    nextDrawTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    recentWinners: [
      { address: '0x1234...5678', amount: '2,500 RLT', time: '2h ago', round: 14 },
      { address: '0xabcd...efgh', amount: '1,800 RLT', time: '4h ago', round: 14 },
      { address: '0x9876...4321', amount: '3,200 RLT', time: '6h ago', round: 13 },
      { address: '0x5555...9999', amount: '950 RLT', time: '8h ago', round: 13 },
      { address: '0x7777...1111', amount: '1,200 RLT', time: '12h ago', round: 12 }
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
    currentView: 'home',
    isDrawing: false,
    showWinners: false,
    animateBalance: false
  });

  const [telegramUser, setTelegramUser] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Navigation tabs configuration
  const navigationTabs = useMemo(() => [
    { 
      id: 'home', 
      icon: FiHome, 
      label: 'Home',
      description: 'Main lottery dashboard'
    },
    { 
      id: 'tickets', 
      icon: FiFilm, 
      label: 'Tickets',
      description: 'Your lottery entries'
    },
    { 
      id: 'stats', 
      icon: IoBarChartOutline, 
      label: 'Stats',
      description: 'Live lottery statistics'
    },
    { 
      id: 'history', 
      icon: FiClock, 
      label: 'History',
      description: 'Past participation'
    }
  ], []);

  // Memoized ticket data to prevent re-renders
  const memoizedTickets = useMemo(() => ({
    demoTickets: participationState.demoTickets,
    realTickets: participationState.myPasses
  }), [participationState.demoTickets, participationState.myPasses]);

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
        tickets: 1 + index,
        network: 'DEMO',
        purchaseDate: new Date(),
        isDemo: true,
        status: 'preview',
        roundValid: 15
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

  // Fixed Navigation Component with smooth transitions
  const NavigationTabs = React.memo(() => (
    <div className="glass rounded-3xl p-2 mb-6 shadow-xl">
      <div className="flex space-x-1 relative">
        {navigationTabs.map((tab, index) => {
          const isActive = uiState.currentView === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                setUiState(prev => ({ ...prev, currentView: tab.id }));
                // Add haptic feedback for mobile
                if ('vibrate' in navigator) {
                  navigator.vibrate(10);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center space-y-1 py-4 px-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'glass-button text-white transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: isActive ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active background indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                animate={isActive ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-green-400' : ''}`} />
              </motion.div>
              <span className={`text-xs font-bold ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </span>
              
              {/* Active glow effect */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(163, 255, 18, 0.3)',
                      '0 0 40px rgba(163, 255, 18, 0.5)',
                      '0 0 20px rgba(163, 255, 18, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  ));

  NavigationTabs.displayName = 'NavigationTabs';

  // Enhanced content renderers with more information
  const renderTicketsView = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* My Tickets Section */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <FiFilm className="w-6 h-6 text-green-400" />
            <span>My Tickets</span>
          </h3>
          <div className="glass-dark rounded-2xl px-4 py-2">
            <span className="text-green-400 font-bold">{memoizedTickets.realTickets.length}</span>
            <span className="text-gray-400 text-sm ml-1">Active</span>
          </div>
        </div>
        
        {memoizedTickets.realTickets.length > 0 ? (
          <div className="space-y-4">
            {memoizedTickets.realTickets.map((pass, index) => (
              <motion.div
                key={pass.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedPremiumTicket pass={pass} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiFilm className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No tickets yet</p>
            <p className="text-gray-500 text-sm">Purchase RLT tokens to get lottery tickets</p>
          </motion.div>
        )}
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {participationState.totalSpent}
          </div>
          <div className="text-xs text-gray-400">RLT Spent</div>
        </div>
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {(participationState.winChance || 0).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Win Chance</div>
        </div>
      </div>
    </motion.div>
  );

  const renderStatsView = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Live Pool Stats */}
      <div className="glass rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <FiActivity className="w-6 h-6 text-green-400" />
          <span>Live Statistics</span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="glass-dark rounded-2xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="text-3xl font-bold text-green-400 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {appState.totalParticipants.toLocaleString()}
            </motion.div>
            <div className="text-sm text-gray-400">Total Players</div>
            <div className="text-xs text-green-500 mt-1">+23 today</div>
          </motion.div>
          
          <motion.div 
            className="glass-dark rounded-2xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="text-3xl font-bold text-blue-400 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              {parseFloat(appState.poolTotal).toLocaleString()}
            </motion.div>
            <div className="text-sm text-gray-400">RLT Pool</div>
            <div className="text-xs text-blue-500 mt-1">+1.2K today</div>
          </motion.div>
        </div>

        {/* Pool Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Pool Progress</span>
            <span className="text-sm text-white font-bold">
              {((parseFloat(appState.poolTotal) / 100000) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-4 rounded-full relative"
              style={{ width: `${Math.min((parseFloat(appState.poolTotal) / 100000) * 100, 100)}%` }}
              animate={{
                background: [
                  'linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)',
                  'linear-gradient(to right, #3b82f6, #8b5cf6, #10b981)',
                  'linear-gradient(to right, #8b5cf6, #10b981, #3b82f6)',
                  'linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Recent Winners */}
        <div className="glass-cool rounded-2xl p-4">
          <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
            <FiTrendingUp className="w-5 h-5 text-green-400" />
            <span>Recent Winners</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              Last 24h
            </span>
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {appState.recentWinners.map((winner, index) => (
              <motion.div 
                key={`winner-${index}`}
                className="flex items-center justify-between p-3 glass-dark rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <FiAward className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-mono">
                      {winner.address}
                    </div>
                    <div className="text-xs text-gray-400">
                      Round #{winner.round} • {winner.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">
                    {winner.amount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-lg font-bold text-purple-400">47.2%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-lg font-bold text-yellow-400">2.3x</div>
          <div className="text-xs text-gray-400">Avg Payout</div>
        </div>
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-lg font-bold text-cyan-400">156</div>
          <div className="text-xs text-gray-400">Games Today</div>
        </div>
      </div>
    </motion.div>
  );

  const renderHistoryView = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <FiClock className="w-6 h-6 text-blue-400" />
          <span>Participation History</span>
        </h3>
        
        {participationState.participationHistory.length > 0 ? (
          <div className="space-y-4">
            {participationState.participationHistory.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="glass-dark rounded-2xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <FiCreditCard className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {activity.type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      {activity.amount} RLT
                    </div>
                    <div className="text-xs text-gray-400">
                      {activity.tickets} tickets
                    </div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  activity.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {activity.status.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No history yet</p>
            <p className="text-gray-500 text-sm">Your lottery participation will appear here</p>
          </motion.div>
        )}
      </div>

      {/* History Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {participationState.participationHistory.length}
          </div>
          <div className="text-xs text-gray-400">Total Entries</div>
        </div>
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {participationState.participationHistory.reduce((sum, activity) => sum + activity.amount, 0)}
          </div>
          <div className="text-xs text-gray-400">RLT Invested</div>
        </div>
      </div>
    </motion.div>
  );

  // Countdown Timer Component
  const CountdownTimer = React.memo(() => (
    <motion.div
      className="glass-cool rounded-3xl p-6 mb-6"
      animate={{ 
        boxShadow: [
          '0 0 20px rgba(163, 255, 18, 0.1)',
          '0 0 30px rgba(163, 255, 18, 0.2)',
          '0 0 20px rgba(163, 255, 18, 0.1)'
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold flex items-center space-x-2">
          <FiClock className="w-5 h-5 text-green-400" />
          <span>Next Draw</span>
        </h4>
        <div className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          Round #{appState.currentRound}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hours', value: countdown.hours, color: 'text-red-400' },
          { label: 'Minutes', value: countdown.minutes, color: 'text-yellow-400' },
          { label: 'Seconds', value: countdown.seconds, color: 'text-green-400' }
        ].map((item, index) => (
          <div key={item.label} className="text-center">
            <motion.div 
              className={`text-3xl font-black ${item.color}`}
              animate={{ 
                scale: index === 2 ? [1, 1.1, 1] : [1, 1.05, 1],
                textShadow: [
                  '0 0 10px currentColor',
                  '0 0 20px currentColor',
                  '0 0 10px currentColor'
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {item.value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-sm text-gray-400 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  ));

  CountdownTimer.displayName = 'CountdownTimer';

  // Main Content Renderer with smooth transitions
  const renderContent = () => {
    switch (uiState.currentView) {
      case 'tickets':
        return renderTicketsView();
      case 'stats':
        return renderStatsView();
      case 'history':
        return renderHistoryView();
      default:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CountdownTimer />
            
            {/* Current Pool Status */}
            <div className="glass-cool rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <FiTarget className="w-6 h-6 text-blue-400" />
                <span>Current Prize Pool</span>
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-300">Total Pool</span>
                  <motion.span 
                    className="text-4xl font-bold text-white"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {parseFloat(appState.poolTotal).toLocaleString()} RLT
                  </motion.span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-4 rounded-full relative"
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-white">
                      {appState.totalParticipants.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Players</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-green-400">
                      #{appState.currentRound}
                    </div>
                    <div className="text-sm text-gray-400">Round</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-purple-400">
                      {participationState.myTickets}
                    </div>
                    <div className="text-sm text-gray-400">My Tickets</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  const currentRltBalance = isTelegram ? balanceState.tonRltBalance : balanceState.rltBalance;
  const hasEnoughRLT = parseFloat(currentRltBalance) >= 500;

  return (
    <motion.div 
      className="w-full max-w-md mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header - Enhanced */}
      <div className="glass-light rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1 
              className="text-3xl font-black text-white"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(163, 255, 18, 0.5)',
                  '0 0 30px rgba(163, 255, 18, 0.8)',
                  '0 0 20px rgba(163, 255, 18, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              RandomLotto
            </motion.h1>
            <p className="text-sm text-green-400 font-medium">Blockchain Lottery Platform</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setUiState(prev => ({ ...prev, showTutorial: true }))}
              className="p-3 glass-dark rounded-xl hover:glass-light transition-all duration-200"
            >
              <FiHelpCircle className="w-5 h-5 text-gray-400" />
            </button>
            
            <button
              onClick={() => setUiState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className="p-3 glass-dark rounded-xl hover:glass-light transition-all duration-200"
            >
              {uiState.soundEnabled ? 
                <FiVolume2 className="w-5 h-5 text-green-400" /> : 
                <FiVolumeX className="w-5 h-5 text-gray-400" />
              }
            </button>
          </div>
        </div>

        {isWalletConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-warm rounded-2xl flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">
                  {telegramUser?.firstName || 'Player'}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    setUiState(prev => ({ ...prev, copiedAddress: true }));
                    setTimeout(() => {
                      setUiState(prev => ({ ...prev, copiedAddress: false }));
                    }, 2000);
                  }}
                  className="text-sm text-gray-400 font-mono hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                  {uiState.copiedAddress ? 
                    <FiCheck className="w-4 h-4 text-green-400" /> : 
                    <FiCopy className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
            
            <motion.div 
              className="text-right"
              animate={hasEnoughRLT ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`text-2xl font-bold ${hasEnoughRLT ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(currentRltBalance).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">RLT Balance</div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiTarget className="w-16 h-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to RandomLotto</h2>
            <p className="text-sm text-gray-300 mb-6">
              Experience blockchain lottery with real RLT tokens
            </p>
            
            {isTelegram ? (
              <div className="glass glass-particles p-4 rounded-xl">
                <TonConnectButton />
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3">
                  <CiWallet className="w-6 h-6" />
                  <span>Connect Wallet</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Demo/Guest Tickets for unconnected users */}
      {!isWalletConnected && memoizedTickets.demoTickets.length > 0 && (
        <motion.div 
          className="glass rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <FiEye className="w-6 h-6 text-indigo-400" />
            <span>Preview Tickets</span>
            <div className="text-sm bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">
              Guest Mode
            </div>
          </h3>

          <div className="space-y-4 mb-6">
            {memoizedTickets.demoTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <EnhancedPremiumTicket pass={ticket} isDemoTicket={true} />
              </motion.div>
            ))}
          </div>

          <div className="glass-dark rounded-2xl p-6 text-center">
            <p className="text-gray-300 text-sm mb-4">
              🎭 These are preview tickets showing how the lottery system works.
            </p>
            <p className="text-indigo-400 text-sm mb-6">
              Connect your wallet and get RLT tokens to participate in real draws!
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUiState(prev => ({ ...prev, showTutorial: true }))}
                className="glass py-3 px-4 rounded-xl text-white font-medium border border-gray-600/30 hover:border-indigo-400/50 transition-all duration-300"
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
                }}
                className="glass-button py-3 px-4 rounded-xl text-white font-medium hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CiWallet className="w-4 h-4" />
                  <span>Get Started</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={uiState.currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedRandomLottoEngine;

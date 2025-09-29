'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiTarget, FiHelpCircle,
  FiTrendingUp, FiCopy, FiFilm, FiActivity, FiEye,
  FiNavigation, FiVolumeX, FiVolume2
} from 'react-icons/fi';
import { CiWallet } from "react-icons/ci";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther, formatUnits } from 'viem';
import { useStore } from '@/lib/storage';

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';

// Draw Types and Pricing
const DRAW_TYPES = [
  { 
    id: '1_winner', 
    label: '1 Winner Draw', 
    price: 1, 
    maxParticipation: 1000,
    description: '1 RLT = 1 drawing chance'
  },
  { 
    id: '10_winner', 
    label: '10 Winner Draw', 
    price: 10, 
    maxParticipation: 1000,
    description: '10 RLT = 1 drawing chance'
  },
  { 
    id: '100_winner', 
    label: '100 Winner Draw', 
    price: 100, 
    maxParticipation: 1000,
    description: '100 RLT = 1 drawing chance'
  },
  { 
    id: '1000_winner', 
    label: '1000 Winner Draw', 
    price: 1000, 
    maxParticipation: 1000,
    description: '1000 RLT = 1 drawing chance'
  }
];

// Gray Themed Boarding Pass Ticket Component
const GrayBoardingPassTicket = React.memo(({ pass, isModal = false, isDemoTicket = false, onClick }) => {
  const ticketData = isDemoTicket ? pass : pass;
  const isDemo = isDemoTicket || ticketData.isDemo || ticketData.type === 'guest';
  const isGuest = ticketData.type === 'guest';
  const isDemoRlt = ticketData.isDemoRlt;
  
  // Safe date handling
  const formatDate = (dateValue) => {
    try {
      let date;
      if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        date = new Date();
      }
      
      if (isNaN(date.getTime())) {
        date = new Date();
      }
      
      return date.toLocaleDateString('en-GB').replace(/\//g, '.');
    } catch (error) {
      return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: isModal ? 1 : 1.02,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${
        isModal ? 'w-80 h-96' : 'w-full h-[420px]'
      } cursor-pointer transition-all duration-300 shadow-lg`}
      style={{ 
        background: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)'
      }}
    >
      {/* Main ticket body */}
      <div className="relative h-full">
        
        {/* Top section */}
        <div className="flex justify-between items-start p-6 border-b border-gray-500">
          <div>
            <div className="text-xs text-gray-300 font-medium mb-1">
              Ticket number
            </div>
            <div className="text-lg font-bold text-white">
              {ticketData.id?.replace('RLT-', '').slice(0, 8) || 'RL9090'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isDemo && (
              <div className="px-2 py-1 bg-gray-600 rounded-full text-xs font-bold text-gray-200">
                {isDemoRlt ? 'DEMO' : isGuest ? 'GUEST' : 'DEMO'}
              </div>
            )}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-bold text-sm">R</span>
            </div>
          </div>
        </div>

        {/* Main content section */}
        <div className="px-6 pt-4 pb-6">
          {/* Destination style header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                RDL
              </div>
              <div className="text-xs text-gray-300">
                RandomLotto
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-gray-400"></div>
              <FiNavigation className="w-4 h-4 text-gray-300 rotate-90" />
              <div className="w-8 h-0.5 bg-gray-400"></div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                WIN
              </div>
              <div className="text-xs text-gray-300">
                Prize Pool
              </div>
            </div>
          </div>

          {/* Flight details style info */}
          <div className="grid grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <div className="text-[10px] text-gray-400 mb-1">Draw Type</div>
              <div className="font-bold text-white">
                {ticketData.drawType?.replace(' Draw', '') || '1W'}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] text-gray-400 mb-1">Date</div>
              <div className="font-bold text-white text-[10px]">
                {formatDate(ticketData.purchaseDate)}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] text-gray-400 mb-1">Round</div>
              <div className="font-bold text-white">
                #{ticketData.roundValid || 15}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] text-gray-400 mb-1">Chances</div>
              <div className="font-bold text-white">
                {ticketData.drawingChances || ticketData.tickets || 1}
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-400 mb-1">Gate</div>
              <div className="font-bold text-white">
                {Math.floor(Math.random() * 9) + 1}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-400 mb-1">Seat</div>
              <div className="font-bold text-white">
                {String.fromCharCode(65 + Math.floor(Math.random() * 3))}{Math.floor(Math.random() * 9) + 1}
              </div>
            </div>
            
            {ticketData.rltSpent && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Cost</div>
                <div className="font-bold text-white">
                  {ticketData.rltSpent} RLT
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Perforated tear line */}
        <div className="absolute left-0 right-0 bottom-16 border-b-2 border-dashed border-gray-500"></div>

        {/* Bottom section with barcode */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-700">
          <div className="barcode-container">
            <svg className="w-full h-8" viewBox="0 0 200 32">
              {/* Generate barcode pattern */}
              {Array.from({ length: 50 }, (_, i) => {
                const width = Math.random() > 0.5 ? 2 : 1;
                const height = 20 + Math.random() * 8;
                return (
                  <rect
                    key={i}
                    x={i * 4}
                    y={32 - height}
                    width={width}
                    height={height}
                    fill="white"
                    className={isDemo ? 'opacity-60' : 'opacity-90'}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="text-xs text-center text-gray-300 mt-2 font-mono">
            {ticketData.id || 'RANDOMLOTTO-BOARDING-PASS-2025'}
          </div>
        </div>

        {/* Demo watermark */}
        {(isDemo || isGuest || isDemoRlt) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-7xl font-black text-gray-700/10 rotate-12 select-none">
              {isGuest ? 'PREVIEW' : 'DEMO'}
            </div>
          </div>
        )}

        {/* Corner cut effect */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-gray-600 transform rotate-45 translate-x-3 -translate-y-3"></div>
      </div>
    </motion.div>
  );
});

GrayBoardingPassTicket.displayName = 'GrayBoardingPassTicket';

// Navigation Component (unchanged)
const NavigationTabs = React.memo(({ currentView, onViewChange, isConnected }) => {
  const tabs = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'stats', label: 'Stats' },
    { id: 'history', label: 'History' }
  ], []);

  const handleTabClick = useCallback((tabId) => {
    if (!isConnected && (tabId === 'tickets' || tabId === 'history')) {
      return;
    }
    onViewChange(tabId);
  }, [isConnected, onViewChange]);

  return (
    <div className="glass rounded-2xl p-1 mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const isDisabled = !isConnected && (tab.id === 'tickets' || tab.id === 'history');
          const isActive = currentView === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={isDisabled}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? 'glass-button text-white'
                  : isDisabled 
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

NavigationTabs.displayName = 'NavigationTabs';

// Live Statistics Component (unchanged)
const LiveStats = React.memo(({ appState }) => (
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
        <motion.div 
          className="glass-dark rounded-2xl p-4 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-2xl font-bold text-green-400">
            {appState.totalParticipants?.toLocaleString() || '1,247'}
          </div>
          <div className="text-xs text-gray-400">Total Players</div>
        </motion.div>
        
        <div 
          className="glass-dark rounded-2xl p-4 text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="text-2xl font-bold text-blue-400">
            {appState.poolTotal || '42,350'}
          </div>
          <div className="text-xs text-gray-400">RLT Pool</div>
        </div>
      </div>

      <div className="glass-cool rounded-2xl p-4">
        <h4 className="text-white font-bold mb-3 flex items-center space-x-2">
          <FiTrendingUp className="w-4 h-4 text-green-400" />
          <span>Recent Winners</span>
        </h4>
        <div className="space-y-2">
          {(appState.recentWinners || []).map((winner, index) => (
            <motion.div 
              key={`winner-${index}`}
              className="flex items-center justify-between p-2 glass-dark rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
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
));

LiveStats.displayName = 'LiveStats';

// Main Component with Zustand Storage
const EnhancedRandomLottoEngine = () => {
  // Zustand store
  const { 
    user, 
    spaiPoints, 
    agentTickets, 
    agentPasses, 
    setUser, 
    addTicket, 
    addPass,
    addSpaiPoints
  } = useStore();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const tonWallet = useTonWallet();
  
  const { data: rltBalance } = useBalance({ 
    address, 
    token: RLT_CONTRACT_ADDRESS
  });

  // Environment detection
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  const isWalletConnected = isTelegram ? !!tonWallet : isConnected;
  const walletAddress = isTelegram ? tonWallet?.account?.address : address;

  // Local state
  const [balanceState, setBalanceState] = useState({
    rltBalance: '0',
    fakeRltBalance: '0',
    isLoading: false
  });

  const [uiState, setUiState] = useState({
    currentView: 'home',
    showTutorial: false,
    soundEnabled: true,
    copiedAddress: false,
    showPassModal: false,
    activePass: null,
    showBuyModal: false,
    selectedDrawType: DRAW_TYPES[0],
    participationAmount: '1'
  });

  // Demo tickets for non-connected users
  const [demoTickets, setDemoTickets] = useState([]);

  // Dev feature: Track taps on RLT Balance
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  // Memoized app state 
  const appState = useMemo(() => ({
    totalParticipants: 1247,
    currentRound: 15,
    poolTotal: '42350',
    poolThreshold: 5000,
    recentWinners: [
      { address: '0x1234...5678', amount: '2500 RLT', time: '2h ago' },
      { address: '0xabcd...efgh', amount: '1800 RLT', time: '4h ago' },
      { address: '0x9876...4321', amount: '3200 RLT', time: '6h ago' }
    ]
  }), []);

  // Set user when wallet connects
  useEffect(() => {
    if (isWalletConnected && walletAddress && !user) {
      const telegramUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
      setUser({
        address: walletAddress,
        name: telegramUser?.first_name || 'Player',
        id: telegramUser?.id || walletAddress
      });
    }
  }, [isWalletConnected, walletAddress, user, setUser]);

  // Generate demo tickets for non-connected users
  useEffect(() => {
    if (!isWalletConnected && demoTickets.length === 0) {
      const guestTickets = Array.from({ length: 2 }, (_, index) => ({
        id: `GUEST-${Date.now()}-${index}`,
        type: 'guest',
        drawingChances: 1,
        drawType: '1 Winner',
        network: 'DEMO',
        purchaseDate: new Date(),
        isDemo: true,
        status: 'preview',
        roundValid: 15
      }));
      
      setDemoTickets(guestTickets);
    }
  }, [isWalletConnected, demoTickets.length]);

  // Update balance when wallet connects
  useEffect(() => {
    if (walletAddress && rltBalance) {
      setBalanceState(prev => ({
        ...prev,
        rltBalance: formatUnits(rltBalance.value, rltBalance.decimals),
        isLoading: false
      }));
    } else if (!walletAddress) {
      setBalanceState(prev => ({
        ...prev,
        rltBalance: '0',
        isLoading: false
      }));
    }
  }, [walletAddress, rltBalance]);

  // Generate unique pass ID
  const generatePassId = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    const network = isTelegram ? 'TON' : 'BSC';
    return `RLT-${network}-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;
  }, [isTelegram]);

  // Purchase Pass Function with Zustand
  const purchasePass = useCallback(() => {
    const participationAmount = parseInt(uiState.participationAmount);
    const drawType = uiState.selectedDrawType;
    const totalCost = participationAmount * drawType.price;
    
    if (participationAmount > drawType.maxParticipation) {
      setUiState(prev => ({ 
        ...prev, 
        error: `Maximum participation is ${drawType.maxParticipation} RLT for ${drawType.label}` 
      }));
      return;
    }
    
    const realBalance = parseFloat(balanceState.rltBalance) || 0;
    const fakeBalance = parseFloat(balanceState.fakeRltBalance) || 0;
    const totalBalance = realBalance + fakeBalance;
    
    if (totalBalance < totalCost) {
      setUiState(prev => ({ ...prev, showBuyModal: true }));
      return;
    }

    const passId = generatePassId();
    const isUsingDemoRlt = fakeBalance > 0 && realBalance < totalCost;
    
    const newPass = {
      id: passId,
      purchaseDate: new Date().toISOString(), // Store as ISO string
      drawingChances: participationAmount,
      drawType: drawType.label,
      status: 'active',
      roundValid: appState.currentRound,
      rltSpent: totalCost,
      network: isTelegram ? 'TON' : 'BSC',
      isDemo: false,
      isDemoRlt: isUsingDemoRlt,
      type: 'premium',
      rewardRlt: participationAmount * 10
    };

    // Deduct from fake balance if using demo RLT
    if (isUsingDemoRlt) {
      const newFakeBalance = Math.max(0, fakeBalance - totalCost).toString();
      setBalanceState(prev => ({
        ...prev,
        fakeRltBalance: newFakeBalance
      }));
    }

    // Add to Zustand store
    addPass(newPass);
    addSpaiPoints(newPass.rewardRlt); // Add reward points

    setUiState(prev => ({ 
      ...prev, 
      activePass: newPass,
      showPassModal: true 
    }));

  }, [
    uiState.participationAmount, 
    uiState.selectedDrawType, 
    balanceState.rltBalance, 
    balanceState.fakeRltBalance, 
    generatePassId, 
    appState.currentRound, 
    isTelegram,
    addPass,
    addSpaiPoints
  ]);

  // Dev feature: Handle RLT Balance taps
  const handleRltBalanceTap = useCallback(() => {
    if (!isWalletConnected) return;
    
    tapCountRef.current += 1;
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    if (tapCountRef.current === 4) {
      const newFakeBalance = (parseFloat(balanceState.fakeRltBalance) + 50).toString();
      setBalanceState(prev => ({
        ...prev,
        fakeRltBalance: newFakeBalance
      }));
      
      tapCountRef.current = 0;
      console.log('🎯 Dev mode: +50 fake RLT added');
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 2000);
    }
  }, [isWalletConnected, balanceState.fakeRltBalance]);

  // Event handlers
  const handleViewChange = useCallback((view) => {
    setUiState(prev => ({ ...prev, currentView: view }));
  }, []);

  const handleCopyAddress = useCallback(async () => {
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

  const handleToggleSound = useCallback(() => {
    setUiState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const handleShowTutorial = useCallback(() => {
    setUiState(prev => ({ ...prev, showTutorial: true }));
  }, []);

  const handleCloseTutorial = useCallback(() => {
    setUiState(prev => ({ ...prev, showTutorial: false }));
  }, []);

  const handleTicketClick = useCallback((ticket) => {
    console.log('Ticket clicked:', ticket.id);
  }, []);

  // Content renderer
  const renderContent = useMemo(() => {
    if (!isWalletConnected) {
      if (uiState.currentView === 'stats') {
        return <LiveStats appState={appState} />;
      }
      
      return (
        <div className="glass rounded-3xl p-6 text-center">
          <CiWallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-400 mb-6">
            Connect your wallet to access {uiState.currentView === 'tickets' ? 'your tickets' : 'participation history'}
          </p>
          
          {isTelegram ? (
            <div className="glass glass-particles p-4 rounded-xl">
              <TonConnectButton />
            </div>
          ) : (
            <button
              onClick={open}
              className="glass-button w-full py-3 rounded-2xl font-bold text-white"
            >
              <div className="flex items-center justify-center space-x-2">
                <CiWallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </div>
            </button>
          )}
        </div>
      );
    }

    switch (uiState.currentView) {
      case 'stats':
        return <LiveStats appState={appState} />;
      
      case 'tickets':
        return (
          <div className="space-y-4">
            {agentPasses && agentPasses.length > 0 ? (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">My Tickets</h3>
                <div className="space-y-4">
                  {agentPasses.map((pass) => (
                    <GrayBoardingPassTicket 
                      key={pass.id} 
                      pass={pass} 
                      onClick={() => handleTicketClick(pass)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-6 text-center">
                <FiFilm className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Tickets Yet</h3>
                <p className="text-sm text-gray-400 mb-4">Participate in RandomLotto draws to get started</p>
                <button
                  onClick={purchasePass}
                  disabled={parseFloat(balanceState.rltBalance) + parseFloat(balanceState.fakeRltBalance) < uiState.selectedDrawType.price}
                  className="glass-button py-2 px-4 rounded-xl text-white font-medium disabled:opacity-50"
                >
                  Participate Now
                </button>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Participation History</h3>
            {agentPasses && agentPasses.length > 0 ? (
              <div className="space-y-3">
                {agentPasses.map((pass) => (
                  <motion.div 
                    key={pass.id} 
                    className="glass-dark rounded-2xl p-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">
                          {pass.drawType}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(pass.purchaseDate).toLocaleString()}
                        </div>
                        {pass.isDemoRlt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Purchased with DEMO RLT
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${pass.isDemoRlt ? 'text-gray-400' : 'text-green-400'}`}>
                          {pass.rltSpent} {pass.isDemoRlt ? 'DEMO RLT' : 'RLT'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {pass.drawingChances} chances • {pass.rewardRlt} RLT reward
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No History Yet</h3>
                <p className="text-sm text-gray-400">Your participation history will appear here</p>
              </div>
            )}
          </div>
        );
      
      default: // home
        return (
          <div className="space-y-4">
            {/* Updated Participation Section */}
            <div className="glass-warm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Participate in RandomLotto Draw</h3>
              
              {/* Draw Type Selection */}
              <div className="mb-4">
                <label className="text-sm text-gray-300 mb-2 block">Select Draw Type</label>
                <select 
                  value={uiState.selectedDrawType.id}
                  onChange={(e) => {
                    const drawType = DRAW_TYPES.find(dt => dt.id === e.target.value);
                    setUiState(prev => ({ ...prev, selectedDrawType: drawType }));
                  }}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-green-400 outline-none"
                >
                  {DRAW_TYPES.map(drawType => (
                    <option key={drawType.id} value={drawType.id}>
                      {drawType.label} - {drawType.price} RLT per chance
                    </option>
                  ))}
                </select>
              </div>

              {/* Participation Amount Input */}
              <div className="mb-4">
                <label className="text-sm text-gray-300 mb-2 block">Participation Amount (RLT)</label>
                <input 
                  type="number"
                  min="1"
                  max={uiState.selectedDrawType.maxParticipation}
                  value={uiState.participationAmount}
                  onChange={(e) => setUiState(prev => ({ ...prev, participationAmount: e.target.value }))}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-green-400 outline-none"
                  placeholder="Enter amount (1-1000)"
                />
                <div className="text-xs text-gray-400 mt-2">
                  Cost: {parseInt(uiState.participationAmount || 1) * uiState.selectedDrawType.price} RLT • 
                  Chances: {parseInt(uiState.participationAmount || 1)} • 
                  Reward: {parseInt(uiState.participationAmount || 1) * 10} RLT
                </div>
              </div>

              {/* Rules */}
              <div className="glass-dark rounded-2xl p-4 mb-4">
                <div className="space-y-2 text-xs text-gray-400">
                  <p>• You get one drawing chance per {uiState.selectedDrawType.price} RLT</p>
                  <p>• Maximum participation: {uiState.selectedDrawType.maxParticipation} RLT per wallet</p>
                  <p>• Reward: 10 RLT per 1 RLT participation</p>
                  <p>• Draw proceeds only if total pool exceeds 5,000 RLT</p>
                </div>
              </div>
              
              <button
                onClick={purchasePass}
                disabled={
                  parseFloat(balanceState.rltBalance) + parseFloat(balanceState.fakeRltBalance) < 
                  parseInt(uiState.participationAmount || 1) * uiState.selectedDrawType.price
                }
                className="glass-button w-full py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center space-x-3">
                  <FiTarget className="w-5 h-5" />
                  <span>Participate ({parseInt(uiState.participationAmount || 1) * uiState.selectedDrawType.price} RLT)</span>
                </div>
              </button>
            </div>

            {/* Pool Status */}
            <div className="glass-cool rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <FiTarget className="w-5 h-5 text-blue-400" />
                <span>Current Prize Pool</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Total Pool</span>
                  <span className="text-2xl font-bold text-white">
                    {parseFloat(appState.poolTotal).toLocaleString()} RLT
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-3 rounded-full"
                    style={{ width: `${Math.min((appState.poolTotal / appState.poolThreshold) * 100, 100)}%` }}
                  />
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
                      {agentPasses?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">My Tickets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }, [
    uiState.currentView, 
    isWalletConnected, 
    isTelegram, 
    appState, 
    agentPasses,
    purchasePass, 
    balanceState,
    uiState.selectedDrawType,
    uiState.participationAmount,
    open, 
    handleTicketClick
  ]);

  // Calculate display balance
  const totalRltBalance = useMemo(() => {
    const real = parseFloat(balanceState.rltBalance) || 0;
    const fake = parseFloat(balanceState.fakeRltBalance) || 0;
    return { real, fake, total: real + fake };
  }, [balanceState.rltBalance, balanceState.fakeRltBalance]);

  return (
    <motion.div 
      className="w-full max-w-md mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="glass-light rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white">RandomLotto</h1>
            <p className="text-sm text-green-400">Blockchain Lottery Platform</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">Points: {spaiPoints}</div>
            <button
              onClick={handleShowTutorial}
              className="p-2 glass-dark rounded-xl hover:glass-light transition-all duration-200"
            >
              <FiHelpCircle className="w-4 h-4 text-gray-400" />
            </button>
            
            <button
              onClick={handleToggleSound}
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
                <p className="text-white font-bold">{user?.name || 'Player'}</p>
                <button
                  onClick={handleCopyAddress}
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
            
            <div className="text-right">
              <div 
                className="text-xl font-bold cursor-pointer select-none text-green-400"
                onClick={handleRltBalanceTap}
              >
                {totalRltBalance.total.toLocaleString()}
              </div>
              <div 
                className="text-xs text-gray-400 cursor-pointer select-none"
                onClick={handleRltBalanceTap}
              >
                {totalRltBalance.fake > 0 ? (
                  <span>
                    {totalRltBalance.real > 0 && `${totalRltBalance.real} RLT + `}
                    {totalRltBalance.fake > 0 && `${totalRltBalance.fake} DEMO RLT`}
                  </span>
                ) : (
                  'RLT Balance'
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FiTarget className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Welcome to RandomLotto</h2>
            <p className="text-sm text-gray-300 mb-4">
              Experience blockchain lottery with RLT tokens
            </p>
            
            {isTelegram ? (
              <div className="glass glass-particles p-4 rounded-xl">
                <TonConnectButton />
              </div>
            ) : (
              <button
                onClick={open}
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

      {/* Navigation */}
      <NavigationTabs 
        currentView={uiState.currentView} 
        onViewChange={handleViewChange}
        isConnected={isWalletConnected}
      />

      {/* Preview Tickets for non-connected users */}
      {!isWalletConnected && demoTickets.length > 0 && uiState.currentView === 'home' && (
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiEye className="w-5 h-5 text-gray-400" />
            <span>Preview Tickets</span>
            <div className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
              Guest Mode
            </div>
          </h3>

          <div className="space-y-4 mb-4">
            {demoTickets.map((ticket) => (
              <GrayBoardingPassTicket 
                key={ticket.id} 
                pass={ticket} 
                isDemoTicket={true} 
                onClick={() => handleTicketClick(ticket)}
              />
            ))}
          </div>

          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-gray-300 text-sm mb-3">
              🎭 These are preview tickets showing how the lottery system works.
            </p>
            <button
              onClick={open}
              className="glass-button py-2 px-4 rounded-xl text-white font-medium"
            >
              Connect to Participate
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent}

      {/* Pass Purchase Success Modal */}
      <AnimatePresence>
        {uiState.showPassModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setUiState(prev => ({ ...prev, showPassModal: false }))}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <FiCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Participation Confirmed!</h3>
                <p className="text-sm text-gray-300">
                  Your {uiState.activePass?.isDemoRlt ? 'demo' : 'lottery'} entry has been recorded
                </p>
              </div>

              {uiState.activePass && (
                <div className="mb-6">
                  <GrayBoardingPassTicket pass={uiState.activePass} isModal={true} />
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-dark rounded-2xl p-3 text-center">
                    <div className="text-lg font-bold text-green-400">{uiState.activePass?.drawingChances}</div>
                    <div className="text-xs text-gray-400">Chances</div>
                  </div>
                  <div className="glass-dark rounded-2xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{uiState.activePass?.rewardRlt}</div>
                    <div className="text-xs text-gray-400">RLT Reward</div>
                  </div>
                </div>

                <button
                  onClick={() => setUiState(prev => ({ ...prev, showPassModal: false }))}
                  className="glass-button w-full py-3 rounded-2xl font-bold text-white"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {uiState.showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseTutorial}
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
                <h3 className="text-xl font-bold text-white mb-2">How RandomLotto Works</h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                  <div>Connect your wallet and get RLT tokens</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                  <div>Choose draw type and participation amount (1-1000 RLT)</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                  <div>Earn 10 RLT rewards per 1 RLT participation</div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">4</div>
                  <div>Wait for draw when pool exceeds 5,000 RLT</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">💡</div>
                  <div className="text-blue-300">
                    <strong>Dev Tip:</strong> Tap "RLT Balance" 4 times quickly to get 50 demo RLT for testing!
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCloseTutorial}
                className="glass-button w-full py-3 rounded-2xl font-bold text-white mt-6"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedRandomLottoEngine;

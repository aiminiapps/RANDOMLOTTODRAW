'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiLoader, FiAlertTriangle, FiTarget, FiZap, FiShield,
  FiTrendingUp, FiDollarSign, FiGift, FiUsers, FiStar, FiCreditCard,
  FiExternalLink, FiRefreshCw, FiAward, FiHash, FiCalendar, FiClock,
  FiShoppingCart, FiCopy, FiFilm, FiScissors, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiInfo, FiHelpCircle, FiTrendingDown, FiPieChart, FiActivity, FiEye, FiEyeOff
} from 'react-icons/fi';
import { CiWallet } from "react-icons/ci";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther, formatUnits } from 'viem';
import { bsc } from 'wagmi/chains';
import { IoBarChartOutline } from "react-icons/io5";

// RLT Token Contract Configuration
const RLT_CONTRACT_ADDRESS = '0x27FDc94c04Ea70D3B9FEFd1fB8f5508f94f6a815';

// Memoized Ticket Component to prevent re-renders
const PremiumTicket = React.memo(({ pass, isModal = false, isDemoTicket = false }) => {
  const ticketData = isDemoTicket ? pass : pass;
  const isDemo = isDemoTicket || ticketData.isDemo || ticketData.type === 'guest';
  const isGuest = ticketData.type === 'guest';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isModal ? 1 : 1.02 }}
      className={`relative overflow-hidden rounded-2xl ${
        isModal ? 'w-80 h-64' : 'w-full h-48' // Increased height from h-36 to h-48
      } ${isDemo ? 'opacity-80' : ''} cursor-pointer`}
      style={{ 
        background: isGuest ? 
          'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #4338ca 100%)' :
          isDemo ? 
            'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)' :
            'linear-gradient(135deg, #0B3D2E 0%, #145A32 50%, #0B3D2E 100%)'
      }}
    >
      {/* Ticket perforated edge */}
      <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      <div className="absolute left-3 top-0 h-full border-l-2 border-dashed border-white/20"></div>
      
      {/* Ticket hole punches */}
      {Array.from({ length: 6 }, (_, i) => ( // Increased holes for larger ticket
        <div 
          key={i}
          className="absolute left-1 w-1.5 h-1.5 bg-gray-900 rounded-full"
          style={{ top: `${15 + i * 12}%` }}
        />
      ))}
      
      {/* Status badges */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {isGuest && (
          <div className="px-3 py-1 bg-indigo-500/80 rounded-full text-xs font-bold text-white">
            GUEST
          </div>
        )}
        {isDemo && !isGuest && (
          <div className="px-3 py-1 bg-gray-600/80 rounded-full text-xs font-bold text-gray-200">
            DEMO
          </div>
        )}
        {!isDemo && !isGuest && (
          <div className="px-3 py-1 bg-green-500/80 rounded-full text-xs font-bold text-white">
            LIVE
          </div>
        )}
      </div>

      {/* Demo watermark */}
      {(isDemo || isGuest) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-7xl font-black text-gray-600/10 rotate-12 select-none">
            {isGuest ? 'PREVIEW' : 'DEMO'}
          </div>
        </div>
      )}
      
      {/* Holographic effect - static to prevent re-renders */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 opacity-50" />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-between ml-4"> {/* Increased padding */}
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FiFilm className={`w-5 h-5 ${
                isGuest ? 'text-indigo-300' :
                isDemo ? 'text-gray-400' : 'text-green-400'
              }`} />
              <h3 className={`font-bold ${
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
            <div className={`text-3xl font-black ${
              isGuest ? 'text-indigo-300' :
              isDemo ? 'text-gray-400' : 'text-yellow-400'
            }`}>
              {ticketData.tickets}
            </div>
            <div className={`text-xs ${
              isGuest ? 'text-indigo-500' :
              isDemo ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {ticketData.tickets === 1 ? 'TICKET' : 'TICKETS'}
            </div>
          </div>
        </div>
        
        {/* Movie ticket details - more spaced out */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
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
          
          <div className="flex justify-between items-center text-sm">
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
          
          <div className="flex justify-between items-center text-sm">
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
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">PRICE</span>
              <span className="font-bold text-green-400">{ticketData.rltSpent} RLT</span>
            </div>
          )}
        </div>
        
        {/* Status and scissors */}
        <div className="flex justify-between items-end">
          <div className={`px-3 py-2 rounded-full text-xs font-bold ${
            isGuest ? 'bg-indigo-500/30 text-indigo-300' :
            isDemo ? 'bg-gray-600/50 text-gray-300' : 'bg-green-500/20 text-green-400'
          }`}>
            {isGuest ? 'PREVIEW MODE' : isDemo ? 'DEMO TICKET' : 'VALID ENTRY'}
          </div>
          
          <FiScissors className={`w-4 h-4 ${
            isGuest ? 'text-indigo-500' :
            isDemo ? 'text-gray-500' : 'text-gray-400'
          } rotate-90`} />
        </div>
      </div>

      {/* Animated barcode - larger for bigger ticket */}
      <div className="absolute bottom-3 left-8 right-4 h-8">
        <div className="flex space-x-px h-full items-end overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <div 
              key={i} 
              className={`${
                isGuest ? 'bg-indigo-400/60' :
                isDemo ? 'bg-gray-600' : 'bg-white/30'
              } w-0.5`}
              style={{ height: `${25 + (i % 4) * 20}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

PremiumTicket.displayName = 'PremiumTicket';

// Memoized Navigation Component
const NavigationTabs = React.memo(({ currentView, onViewChange, isConnected }) => {
  const tabs = useMemo(() => [
    { id: 'home', icon: FiTarget, label: 'Home' },
    { id: 'tickets', icon: FiFilm, label: 'Tickets' },
    { id: 'stats', icon: IoBarChartOutline, label: 'Stats' },
    { id: 'history', icon: FiClock, label: 'History' }
  ], []);

  const handleTabClick = useCallback((tabId) => {
    if (!isConnected && (tabId === 'tickets' || tabId === 'history')) {
      // Don't switch to these tabs if not connected
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
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? 'glass-button text-white'
                  : isDisabled 
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

NavigationTabs.displayName = 'NavigationTabs';

// Memoized Live Statistics Component
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
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {appState.totalParticipants?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-gray-400">Total Players</div>
        </div>
        
        <div className="glass-dark rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {appState.poolTotal || '0'}
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
            <div 
              key={`winner-${index}`}
              className="flex items-center justify-between p-2 glass-dark rounded-xl"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
));

LiveStats.displayName = 'LiveStats';

// Main Component
const EnhancedRandomLottoEngine = () => {
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

  // Stable state with useMemo for complex objects
  const [balanceState, setBalanceState] = useState({
    rltBalance: '0',
    isLoading: false
  });

  const [uiState, setUiState] = useState({
    currentView: 'home',
    showTutorial: false,
    soundEnabled: true,
    copiedAddress: false
  });

  // Memoized app state to prevent re-renders
  const appState = useMemo(() => ({
    totalParticipants: 1247,
    currentRound: 15,
    poolTotal: '42350',
    recentWinners: [
      { address: '0x1234...5678', amount: '2500 RLT', time: '2h ago' },
      { address: '0xabcd...efgh', amount: '1800 RLT', time: '4h ago' },
      { address: '0x9876...4321', amount: '3200 RLT', time: '6h ago' }
    ]
  }), []);

  // Memoized participation state
  const participationState = useMemo(() => {
    const demoTickets = !isWalletConnected ? Array.from({ length: 2 }, (_, index) => ({
      id: `GUEST-${Date.now()}-${index}`,
      type: 'guest',
      tickets: 1,
      network: 'DEMO',
      purchaseDate: new Date(),
      isDemo: true,
      status: 'preview',
      roundValid: 15
    })) : [];

    return {
      myTickets: 0,
      myPasses: [],
      participationHistory: [],
      demoTickets
    };
  }, [isWalletConnected]);

  // Update balance when wallet connects
  useEffect(() => {
    if (walletAddress && rltBalance) {
      setBalanceState({
        rltBalance: formatUnits(rltBalance.value, rltBalance.decimals),
        isLoading: false
      });
    } else if (!walletAddress) {
      setBalanceState({
        rltBalance: '0',
        isLoading: false
      });
    }
  }, [walletAddress, rltBalance]);

  // Memoized handlers to prevent re-renders
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

  // Content renderer with proper memoization
  const renderContent = useMemo(() => {
    if (!isWalletConnected) {
      return (
        <div className="glass rounded-3xl p-6 text-center">
          <CiWallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-400 mb-6">
            Connect your wallet to access tickets, stats, and history
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
            {participationState.myPasses.length > 0 ? (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">My Tickets</h3>
                <div className="space-y-4">
                  {participationState.myPasses.map((pass) => (
                    <PremiumTicket key={pass.id} pass={pass} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-6 text-center">
                <FiFilm className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Tickets Yet</h3>
                <p className="text-sm text-gray-400">Purchase RLT tokens to get started</p>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Participation History</h3>
            <div className="text-center py-8">
              <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No History Yet</h3>
              <p className="text-sm text-gray-400">Your participation history will appear here</p>
            </div>
          </div>
        );
      
      default: // home
        return (
          <div className="space-y-4">
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
                    style={{ width: `${Math.min((appState.poolTotal / 100000) * 100, 100)}%` }}
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
  }, [uiState.currentView, isWalletConnected, isTelegram, appState, participationState, open]);

  const currentRltBalance = balanceState.rltBalance;
  const hasEnoughRLT = parseFloat(currentRltBalance) >= 500;

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
                <p className="text-white font-bold">Player</p>
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
              <div className={`text-xl font-bold ${hasEnoughRLT ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(currentRltBalance).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">RLT Balance</div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FiTarget className="w-12 h-12 text-green-400 mx-auto mb-4" />
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
      {!isWalletConnected && participationState.demoTickets.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <FiEye className="w-5 h-5 text-indigo-400" />
            <span>Preview Tickets</span>
            <div className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
              Guest Mode
            </div>
          </h3>

          <div className="space-y-4 mb-4">
            {participationState.demoTickets.map((ticket) => (
              <PremiumTicket key={ticket.id} pass={ticket} isDemoTicket={true} />
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
              Connect to Play Real
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent}

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

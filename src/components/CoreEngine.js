'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFire, FaBolt, FaEye, FaShieldAlt, FaRocket, 
  FaChartLine, FaCoins, FaSync, FaStar, FaWallet,
  FaPaperPlane, FaSpinner
} from 'react-icons/fa';
import { 
  GiNinjaStar, GiNinjaMask, GiShurikens, 
  GiTargetPrize, GiKatana, GiNinjaHead 
} from 'react-icons/gi';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { formatEther } from 'viem';
import Image from 'next/image';
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";

// Enhanced wallet connection with multi-wallet support
function NinjaWalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const tonWallet = useTonWallet();

  // Detect Telegram environment
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;

  if (isTelegram) {
    return (
      <div className="glass glass-particles p-4 rounded-xl mb-6">
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-white font-bold tektur flex items-center space-x-2">
            <GiNinjaMask />
            <span>Connect TON Wallet</span>
          </h3>
          <TonConnectButton className="!bg-gradient-to-r !from-orange-600 !to-red-600 !px-6 !py-3 !rounded-xl !font-bold" />
          {tonWallet && (
            <div className="text-center">
              <p className="text-orange-400 text-sm mb-2">
                🥷 Connected: {tonWallet.account.address.slice(0, 6)}...{tonWallet.account.address.slice(-4)}
              </p>
              <p className="text-green-400 text-xs">TON Network</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass glass-particles p-4 rounded-xl mb-6">
      <div className="text-center">
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <GiNinjaStar />
              <span className="font-bold">Wallet Connected</span>
            </div>
            <div className="bg-black/20 p-3 rounded-lg">
              <p className="text-white text-sm">🥷 {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <p className="text-green-400 text-xs mt-1">
                Via {connector?.name || 'Unknown'}
              </p>
            </div>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-white font-bold tektur mb-4">Connect Your Wallet</h3>
            <button
              onClick={() => open()}
              className="glass-button w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center space-x-2"
            >
              <FaWallet />
              <span>Connect Wallet</span>
            </button>
            <p className="text-gray-400 text-xs">
              Supports MetaMask, Trust Wallet, WalletConnect & 400+ wallets
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced User Assets Display Component
function UserAssetsDisplay({ balance, address }) {
  const { isConnected } = useAccount(); // ✅ FIXED: Added isConnected from useAccount hook
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  // Mock price data (in production, fetch from real API)
  const mockPrices = {
    ETH: 3247.50,
    BTC: 110799.00,
    USDC: 1.00,
    USDT: 1.00,
    BNB: 645.30,
    ADA: 1.25,
    DOT: 18.45,
    MATIC: 2.15
  };

  // Generate enhanced asset data
  const generateUserAssets = useCallback(() => {
    if (!balance || !address) return [];

    const ethValue = parseFloat(formatEther(balance.value));
    
    // Create diverse portfolio based on ETH balance
    const portfolioAssets = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: ethValue,
        price: mockPrices.ETH,
        value: ethValue * mockPrices.ETH,
        icon: '🔹',
        change24h: '+2.14%',
        changeValue: 2.14,
        network: 'Ethereum'
      }
    ];

    // Add additional mock assets if user has ETH
    if (ethValue > 0) {
      const additionalAssets = [
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: ethValue * 800,
          price: mockPrices.USDC,
          value: ethValue * 800 * mockPrices.USDC,
          icon: '💵',
          change24h: '+0.01%',
          changeValue: 0.01,
          network: 'Ethereum'
        },
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          balance: ethValue * 0.025,
          price: mockPrices.BTC,
          value: ethValue * 0.025 * mockPrices.BTC,
          icon: '₿',
          change24h: '-1.39%',
          changeValue: -1.39,
          network: 'Bitcoin'
        }
      ];

      portfolioAssets.push(...additionalAssets.filter(asset => asset.balance > 0.001));
    }

    return portfolioAssets;
  }, [balance, address]);

  useEffect(() => {
    if (balance && address && isConnected) {
      setLoading(true);
      setTimeout(() => {
        const generatedAssets = generateUserAssets();
        setAssets(generatedAssets);
        setTotalValue(generatedAssets.reduce((sum, asset) => sum + asset.value, 0));
        setLoading(false);
      }, 1000);
    } else {
      setAssets([]);
      setTotalValue(0);
    }
  }, [balance, address, isConnected, generateUserAssets]);

  // ✅ FIXED: Show wallet not connected message
  if (!address || !isConnected) {
    return (
      <motion.div 
        className="glass glass-particles p-5 rounded-2xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white tektur flex items-center space-x-2">
            <FaCoins className="text-orange-400" />
            <span>Ninja Portfolio</span>
          </h3>
        </div>
        
        <div className="text-center py-12">
          <FaWallet className="text-gray-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium mb-2">Wallet Not Connected</p>
          <p className="text-gray-500 text-sm">
            Connect your wallet to view your ninja portfolio
          </p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="glass glass-particles p-5 rounded-2xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center py-8">
          <FaSpinner className="animate-spin text-orange-400 text-2xl mx-auto mb-3" />
          <p className="text-white">🥷 Scanning your ninja vault...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="glass glass-particles p-5 rounded-2xl mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Portfolio Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white tektur flex items-center space-x-2">
          <FaCoins className="text-orange-400" />
          <span>Ninja Portfolio</span>
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">
            ${totalValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Total Value</div>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-3">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-gray-700/30 hover:border-orange-500/30 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl">
                {asset.icon}
              </div>
              <div>
                <div className="text-white font-bold text-lg">{asset.name}</div>
                <div className="text-gray-400 text-sm">
                  {asset.balance.toFixed(6)} {asset.symbol}
                </div>
                <div className="text-xs text-gray-500">{asset.network}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                ${asset.value.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                ${asset.price.toLocaleString()}
              </div>
              <div className={`text-sm flex items-center space-x-1 ${
                asset.changeValue >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {asset.changeValue >= 0 ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
                <span>{asset.change24h}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Portfolio Stats */}
      {assets.length > 0 && (
        <div className="mt-6 p-4 bg-black/20 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-orange-400 font-bold text-lg">{assets.length}</div>
              <div className="text-xs text-gray-400">Assets</div>
            </div>
            <div>
              <div className="text-green-400 font-bold text-lg">
                {assets.filter(a => a.changeValue >= 0).length}
              </div>
              <div className="text-xs text-gray-400">Gaining</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-lg">
                {Math.max(...assets.map(a => Math.abs(a.changeValue))).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">Best Move</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Enhanced AI Portfolio Chat Bot
function NinjaPortfolioChat({ userAssets, selectedCoin, isConnected }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamic greeting based on wallet connection and assets
    const getGreetingMessage = () => {
      if (!isConnected) {
        return `🥷 Greetings, aspiring ninja! Connect your wallet to unlock personalized portfolio strategies and tactical advice!`;
      }

      if (userAssets?.length > 0) {
        const totalValue = userAssets.reduce((sum, asset) => sum + asset.value, 0);
        const topAsset = userAssets.reduce((max, asset) => asset.value > max.value ? asset : max);
        
        return `🥷 Welcome back, ninja warrior! I see you hold $${totalValue.toFixed(2)} across ${userAssets.length} assets, with ${topAsset.symbol} as your strongest position. How can I help optimize your portfolio strategy today?`;
      }

      return `🥷 Wallet connected! I'm ready to help you build a legendary portfolio. What's your investment strategy, fellow ninja?`;
    };

    setMessages([{
      id: 1,
      type: 'ai',
      content: getGreetingMessage(),
      timestamp: new Date()
    }]);
  }, [selectedCoin, userAssets, isConnected]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      // Enhanced context with detailed portfolio info
      const portfolioContext = userAssets?.length > 0 
        ? userAssets.map(asset => 
            `${asset.symbol}: ${asset.balance.toFixed(4)} ($${asset.value.toFixed(2)}) - ${asset.change24h}`
          ).join(', ')
        : 'No assets detected - wallet not connected or empty';

      const totalValue = userAssets?.reduce((sum, asset) => sum + asset.value, 0) || 0;
      const bestPerformer = userAssets?.reduce((best, asset) => 
        asset.changeValue > (best?.changeValue || -Infinity) ? asset : best
      );

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a ninja portfolio advisor specializing in ${selectedCoin?.name || 'crypto'}. 
              
              User's portfolio: ${portfolioContext}
              Total portfolio value: $${totalValue.toFixed(2)}
              Best performing asset: ${bestPerformer?.symbol || 'None'} (${bestPerformer?.change24h || 'N/A'})
              Wallet status: ${isConnected ? 'Connected' : 'Not connected'}
              
              Provide tactical advice in ninja-themed language with emojis. Focus on:
              - Portfolio diversification and risk management
              - Strategic entry/exit points
              - Asset allocation optimization
              - Market timing and trends
              - Specific actionable advice based on their current holdings
              
              Keep responses informative but concise, and always maintain the ninja theme.`
            },
            {
              role: 'user',
              content: input
            }
          ]
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply || generateFallbackAdvice(portfolioContext, totalValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateFallbackAdvice(portfolioContext, totalValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackAdvice = (portfolioContext, totalValue) => {
    if (!isConnected) {
      return `🥷 Connect your wallet first, young ninja! Once connected, I can provide personalized strategies for your specific holdings.`;
    }

    if (totalValue === 0) {
      return `🥷 Your vault is empty, ninja. Consider starting with blue-chip assets like BTC/ETH (60%), stablecoins for stability (20%), and promising alts (20%). Dollar-cost averaging is your friend! ⚡`;
    }

    return `🥷 Based on your holdings (${portfolioContext}), I recommend: 
    
    📊 Rebalance if any single asset exceeds 40% 
    🛡️ Keep 15-20% in stablecoins for opportunities
    ⚡ Set stop-losses at -15% for risk management
    🎯 Take profits on assets up 50%+
    
    The crypto dojo rewards patience and discipline!`;
  };

  return (
    <div className="glass glass-particles p-5 rounded-2xl mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <GiKatana className="text-orange-400 text-xl" />
        <h3 className="text-lg font-bold text-white tektur">Portfolio Sensei Chat</h3>
        {isConnected && (
          <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            Connected
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'bg-black/30 text-gray-100 border border-orange-500/30'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-black/30 p-3 rounded-lg border border-orange-500/30">
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin text-orange-400" />
                <span className="text-sm text-gray-300">Ninja sensei is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={isConnected ? "Ask about portfolio strategies..." : "Connect wallet for personalized advice..."}
          className="flex-1 bg-black/30 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 p-2 rounded-lg transition-colors"
        >
          <FaPaperPlane className="text-white" />
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function FinjaCoinAgent() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAssets, setUserAssets] = useState([]);

  // Mock ninja coins data
  const ninjaCoins = [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      agentName: 'Shadow Bitcoin Master',
      rank: 'Legendary',
      specialty: 'Whale Hunt Specialist',
      stats: {
        accuracy: 98,
        aim: '98%',
        speed: '225ms',
        hits: 54,
        guard: '97%',
        flow: '81%'
      }
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      agentName: 'Phantom Ethereum Sensei',
      rank: 'Elite',
      specialty: 'DeFi Intelligence Expert',
      stats: {
        accuracy: 96,
        aim: '96%',
        speed: '180ms',
        hits: 67,
        guard: '94%',
        flow: '88%'
      }
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCoins(ninjaCoins);
      setSelectedCoin(ninjaCoins[0]);
      setLoading(false);
    }, 1500);
  }, []);

  // Update user assets when balance changes
  useEffect(() => {
    if (balance && address && isConnected) {
      const ethValue = parseFloat(formatEther(balance.value));
      const mockPrices = { ETH: 3247.50, USDC: 1.00, BTC: 110799.00 };
      
      const assets = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethValue,
          value: ethValue * mockPrices.ETH,
          changeValue: 2.14,
          change24h: '+2.14%'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin', 
          balance: ethValue * 500,
          value: ethValue * 500 * mockPrices.USDC,
          changeValue: 0.01,
          change24h: '+0.01%'
        }
      ].filter(asset => asset.balance > 0);
      
      setUserAssets(assets);
    } else {
      setUserAssets([]);
    }
  }, [balance, address, isConnected]);

  if (loading) {
    return (
      <div className="min-h-screen text-white pb-24">
        <div className="glass glass-particles p-8 rounded-2xl text-center mt-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white">🥷 Initializing ninja intelligence...</p>
        </div>
      </div>
    );
  }

  const coin = selectedCoin;
  if (!coin) return null;

  return (
    <div className="min-h-screen text-white pb-24">
      {/* Header */}
      <motion.div 
        className="glass glass-edges glass-p mb-6 mt-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <GiNinjaMask className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tektur">{coin.agentName}</h1>
              <p className="text-orange-400 text-sm">{coin.rank} • {coin.specialty}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-orange-400 font-bold text-sm">{coin.rank}</div>
            <div className="text-xs text-gray-400">{coin.symbol}</div>
          </div>
        </div>
      </motion.div>

      {/* Wallet Connection */}
      <NinjaWalletConnect />

      {/* User Assets Display */}
      <UserAssetsDisplay balance={balance} address={address} />

      {/* Ninja Stats Grid */}
      <motion.div 
        className="glass glass-particles p-5 rounded-2xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <GiKatana className="text-orange-400 text-xl" />
          <h3 className="text-lg font-bold text-white tektur">Ninja Combat Stats</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(coin.stats).map(([key, value], index) => (
            <motion.div
              key={key}
              className="glass-particles bg-gray-800/30 p-3 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="text-gray-400 text-xs capitalize mb-1">{key}</div>
              <div className="text-lg font-bold text-orange-400">{value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Portfolio Chat Bot */}
      <NinjaPortfolioChat 
        userAssets={userAssets} 
        selectedCoin={selectedCoin} 
        isConnected={isConnected}
      />

      {/* Coin Selector */}
      <motion.div 
        className="glass glass-particles p-5 rounded-2xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-bold text-white tektur mb-4 flex items-center space-x-2">
          <GiNinjaHead className="text-orange-400" />
          <span>Select Ninja Agent</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {coins.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => setSelectedCoin(c)}
              className={`p-4 rounded-xl transition-all ${
                selectedCoin?.id === c.id 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">{c.symbol[0]}</span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">{c.symbol}</div>
                  <div className="text-xs opacity-70">{c.rank}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

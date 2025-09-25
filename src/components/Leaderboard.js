import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiStar,  
  FiZap,
  FiTarget,
  FiAward,
  FiChevronUp,
  FiChevronDown,
  FiShield
} from 'react-icons/fi';
import { GoTrophy } from "react-icons/go";
import { PiCrownThin } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';

const RandomLottoLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('allTime');
  const [animationStage, setAnimationStage] = useState('loading');
  const [totalUsers] = useState(Math.floor(Math.random() * (125000 - 120000) + 120000));
  const [userRank] = useState(Math.floor(Math.random() * (115000 - 110000) + 110000));
  const [currentUser] = useState('RandomLotto_User'); // Can be replaced with actual Telegram user

  // Realistic crypto/lottery usernames
  const generateRealisticUsername = (seed) => {
    const cryptoWords = ['crypto', 'moon', 'diamond', 'whale', 'bull', 'bear', 'hodl', 'degen', 'ape'];
    const lotteryWords = ['lucky', 'winner', 'jackpot', 'fortune', 'golden', 'mega', 'ultra', 'super'];
    const adjectives = ['quick', 'smart', 'bold', 'wild', 'cool', 'fast', 'sharp', 'big'];
    const names = [
      'alex', 'sarah', 'mike', 'emma', 'david', 'lisa', 'john', 'anna', 'chris', 'maya',
      'ryan', 'zoe', 'luke', 'nina', 'jack', 'ruby', 'sam', 'ivy', 'noah', 'ava'
    ];
    
    // Use seed for deterministic generation
    const random = (max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * max);
    seed = random(100000);
    
    const patterns = [
      () => `${names[random(names.length)]}_${cryptoWords[random(cryptoWords.length)]}${random(99)}`,
      () => `${lotteryWords[random(lotteryWords.length)]}_${names[random(names.length)]}`,
      () => `${adjectives[random(adjectives.length)]}${names[random(names.length)]}${random(9999)}`,
      () => `${cryptoWords[random(cryptoWords.length)]}_${lotteryWords[random(lotteryWords.length)]}`,
      () => `${names[random(names.length)]}.${adjectives[random(adjectives.length)]}`,
      () => `${lotteryWords[random(lotteryWords.length)]}${random(999)}`,
      () => `${names[random(names.length)]}_wins_${random(99)}`
    ];
    
    return patterns[random(patterns.length)]();
  };

  // Generate masked wallet address
  const generateWalletAddress = (seed) => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor((seed * (i + 1) * 9301) % chars.length)];
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Badge system for special users
  const getBadgeInfo = (rank, username) => {
    if (rank === 1) return { 
      icon: PiCrownThin, 
      color: '#A3FF12', 
      label: 'Champion',
      glow: 'drop-shadow-[0_0_8px_rgba(163,255,18,0.6)]'
    };
    if (rank <= 3) return { 
      icon: GoTrophy, 
      color: '#F59E0B', 
      label: 'Elite',
      glow: 'drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
    };
    if (rank <= 10) return { 
      icon: FiStar, 
      color: '#8B5CF6', 
      label: 'Pro',
      glow: 'drop-shadow-[0_0_4px_rgba(139,92,246,0.4)]'
    };
    if (username.includes('admin') || username.includes('official')) return {
      icon: FiShield,
      color: '#EF4444',
      label: 'Official',
      glow: 'drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]'
    };
    return null;
  };

  // Generate leaderboard data
  const generateLeaderboardData = () => {
    const data = [];
    for (let i = 1; i <= 15; i++) {
      const seed = i * 12345;
      const username = generateRealisticUsername(seed);
      const totalUSDT = Math.max(50000 - (i * 2800) + (seed % 1000), 500);
      const totalTickets = Math.floor(totalUSDT);
      const winCount = Math.max(15 - i + (seed % 3), 0);
      const badgeInfo = getBadgeInfo(i, username);
      
      data.push({
        id: i,
        rank: i,
        username,
        walletAddress: generateWalletAddress(seed),
        totalUSDT: Math.floor(totalUSDT),
        totalTickets,
        winCount,
        rltTokens: Math.floor(totalUSDT * 10), // 10 RLT per USDT
        badge: badgeInfo,
        avatar: `https://api.dicebear.com/8.x/personas/svg?seed=${username}&backgroundColor=145a32,0b3d2e,1f2937&radius=50`,
        winRate: Math.min(95, Math.max(45, 85 - (i * 2) + (seed % 15))),
        recentGrowth: Math.floor((seed % 200) - 100), // -100 to +100
        isOnline: seed % 4 !== 0,
        joinedDays: Math.floor(seed % 365) + 30
      });
    }
    return data;
  };

  useEffect(() => {
    setAnimationStage('loading');
    const timer = setTimeout(() => {
      setLeaderboardData(generateLeaderboardData());
      setAnimationStage('loaded');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }
  };

  // Loading skeleton
  if (animationStage === 'loading') {
    return (
      <div className="w-full max-w-md mx-auto space-y-4 p-6">
        <div className="glass rounded-3xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-32 h-6 glass-dark rounded-xl"></div>
            <div className="w-20 h-6 glass-dark rounded-xl"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 glass-dark rounded-2xl"></div>
            <div className="h-12 glass-dark rounded-2xl"></div>
          </div>
        </div>
        
        {[...Array(15)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-dark rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 glass-dark rounded w-3/4"></div>
                <div className="h-3 glass-dark rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 glass-dark rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto space-y-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-warm rounded-3xl p-6">
        <div className="glass-content">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass-light rounded-2xl flex items-center justify-center">
                <GoTrophy className="w-5 h-5" style={{ color: '#A3FF12' }} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">RLT Champions</h1>
                <p className="text-sm text-gray-300 flex items-center space-x-1">
                  <FiUsers className="w-3 h-3" />
                  <span>{totalUsers.toLocaleString()} Players</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 glass-cool px-3 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Live</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'allTime', label: 'All Time', icon: FiTarget },
              { id: 'currentRound', label: 'This Round', icon: FiZap }
            ].map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`p-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'glass-button text-white'
                      : 'glass-dark text-gray-400 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Total Users Stats */}
      <motion.div variants={itemVariants} className="glass-light rounded-2xl p-4">
        <div className="glass-content">
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-1">
              {totalUsers.toLocaleString()}
            </div>
            <p className="text-sm text-gray-300 font-medium">Active Players Worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* Top 15 Leaderboard */}
      <div className="space-y-2">
        <AnimatePresence>
          {leaderboardData.map((user, index) => {
            const BadgeIcon = user.badge?.icon;
            return (
              <motion.div
                key={user.id}
                variants={itemVariants}
                layout
                className={`glass rounded-2xl p-4 relative overflow-hidden ${
                  user.rank <= 3 ? 'glass-warm' : 'glass'
                }`}
              >
                <div className="glass-content">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'glass-button text-white' :
                      user.rank <= 3 ? 'glass-light text-white' :
                      'glass-dark text-gray-300'
                    }`}>
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${
                        user.rank <= 3 ? 'border-yellow-400/50' : 'border-gray-600/30'
                      }`}>
                        <img 
                          src={user.avatar}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.username}&backgroundColor=145a32`;
                          }}
                        />
                      </div>
                      
                      {/* Online status */}
                      {user.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      )}

                      {/* Badge */}
                      {user.badge && (
                        <div 
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${user.badge.color}20`, border: `1px solid ${user.badge.color}` }}
                        >
                          <BadgeIcon 
                            className={`w-3 h-3 ${user.badge.glow}`} 
                            style={{ color: user.badge.color }} 
                          />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-white truncate text-sm">
                          {user.username}
                        </p>
                        {user.badge && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${user.badge.color}20`,
                              color: user.badge.color,
                              border: `1px solid ${user.badge.color}40`
                            }}
                          >
                            {user.badge.label}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="font-mono">{user.walletAddress}</span>
                        <div className="flex items-center space-x-1">
                          <FiTarget className="w-3 h-3" />
                          <span>{user.winCount} wins</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-white text-sm mb-0.5 flex items-center space-x-1">
                        <FiDollarSign className="w-3 h-3 text-green-400" />
                        <span>{user.totalUSDT.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {user.totalTickets.toLocaleString()} tickets
                      </div>
                      <div className={`text-xs flex items-center justify-end space-x-1 font-medium ${
                        user.recentGrowth > 0 ? 'text-green-400' : 
                        user.recentGrowth < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {user.recentGrowth > 0 ? <FiChevronUp className="w-3 h-3" /> : 
                         user.recentGrowth < 0 ? <FiChevronDown className="w-3 h-3" /> : null}
                        <span>{user.recentGrowth > 0 ? '+' : ''}{user.recentGrowth}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top 3 special glow effect */}
                {user.rank <= 3 && (
                  <div className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                       style={{ 
                         background: `radial-gradient(circle at 50% 0%, ${user.badge.color}40 0%, transparent 70%)`
                       }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Current User Rank */}
      <motion.div variants={itemVariants} className="glass-dark rounded-3xl p-6 relative overflow-hidden">
        <div className="glass-content">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <FiAward className="w-5 h-5" style={{ color: '#A3FF12' }} />
              <span>Your Position</span>
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-warm rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="font-semibold text-white">{currentUser}</p>
                <p className="text-sm text-gray-400">
                  Top {((userRank / totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-white">
                #{userRank.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">Global Rank</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {(totalUsers - userRank).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">Behind You</p>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {(userRank - 1).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">Ahead of You</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* See More Button */}
      <motion.div variants={itemVariants} className="pb-6">
        <button className="glass-button w-full py-4 rounded-2xl text-sm font-semibold text-white">
          View Full Rankings
        </button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants} className="glass-cool rounded-2xl p-4">
        <div className="glass-content">
          <p className="text-xs text-center text-gray-400 leading-relaxed">
            * Leaderboard shows simulated data for demonstration. 
            Actual rankings will reflect real user participation and wins.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RandomLottoLeaderboard;

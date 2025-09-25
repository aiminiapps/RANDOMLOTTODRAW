import React, { useState, useEffect } from 'react';
import {  
  FiUsers, 
  FiDollarSign, 
  FiStar, 
  FiZap,
  FiTarget,
  FiAward,
  FiChevronUp,
  FiChevronDown,
  FiShield,
  FiGift
} from 'react-icons/fi';
import { PiCrownThin } from "react-icons/pi";
import { GoTrophy } from "react-icons/go";
import { motion } from 'framer-motion';

const RandomLottoLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('allTime');
  const [animationStage, setAnimationStage] = useState('loading');
  const [totalUsers] = useState(Math.floor(Math.random() * (125000 - 120000) + 120000));
  const [userRank] = useState(Math.floor(Math.random() * (115000 - 110000) + 110000));
  const [currentUser, setCurrentUser] = useState('Player');
  const [userPoints] = useState(Math.floor(Math.random() * 2000) + 500);

  // Get Telegram user data
  useEffect(() => {
    try {
      const telegram = window?.Telegram?.WebApp;
      if (telegram?.initDataUnsafe?.user?.first_name) {
        setCurrentUser(telegram.initDataUnsafe.user.first_name);
      } else if (telegram?.initDataUnsafe?.user?.username) {
        setCurrentUser(telegram.initDataUnsafe.user.username);
      }
    } catch (error) {
      console.log('Telegram WebApp not available');
    }
  }, []);

  // More creative username generation
  const generateCreativeUsername = (seed) => {
    const cryptoPrefixes = ['Moon', 'Diamond', 'Rocket', 'Crypto', 'Lucky', 'Golden', 'Mega', 'Ultra'];
    const mysticalWords = ['Phoenix', 'Dragon', 'Wolf', 'Eagle', 'Tiger', 'Lion', 'Fox', 'Hawk'];
    const techSuffixes = ['AI', 'Pro', 'X', 'Prime', 'Elite', 'Max', 'Tech', 'Labs'];
    const numbers = ['21', '24', '99', '777', '420', '69', '100', '2024'];
    
    const random = (max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * max);
    seed = random(100000);
    
    const patterns = [
      () => `${cryptoPrefixes[random(cryptoPrefixes.length)]}${mysticalWords[random(mysticalWords.length)]}`,
      () => `${mysticalWords[random(mysticalWords.length)]}${techSuffixes[random(techSuffixes.length)]}`,
      () => `${cryptoPrefixes[random(cryptoPrefixes.length)]}${numbers[random(numbers.length)]}`,
      () => `${mysticalWords[random(mysticalWords.length)]}_${numbers[random(numbers.length)]}`,
    ];
    
    return patterns[random(patterns.length)]();
  };

  // Generate masked wallet
  const generateWalletAddress = (seed) => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor((seed * (i + 1) * 9301) % chars.length)];
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Badge system
  const getBadgeInfo = (rank, username) => {
    if (rank === 1) return { 
      icon: PiCrownThin, 
      color: '#A3FF12', 
      label: 'Champion',
      bg: 'bg-gradient-to-r from-yellow-400/20 to-green-400/20'
    };
    if (rank === 2) return { 
      icon: GoTrophy, 
      color: '#F59E0B', 
      label: 'Runner-up',
      bg: 'bg-gradient-to-r from-orange-400/20 to-yellow-400/20'
    };
    if (rank === 3) return { 
      icon: FiStar, 
      color: '#EF4444', 
      label: 'Third Place',
      bg: 'bg-gradient-to-r from-red-400/20 to-orange-400/20'
    };
    if (rank <= 10) return { 
      icon: FiTarget, 
      color: '#8B5CF6', 
      label: 'Elite',
      bg: 'bg-gradient-to-r from-purple-400/20 to-pink-400/20'
    };
    return null;
  };

  // Generate leaderboard data
  const generateLeaderboardData = () => {
    const data = [];
    for (let i = 1; i <= 15; i++) {
      const seed = i * 12345;
      const username = generateCreativeUsername(seed);
      const totalUSDT = Math.max(75000 - (i * 3200) + (seed % 1500), 800);
      const totalTickets = Math.floor(totalUSDT);
      const winCount = Math.max(20 - i + (seed % 5), 0);
      const badgeInfo = getBadgeInfo(i, username);
      
      data.push({
        id: i,
        rank: i,
        username,
        walletAddress: generateWalletAddress(seed),
        totalUSDT: Math.floor(totalUSDT),
        totalTickets,
        winCount,
        rltTokens: Math.floor(totalUSDT * 10),
        badge: badgeInfo,
        avatar: `https://xsgames.co/randomusers/avatar.php?g=male&seed=${username}`,
        winRate: Math.min(95, Math.max(45, 90 - (i * 3) + (seed % 20))),
        recentGrowth: Math.floor((seed % 300) - 150),
        isOnline: seed % 3 !== 0,
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
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedFilter]);

  // Loading state
  if (animationStage === 'loading') {
    return (
      <div className="w-full mx-auto space-y-4 py-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 glass-dark rounded-2xl animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 glass-dark rounded-xl animate-pulse"></div>
              <div className="h-4 glass-dark rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
          
          {/* Top 3 Skeleton */}
          <div className="flex items-end justify-center space-x-4 mb-6">
            {[60, 80, 50].map((height, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 glass-dark rounded-2xl animate-pulse mb-2"></div>
                <div className={`w-16 glass-dark rounded-t-2xl animate-pulse`} style={{ height: height }}></div>
              </div>
            ))}
          </div>

          {[...Array(12)].map((_, i) => (
            <div key={i} className="glass-dark rounded-2xl p-4 mb-3 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 glass rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 glass rounded w-3/4"></div>
                  <div className="h-3 glass rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  return (
    <div className="w-full mx-auto space-y-5">
      {/* Creative Header */}
      <div className="glass rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="glass-content relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-light rounded-2xl flex items-center justify-center relative">
                <GoTrophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Champions League</h1>
                <p className="text-sm text-gray-300 flex items-center space-x-2">
                  <FiUsers className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">{totalUsers.toLocaleString()}</span>
                  <span className='text-[10px]'>Lottery Players</span>
                </p>
              </div>
            </div>
            
            <div className="glass-cool px-4 py-2 rounded-2xl flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-bold">LIVE</span>
            </div>
          </div>

          {/* Creative Filter Tabs */}
          <div className="flex space-x-3">
            {[
              { id: 'allTime', label: 'All Time Legends', icon: FiAward },
              { id: 'currentRound', label: 'Current Round', icon: FiZap }
            ].map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex-1 p-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'glass-light text-white transform scale-105'
                      : 'glass-dark text-gray-200 hover:text-white hover:scale-102'
                  }`}
                >
                  {/* <IconComponent className="w-4 h-4" /> */}
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Creative Bar Chart Style Top 3 */}
      <div className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-orange-400/5 to-red-400/5 rounded-3xl"></div>
        
        <div className="glass-content relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
            <span>Top Champions</span>
          </h2>

          {/* Creative Bar Chart */}
          <div className="flex items-end justify-center space-x-6 mb-6">
            {topThree.map((user, index) => {
              const heights = [100, 80, 60]; // Different heights for visual hierarchy
              const order = [1, 0, 2]; // Center the winner
              const actualIndex = order[index];
              const actualUser = topThree[actualIndex];
              const BadgeIcon = actualUser.badge?.icon;

              return (
                <div key={actualUser.id} className="flex flex-col items-center">
                  {/* Crown for #1 */}
                  {actualUser.rank === 1 && (
                    <PiCrownThin className="w-8 h-8 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                  )}

                  {/* User Avatar */}
                  <div className={`relative mb-3 ${actualUser.rank === 1 ? 'w-16 h-16' : 'w-14 h-14'}`}>
                    <div className={`w-full h-full rounded-2xl overflow-hidden border-2 ${
                      actualUser.rank === 1 ? 'border-yellow-400/60' : 
                      actualUser.rank === 2 ? 'border-orange-400/60' : 'border-red-400/60'
                    } relative`}>
                      <img 
                        src={actualUser.avatar}
                        alt={actualUser.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/8.x/personas/svg?seed=${actualUser.username}`;
                        }}
                      />
                      {actualUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>

                    {/* Rank Badge */}
                    <div 
                      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white ${
                        actualUser.rank === 1 ? 'bg-yellow-400' :
                        actualUser.rank === 2 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                    >
                      {actualUser.rank}
                    </div>
                  </div>

                  {/* Username */}
                  <p className={`font-bold text-center mb-2 max-w-20 truncate ${
                    actualUser.rank === 1 ? 'text-yellow-400 text-base' : 'text-white text-sm'
                  }`}>
                    {actualUser.username}
                  </p>

                  {/* USDT Amount */}
                  <div className="text-center mb-3">
                    <p className={`font-black ${actualUser.rank === 1 ? 'text-lg text-yellow-400' : 'text-white'}`}>
                      ${actualUser.totalUSDT.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{actualUser.winCount} wins</p>
                  </div>

                  {/* Creative Bar */}
                  <div className="relative">
                    <div 
                      className={`w-20 rounded-t-3xl transition-all duration-1000 flex flex-col items-center justify-end p-3 relative overflow-hidden ${
                        actualUser.rank === 1 ? 'bg-gradient-to-t from-yellow-400/40 to-yellow-400/20 border-t-4 border-yellow-400' :
                        actualUser.rank === 2 ? 'bg-gradient-to-t from-orange-400/40 to-orange-400/20 border-t-4 border-orange-400' :
                        'bg-gradient-to-t from-red-400/40 to-red-400/20 border-t-4 border-red-400'
                      }`}
                      style={{ height: heights[actualIndex] }}
                    >
                      {/* Glowing effect inside bar */}
                      <div className={`absolute inset-0 ${
                        actualUser.rank === 1 ? 'bg-yellow-400/10' :
                        actualUser.rank === 2 ? 'bg-orange-400/10' : 'bg-red-400/10'
                      } animate-pulse`}></div>
                      
                      {BadgeIcon && (
                        <BadgeIcon 
                          className={`w-6 h-6 relative z-10`} 
                          style={{ color: actualUser.badge.color }} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {topThree.map((user, index) => (
              <div key={user.id} className="text-center glass-dark rounded-2xl p-3">
                <div className="text-white font-bold text-sm">{user.winRate}%</div>
                <div className="text-gray-400 text-xs">Win Rate</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remaining Players List */}
      <div className="space-y-2">
        {remaining.map((user) => {
          const BadgeIcon = user.badge?.icon;
          return (
            <div key={user.id} className="glass rounded-2xl p-4 hover:glass-warm transition-all duration-300">
              <div className="glass-content">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="w-8 h-8 glass-dark rounded-xl flex items-center justify-center font-bold text-sm text-white">
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-600/30">
                      <img 
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/8.x/personas/svg?seed=${user.username}`;
                        }}
                      />
                    </div>
                    
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                    )}

                    {user.badge && (
                      <div 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${user.badge.color}30`, border: `1px solid ${user.badge.color}` }}
                      >
                        <BadgeIcon className="w-3 h-3" style={{ color: user.badge.color }} />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-white truncate text-sm">{user.username}</p>
                      {user.badge && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${user.badge.color}20`,
                            color: user.badge.color
                          }}
                        >
                          {user.badge.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span className="font-mono">{user.walletAddress}</span>
                      <div className="flex items-center space-x-1 text-green-400">
                        <FiTarget className="w-3 h-3" />
                        <span>{user.winCount}</span>
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
            </div>
          );
        })}
      </div>

      {/* Creative Current User Card */}
      <div className="glass-warm rounded-3xl p-6 relative overflow-hidden border-2 border-green-400/30">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/5 to-purple-400/10 rounded-3xl"></div>
        <div className="absolute top-0 left-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl"></div>
        
        <div className="glass-content relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 glass-light rounded-3xl flex items-center justify-center relative overflow-hidden">
                <span className="text-2xl">🎯</span>
                <div className="absolute inset-0 bg-green-400/20 animate-pulse rounded-3xl"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>{currentUser}</span>
                  <FiGift className="w-5 h-5 text-green-400" />
                </h3>
                <p className="text-sm text-gray-300">Your Performance</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-green-400">
                #{userRank.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">Global Rank</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-white mb-1">
                {userPoints.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Your Points</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-green-400 mb-1">
                {((userRank / totalUsers) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Percentile</div>
            </div>
          </div>

          <div className="glass-cool rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {(totalUsers - userRank).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">Players Behind</p>
              </div>
              
              <div className="w-px h-8 bg-gray-600"></div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {(userRank - 1).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">Players Ahead</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load More */}
      <button className="glass-button w-full py-4 rounded-2xl text-sm font-bold text-white hover:scale-102 transition-transform duration-200">
        Load More Players
      </button>

      {/* Disclaimer */}
      <div className="glass-cool rounded-2xl p-4">
        <div className="glass-content">
          <p className="text-xs text-center text-gray-400 leading-relaxed">
            🎲 Leaderboard reflects simulated lottery data for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default RandomLottoLeaderboard;

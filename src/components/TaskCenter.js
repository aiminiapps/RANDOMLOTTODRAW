'use client';

import { useState } from 'react';
import { useStore } from '@/lib/storage';
import Image from 'next/image';
import { 
  FiGift, 
  FiTarget, 
  FiUsers, 
  FiTwitter, 
  FiShare2, 
  FiStar,
  FiZap,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCenter = () => {
  const {
    tasks,
    purchasePass,
    completeTask,
    setTwitterFollowCompleted,
  } = useStore();
  const [error, setError] = useState(null);

  const handlePurchasePass = (count) => {
    const success = purchasePass(count);
    if (!success) {
      setError('Insufficient RLT Points');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTask = (taskName, points, action) => {
    if (!tasks[taskName].completed) {
      completeTask(taskName, points);
      if (action) action();
    }
  };

  const RandomLottoIcon = ({ variant = 'default' }) => {
    const variants = {
      default: 'bg-gradient-to-br from-green-400 to-emerald-500',
      daily: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      social: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      invite: 'bg-gradient-to-br from-purple-400 to-pink-500'
    };

    return (
      <div className={`w-12 h-12 ${variants[variant]} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        <Image src='/agent/agentlogo.png' alt='logo' width={32} height={32} />
        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-white w-full max-w-md mx-auto"
    >
      {/* Creative Header */}
      <motion.div variants={itemVariants} className="glass-warm rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="glass-content relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 glass-light rounded-3xl flex items-center justify-center relative">
                <FiTarget className="w-7 h-7 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <div className="absolute inset-0 rounded-3xl bg-green-400/20 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Mission Center</h2>
                <p className="text-sm text-gray-300 flex items-center space-x-2">
                  <FiZap className="w-4 h-4 text-yellow-400" />
                  <span>Earn RLT Rewards</span>
                </p>
              </div>
            </div>
            
            <div className="glass-cool px-4 py-2 rounded-2xl">
              <div className="text-lg font-bold text-green-400">+2.5K</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Tasks Section */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="glass-light rounded-2xl p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <FiStar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Missions</h3>
              <p className="text-sm text-gray-400">Reset every 24 hours</p>
            </div>
            <div className="flex-1"></div>
            <div className="glass-cool px-3 py-1 rounded-xl">
              <FiClock className="w-4 h-4 text-blue-400 inline mr-1" />
              <span className="text-xs text-blue-400 font-medium">2/2</span>
            </div>
          </div>

          {/* Daily Reward Task */}
          <div className="glass rounded-2xl p-4 mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 rounded-2xl"></div>
            
            <div className="glass-content relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <RandomLottoIcon variant="daily" />
                  <div>
                    <h4 className="text-white font-bold">Daily Check-In</h4>
                    <div className="flex items-center space-x-2">
                      <FiGift className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">100 RLT</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${
                  tasks.dailyReward.completed 
                    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' 
                    : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 flex items-center justify-center ${
                    tasks.dailyReward.completed ? 'translate-x-7 bg-green-100' : 'translate-x-0'
                  }`}>
                    {tasks.dailyReward.completed && (
                      <FiCheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {!tasks.dailyReward.completed && (
                <button
                  onClick={() => handleTask('dailyReward', 100)}
                  className="glass-button w-full py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300"
                >
                  <FiGift className="w-4 h-4 inline mr-2" />
                  Claim Daily Bonus
                </button>
              )}
            </div>
          </div>

          {/* RT Post Task */}
          <div className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-2xl"></div>
            
            <div className="glass-content relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <RandomLottoIcon variant="social" />
                  <div>
                    <h4 className="text-white font-bold">Share Our Post</h4>
                    <div className="flex items-center space-x-2">
                      <FiShare2 className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold">1,000 RLT</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${
                  tasks.rtPost.completed 
                    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' 
                    : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 flex items-center justify-center ${
                    tasks.rtPost.completed ? 'translate-x-7 bg-green-100' : 'translate-x-0'
                  }`}>
                    {tasks.rtPost.completed && (
                      <FiCheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {!tasks.rtPost.completed && (
                <button
                  onClick={() => handleTask('rtPost', 1000, () => window.open('https://x.com/AIDatanaut', '_blank'))}
                  className="glass-button w-full py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300"
                >
                  <FiTwitter className="w-4 h-4 inline mr-2" />
                  Repost & Earn
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Optional Tasks Section */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="glass-dark rounded-2xl p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Bonus Challenges</h3>
              <p className="text-sm text-gray-400">Complete for extra rewards</p>
            </div>
            <div className="flex-1"></div>
            <div className="glass-warm px-3 py-1 rounded-xl">
              <span className="text-xs text-yellow-400 font-medium">1/3 Tasks</span>
            </div>
          </div>

          {/* Follow X Task */}
          <div className="glass-light rounded-2xl p-4 mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl"></div>
            
            <div className="glass-content relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <RandomLottoIcon variant="social" />
                  <div>
                    <h4 className="text-white font-bold">Follow on X</h4>
                    <div className="flex items-center space-x-2">
                      <FiTwitter className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold">1,000 RLT</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${
                  tasks.followX.completed 
                    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' 
                    : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 flex items-center justify-center ${
                    tasks.followX.completed ? 'translate-x-7 bg-green-100' : 'translate-x-0'
                  }`}>
                    {tasks.followX.completed && (
                      <FiCheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {!tasks.followX.completed && (
                <button
                  onClick={() =>
                    handleTask('followX', 1000, () => {
                      setTwitterFollowCompleted(true);
                      window.open('https://x.com/AIDatanaut', '_blank');
                    })
                  }
                  className="glass-button w-full py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300"
                >
                  <FiTwitter className="w-4 h-4 inline mr-2" />
                  Follow & Claim
                </button>
              )}
            </div>
          </div>

          {/* Invite 5 Users Task */}
          <div className="glass-light rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-2xl"></div>
            
            <div className="glass-content relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <RandomLottoIcon variant="invite" />
                  <div>
                    <h4 className="text-white font-bold">Invite 5 Friends</h4>
                    <div className="flex items-center space-x-2">
                      <FiUsers className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-bold">5,000 RLT</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${
                  tasks.inviteFive.completed 
                    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' 
                    : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-500 flex items-center justify-center ${
                    tasks.inviteFive.completed ? 'translate-x-7 bg-green-100' : 'translate-x-0'
                  }`}>
                    {tasks.inviteFive.completed && (
                      <FiCheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              
              {!tasks.inviteFive.completed && (
                <button
                  disabled={tasks.inviteFive.completed}
                  className="glass-button w-full py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 opacity-75"
                >
                  <FiUsers className="w-4 h-4 inline mr-2" />
                  Invite Friends
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pass Purchase Section */}
      <motion.div variants={itemVariants} className="glass-warm rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/5 to-purple-400/10 rounded-3xl"></div>
        
        <div className="glass-content relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Lottery Passes</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Use RLT Points to purchase lottery passes and activate your participation in draws
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-dark border-2 border-red-400/30 rounded-2xl p-4 mb-4"
              >
                <p className="text-red-400 text-center font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handlePurchasePass(1)}
              className="glass-button p-4 rounded-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-2xl"></div>
              <div className="relative z-10 text-center">
                <div className="text-2xl font-black text-white mb-1">1 PASS</div>
                <div className="flex items-center justify-center space-x-1 text-green-400">
                  <FiDollarSign className="w-4 h-4" />
                  <span className="text-sm font-bold">500 RLT</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePurchasePass(5)}
              className="glass-button p-4 rounded-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-2xl"></div>
              <div className="relative z-10 text-center">
                <div className="text-2xl font-black text-white mb-1">5 PASS</div>
                <div className="flex items-center justify-center space-x-1 text-purple-400">
                  <FiDollarSign className="w-4 h-4" />
                  <span className="text-sm font-bold">2K RLT</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  SAVE 20%
                </div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div variants={itemVariants} className="glass-cool rounded-2xl p-4 mb-6">
        <div className="glass-content">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 glass-light rounded-xl flex items-center justify-center flex-shrink-0">
              <FiZap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">How It Works</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Complete tasks to earn RLT points, then use them to buy lottery passes. 
                Each pass gives you entry into RandomLotto draws with chances to win big rewards!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-20" />
    </motion.div>
  );
};

export default TaskCenter;

import React from 'react';
import { 
  FiShield, 
  FiGlobe, 
  FiTrendingUp, 
  FiZap, 
  FiUsers, 
  FiDollarSign,
  FiLock,
  FiCheckCircle,
  FiStar,
  FiTarget,
  FiAward
} from 'react-icons/fi';
import { IoBarChartOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

const ProjectInfo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const features = [
    {
      icon: <FiShield className="w-5 h-5" style={{ color: '#A3FF12' }} />,
      title: 'Blockchain Security',
      description: 'Smart contracts ensure tamper-proof draws with complete transparency and immutable results.'
    },
    {
      icon: <FiGlobe className="w-5 h-5" style={{ color: '#4ADE80' }} />,
      title: 'Global Access',
      description: 'Participate from anywhere with just $1 minimum entry, breaking traditional lottery barriers.'
    },
    {
      icon: <FiTrendingUp className="w-5 h-5" style={{ color: '#22D3EE' }} />,
      title: 'RLT Rewards',
      description: 'Earn RLT tokens for every participation, building value even when you don\'t win the main draw.'
    },
    {
      icon: <FiZap className="w-5 h-5" style={{ color: '#F59E0B' }} />,
      title: 'Instant Processing',
      description: 'Lightning-fast USDT deposits and immediate RLT token distribution via smart contracts.'
    }
  ];

  const valueProps = [
    {
      icon: <FiUsers className="w-4 h-4" style={{ color: '#EC4899' }} />,
      title: 'Fair Play',
      value: 'No whale dominance with 1,000 USDT wallet caps'
    },
    {
      icon: <FiDollarSign className="w-4 h-4" style={{ color: '#10B981' }} />,
      title: 'Low Entry',
      value: 'Start with just $1 USDT per draw ticket'
    },
    {
      icon: <FiLock className="w-4 h-4" style={{ color: '#8B5CF6' }} />,
      title: 'Secure',
      value: 'Audited smart contracts with verifiable randomness'
    },
    {
      icon: <FiCheckCircle className="w-4 h-4" style={{ color: '#06B6D4' }} />,
      title: 'Transparent',
      value: 'All draws and results publicly verifiable on-chain'
    }
  ];

  const tokenomics = [
    {
      icon: <FiStar className="w-4 h-4" style={{ color: '#A3FF12' }} />,
      metric: '10 RLT',
      label: 'Per 1 USDT participation'
    },
    {
      icon: <FiTarget className="w-4 h-4" style={{ color: '#F97316' }} />,
      metric: '5,000 USDT',
      label: 'Draw threshold minimum'
    },
    {
      icon: <FiAward className="w-4 h-4" style={{ color: '#EF4444' }} />,
      metric: 'Deflationary',
      label: 'Token burn mechanism'
    },
    {
      icon: <IoBarChartOutline className="w-4 h-4" style={{ color: '#3B82F6' }} />,
      metric: 'Sustainable',
      label: 'Long-term economy design'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto space-y-6 pb-20"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="glass space-y-4">
        <div className="glass-content">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 glass-warm rounded-xl flex items-center justify-center">
              <FiZap className="w-5 h-5 text-[#A3FF12]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">RandomLotto Draw</h1>
              <p className="text-sm text-gray-400 font-medium">Blockchain-Powered Lottery</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-gray-300 font-medium">
            Revolutionary lottery platform combining blockchain transparency with global accessibility, 
            ensuring fair draws and rewarding all participants through innovative tokenomics.
          </p>
        </div>
      </motion.div>

      {/* Vision & Mission */}
      <motion.div variants={itemVariants} className=" space-y-4">
        <div className="glass-content">
          <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <FiTarget className="w-4 h-4" style={{ color: '#A3FF12' }} />
            <span>Vision & Mission</span>
          </h2>
          
          <div className="">
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Vision</h3>
              <p className="text-xs leading-relaxed text-gray-300">
                Become the world's most trusted global lottery platform powered by blockchain technology, 
                eliminating traditional barriers and ensuring complete transparency.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Mission</h3>
              <p className="text-xs leading-relaxed text-gray-300">
                Provide low-barrier lottery participation with verifiable draws, sustainable token economy, 
                and global accessibility starting from just $1 entry.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Features */}
      <motion.div variants={itemVariants} className="glass space-y-4">
        <div className="glass-content">
          <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <FiShield className="w-4 h-4" style={{ color: '#A3FF12' }} />
            <span>Core Features</span>
          </h2>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-light rounded-2xl p-4 hover:glass-warm transition-all duration-500"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 glass-dark rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Value Propositions */}
      <motion.div variants={itemVariants} className="glass space-y-4">
        <div className="glass-content">
          <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <FiCheckCircle className="w-4 h-4" style={{ color: '#A3FF12' }} />
            <span>Why Choose RandomLotto</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-light rounded-2xl p-3"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 glass-cool rounded-lg flex items-center justify-center">
                    {prop.icon}
                  </div>
                  <h3 className="text-xs font-semibold text-white">{prop.title}</h3>
                </div>
                <p className="text-xs text-gray-400 leading-tight">{prop.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tokenomics */}
      <motion.div variants={itemVariants} className=" space-y-4">
        <div className="glass-content">
          <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <FiDollarSign className="w-4 h-4" style={{ color: '#0B3D2E' }} />
            <span>RLT Tokenomics</span>
          </h2>
          
          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                <strong className="text-white">Reward System:</strong> All participants receive RLT tokens 
                immediately upon joining, creating value for everyone regardless of draw outcomes.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {tokenomics.map((item, index) => (
                  <div key={index} className="glass-cool rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      {item.icon}
                      <span className="text-xs font-bold text-white">{item.metric}</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div variants={itemVariants} className=" space-y-4">
        <div className="glass-content">
          <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <IoBarChartOutline className="w-4 h-4" style={{ color: '#A3FF12' }} />
            <span>How It Works</span>
          </h2>
          
          <div className="space-y-3">
            {[
              { step: '1', text: 'Connect wallet and deposit USDT (1 USDT = 1 ticket)', color: '#A3FF12' },
              { step: '2', text: 'Receive RLT tokens instantly (10 RLT per 1 USDT)', color: '#4ADE80' },
              { step: '3', text: 'Pool accumulates until 5,000 USDT threshold', color: '#22D3EE' },
              { step: '4', text: 'Smart contract executes verifiable random draw', color: '#F59E0B' },
              { step: '5', text: 'Winners receive USDT rewards, all keep RLT tokens', color: '#EC4899' }
            ].map((step, index) => (
              <div key={index} className="flex items-start glass-light backdrop-blur-[1px] space-x-3 glass-dark rounded-2xl p-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ 
                    backgroundColor: `${step.color}20`,
                    color: step.color,
                    border: `1px solid ${step.color}40`
                  }}
                >
                  {step.step}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants} className="space-y-4 pb-10">
        <div className="glass-content">
          <h2 className="text-xs font-semibold text-white mb-3 flex items-center space-x-2">
            <FiLock className="w-3 h-3" style={{ color: '#A3FF12' }} />
            <span>Important Notice</span>
          </h2>
          
          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
            <p>
              • This is not investment advice. Participate responsibly within your means.
            </p>
            <p>
              • Comply with local regulations regarding lottery and gambling in your jurisdiction.
            </p>
            <p>
              • Smart contracts are audited but cryptocurrency participation carries inherent risks.
            </p>
            <p>
              • Only participate with funds you can afford to lose.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectInfo;

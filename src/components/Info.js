import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiGlobe, 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign,
  FiLock,
  FiZap,
  FiAward,
  FiTarget,
  FiCheck
} from 'react-icons/fi';

const ProjectInfo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const features = [
    {
      icon: FiShield,
      title: "Blockchain Transparency",
      description: "All draws, token issuance, and results are verifiable on-chain"
    },
    {
      icon: FiGlobe,
      title: "Global Accessibility",
      description: "Anyone worldwide can participate with just $1 minimum entry"
    },
    {
      icon: FiTrendingUp,
      title: "Deflationary Tokenomics",
      description: "Built-in token burn mechanisms maintain sustainable value"
    },
    {
      icon: FiUsers,
      title: "Fair Participation",
      description: "Wallet caps prevent whale dominance and ensure fairness"
    }
  ];

  const statistics = [
    { value: "$1", label: "Minimum Entry" },
    { value: "1,000", label: "Max USDT per Wallet" },
    { value: "5,000", label: "Pool Threshold" },
    { value: "10x", label: "RLT Reward Multiplier" }
  ];

  const operationRules = [
    "Connect your crypto wallet to participate securely",
    "Stake USDT to receive draw tickets (1 USDT = 1 ticket)",
    "Maximum 1,000 USDT per wallet to ensure fair play",
    "Draws trigger when pool reaches 5,000 USDT threshold",
    "Receive 10 RLT tokens for every 1 USDT participated",
    "Winners earn additional USDT rewards from the pool",
    "All results are publicly verifiable on blockchain"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3D2E] via-[#0A352A] to-[#0B3D2E] text-white overflow-x-hidden">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div 
          className="glass-warm text-center"
          variants={itemVariants}
        >
          <div className="glass-content space-y-4">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 glass-light rounded-2xl mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FiAward className="w-8 h-8 text-[#A3FF12]" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A3FF12] to-[#FFFFFF] bg-clip-text text-transparent">
              RandomLotto Draw
            </h1>
            <p className="text-xl text-[#C0C0C0] max-w-2xl mx-auto leading-relaxed">
              The world's most transparent blockchain-powered lottery system. 
              Fair draws, global access, and verifiable results.
            </p>
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <div className="glass">
            <div className="glass-content">
              <div className="flex items-center space-x-3 mb-4">
                <FiTarget className="w-6 h-6 text-[#A3FF12]" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-[#C0C0C0] leading-relaxed">
                To become the world's most trusted global lottery platform powered by blockchain technology, 
                eliminating the opacity and centralization of traditional lottery systems.
              </p>
            </div>
          </div>

          <div className="glass">
            <div className="glass-content">
              <div className="flex items-center space-x-3 mb-4">
                <FiZap className="w-6 h-6 text-[#A3FF12]" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-[#C0C0C0] leading-relaxed">
                Provide low barrier entry lottery experiences with verifiable draws, 
                sustainable tokenomics, and global participation opportunities starting at just $1.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div 
          className="glass-light"
          variants={itemVariants}
        >
          <div className="glass-content">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center space-x-3">
              <FiShield className="w-8 h-8 text-[#A3FF12]" />
              <span>Core Features</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-cool p-6 rounded-xl"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-content">
                    <feature.icon className="w-8 h-8 text-[#A3FF12] mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-[#C0C0C0] leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="glass-dark"
          variants={itemVariants}
        >
          <div className="glass-content">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center space-x-3">
              <FiDollarSign className="w-8 h-8 text-[#A3FF12]" />
              <span>Key Numbers</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#A3FF12] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#C0C0C0] font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="glass"
          variants={itemVariants}
        >
          <div className="glass-content">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center space-x-3">
              <FiLock className="w-8 h-8 text-[#A3FF12]" />
              <span>Operation Rules</span>
            </h2>
            <div className="space-y-4">
              {operationRules.map((rule, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 glass-light rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 glass-warm rounded-full flex items-center justify-center mt-1">
                    <span className="text-[#0B3D2E] font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-[#C0C0C0] leading-relaxed">{rule}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Token Economy */}
        <motion.div 
          className="glass-warm"
          variants={itemVariants}
        >
          <div className="glass-content">
            <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-3">
              <FiTrendingUp className="w-8 h-8 text-[#0B3D2E]" />
              <span className="text-[#0B3D2E]">RLT Token Economy</span>
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-light p-6 rounded-xl">
                  <div className="glass-content">
                    <h3 className="text-xl font-semibold mb-3 text-white">Reward System</h3>
                    <p className="text-[#C0C0C0] mb-4">
                      Participants receive RLT tokens immediately upon staking USDT, 
                      regardless of draw outcomes.
                    </p>
                    <div className="flex items-center space-x-2 text-[#A3FF12]">
                      <FiCheck className="w-5 h-5" />
                      <span className="font-semibold">10 RLT per 1 USDT</span>
                    </div>
                  </div>
                </div>
                
                <div className="glass-light p-6 rounded-xl">
                  <div className="glass-content">
                    <h3 className="text-xl font-semibold mb-3 text-white">Deflationary Model</h3>
                    <p className="text-[#C0C0C0] mb-4">
                      Built-in burn mechanisms control inflation and maintain 
                      long-term token value stability.
                    </p>
                    <div className="flex items-center space-x-2 text-[#A3FF12]">
                      <FiCheck className="w-5 h-5" />
                      <span className="font-semibold">Sustainable Growth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Compliance */}
        <motion.div 
          className="glass-dark"
          variants={itemVariants}
        >
          <div className="glass-content">
            <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-3">
              <FiShield className="w-8 h-8 text-[#A3FF12]" />
              <span>Security & Compliance</span>
            </h2>
            <div className="space-y-4">
              <div className="glass-light p-6 rounded-xl">
                <div className="glass-content">
                  <h3 className="text-xl font-semibold mb-3">Smart Contract Security</h3>
                  <p className="text-[#C0C0C0] leading-relaxed">
                    All smart contracts undergo rigorous auditing to ensure fairness, 
                    prevent manipulation, and protect participant funds.
                  </p>
                </div>
              </div>
              
              <div className="glass-light p-6 rounded-xl">
                <div className="glass-content">
                  <h3 className="text-xl font-semibold mb-3">Legal Compliance</h3>
                  <p className="text-[#C0C0C0] leading-relaxed">
                    Participants are responsible for compliance with local laws. 
                    This platform is not investment advice - participate responsibly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="glass-warm text-center"
          variants={itemVariants}
        >
          <div className="glass-content space-y-6">
            <h2 className="text-3xl font-bold text-[#0B3D2E]">Ready to Join?</h2>
            <p className="text-[#0B3D2E] opacity-80 max-w-2xl mx-auto">
              Connect your wallet and start participating in the most transparent 
              lottery system powered by blockchain technology.
            </p>
            <motion.button
              className="glass-button px-8 py-4 text-lg font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect Wallet & Start Playing
            </motion.button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="glass-light opacity-80"
          variants={itemVariants}
        >
          <div className="glass-content text-center">
            <p className="text-sm text-[#C0C0C0] leading-relaxed">
              <strong className="text-[#A3FF12]">Disclaimer:</strong> RandomLotto Draw is a blockchain-based lottery system. 
              Participation involves financial risk. Please ensure compliance with your local laws and regulations. 
              This is not financial or investment advice. Participate responsibly.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectInfo;

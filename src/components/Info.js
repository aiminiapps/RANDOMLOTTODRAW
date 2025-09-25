import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiInfo, 
  FiShield, 
  FiGlobe, 
  FiZap, 
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiLock,
  FiTarget,
  FiHeart,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi';

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
      icon: <FiShield className="rlt-icon-feature" />,
      title: "Blockchain Transparency",
      description: "All draws, token issuance, and results are completely verifiable on-chain with immutable smart contracts."
    },
    {
      icon: <FiGlobe className="rlt-icon-feature" />,
      title: "Global Accessibility",
      description: "Anyone worldwide can participate with just $1 minimum entry, breaking down traditional lottery barriers."
    },
    {
      icon: <FiZap className="rlt-icon-feature" />,
      title: "Instant Rewards",
      description: "Receive RLT tokens immediately upon participation, even before draws are completed."
    },
    {
      icon: <FiTrendingUp className="rlt-icon-feature" />,
      title: "Deflationary Economy",
      description: "Built-in token burn mechanisms and sustainable tokenomics ensure long-term value growth."
    }
  ];

  const values = [
    {
      icon: <FiUsers className="rlt-icon-value" />,
      title: "Community First",
      description: "Built by the community, for the community with fair participation for everyone."
    },
    {
      icon: <FiAward className="rlt-icon-value" />,
      title: "Merit Based",
      description: "Fair draws powered by verifiable randomness with no human manipulation possible."
    },
    {
      icon: <FiLock className="rlt-icon-value" />,
      title: "Security Focused",
      description: "Audited smart contracts and robust security measures protect all participants."
    },
    {
      icon: <FiTarget className="rlt-icon-value" />,
      title: "Innovation Driven",
      description: "Pioneering the future of decentralized lottery systems with cutting-edge technology."
    }
  ];

  const stats = [
    { label: "Minimum Entry", value: "$1 USDT", icon: <FiHeart /> },
    { label: "Max Per Wallet", value: "1,000 USDT", icon: <FiStar /> },
    { label: "Draw Threshold", value: "5,000 USDT", icon: <FiCheckCircle /> },
    { label: "RLT Reward Rate", value: "10:1 Ratio", icon: <FiTrendingUp /> }
  ];

  return (
    <motion.div 
      className="rlt-info-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div 
        className="glass rlt-hero-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-hero-badge">
            <FiInfo className="rlt-badge-icon" />
            <span className="rlt-badge-text">Project Overview</span>
          </div>
          
          <h1 className="rlt-main-title">
            RandomLotto Draw
            <span className="rlt-title-accent">(RLT)</span>
          </h1>
          
          <p className="rlt-hero-description">
            A revolutionary blockchain-powered lottery system that brings unprecedented transparency, 
            fairness, and global accessibility to lottery-style reward games. Unlike traditional 
            centralized lotteries, RandomLotto uses smart contracts to ensure verifiable, 
            tamper-proof draws open to anyone worldwide.
          </p>
          
          <div className="rlt-hero-highlight glass-warm">
            <div className="glass-content">
              <FiZap className="rlt-highlight-icon" />
              <span className="rlt-highlight-text">
                Telegram Mini App • USDT Stakes • RLT Rewards • Global Access
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vision & Mission */}
      <motion.div 
        className="glass-light rlt-vision-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title">Vision & Mission</h2>
            <div className="rlt-section-line"></div>
          </div>
          
          <div className="rlt-vision-grid">
            <div className="rlt-vision-card glass-cool">
              <div className="glass-content">
                <h3 className="rlt-card-title">Our Vision</h3>
                <p className="rlt-card-text">
                  To become the world's most trusted global lottery platform, powered by blockchain 
                  technology, where transparency and fairness are guaranteed through immutable smart contracts.
                </p>
              </div>
            </div>
            
            <div className="rlt-mission-card glass-warm">
              <div className="glass-content">
                <h3 className="rlt-card-title">Our Mission</h3>
                <p className="rlt-card-text">
                  Democratize lottery participation with minimal barriers, verifiable draws, 
                  sustainable token economy, and global accessibility for all participants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div 
        className="glass rlt-features-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title">Key Features</h2>
            <div className="rlt-section-line"></div>
          </div>
          
          <div className="rlt-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="rlt-feature-card glass-light"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-content">
                  <div className="rlt-feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h3 className="rlt-feature-title">{feature.title}</h3>
                  <p className="rlt-feature-description">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Core Values */}
      <motion.div 
        className="glass-dark rlt-values-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title rlt-light-text">Core Values</h2>
            <div className="rlt-section-line rlt-accent-line"></div>
          </div>
          
          <div className="rlt-values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="rlt-value-item"
                variants={itemVariants}
              >
                <div className="rlt-value-icon-circle">
                  {value.icon}
                </div>
                <div className="rlt-value-content">
                  <h4 className="rlt-value-title">{value.title}</h4>
                  <p className="rlt-value-description">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div 
        className="glass-warm rlt-stats-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title rlt-dark-text">Key Statistics</h2>
            <div className="rlt-section-line rlt-dark-line"></div>
          </div>
          
          <div className="rlt-stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="rlt-stat-card"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rlt-stat-icon">{stat.icon}</div>
                <div className="rlt-stat-value">{stat.value}</div>
                <div className="rlt-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div 
        className="glass rlt-process-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title">How It Works</h2>
            <div className="rlt-section-line"></div>
          </div>
          
          <div className="rlt-process-steps">
            <div className="rlt-step">
              <div className="rlt-step-number">1</div>
              <div className="rlt-step-content">
                <h4 className="rlt-step-title">Connect Wallet</h4>
                <p className="rlt-step-description">
                  Connect your crypto wallet via WalletConnect or MetaMask to get started.
                </p>
              </div>
            </div>
            
            <div className="rlt-step">
              <div className="rlt-step-number">2</div>
              <div className="rlt-step-content">
                <h4 className="rlt-step-title">Stake USDT</h4>
                <p className="rlt-step-description">
                  Deposit USDT to participate. 1 USDT = 1 draw ticket. Maximum 1,000 USDT per wallet.
                </p>
              </div>
            </div>
            
            <div className="rlt-step">
              <div className="rlt-step-number">3</div>
              <div className="rlt-step-content">
                <h4 className="rlt-step-title">Earn RLT</h4>
                <p className="rlt-step-description">
                  Receive RLT tokens immediately (10 RLT per 1 USDT) regardless of draw results.
                </p>
              </div>
            </div>
            
            <div className="rlt-step">
              <div className="rlt-step-number">4</div>
              <div className="rlt-step-content">
                <h4 className="rlt-step-title">Win Prizes</h4>
                <p className="rlt-step-description">
                  When pool reaches 5,000 USDT threshold, smart contracts execute fair draws automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security & Compliance */}
      <motion.div 
        className="glass-cool rlt-security-section"
        variants={itemVariants}
      >
        <div className="glass-content">
          <div className="rlt-section-header">
            <h2 className="rlt-section-title">Security & Compliance</h2>
            <div className="rlt-section-line"></div>
          </div>
          
          <div className="rlt-security-grid">
            <div className="rlt-security-item">
              <FiShield className="rlt-security-icon" />
              <h4 className="rlt-security-title">Smart Contract Audits</h4>
              <p className="rlt-security-text">
                All smart contracts undergo rigorous third-party security audits.
              </p>
            </div>
            
            <div className="rlt-security-item">
              <FiLock className="rlt-security-icon" />
              <h4 className="rlt-security-title">Verifiable Randomness</h4>
              <p className="rlt-security-text">
                Draw results use cryptographically secure randomness that can be verified.
              </p>
            </div>
            
            <div className="rlt-security-item">
              <FiUsers className="rlt-security-icon" />
              <h4 className="rlt-security-title">Anti-Bot Protection</h4>
              <p className="rlt-security-text">
                Advanced mechanisms prevent automated participation and ensure fairness.
              </p>
            </div>
          </div>
          
          <div className="rlt-disclaimer glass-dark">
            <div className="glass-content">
              <div className="rlt-disclaimer-header">
                <FiInfo className="rlt-disclaimer-icon" />
                <span className="rlt-disclaimer-title">Important Notice</span>
              </div>
              <p className="rlt-disclaimer-text">
                RandomLotto is not an investment product. Participation involves risk and should be 
                considered entertainment. Please ensure compliance with your local laws and regulations 
                before participating. You are solely responsible for understanding and following applicable 
                legal requirements in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectInfo;

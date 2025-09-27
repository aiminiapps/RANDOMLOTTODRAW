import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Bot, Brain, Cpu, Network } from 'lucide-react';

const LabelXLoader = () => {
  const satellites = [
    { icon: Database, angle: 0, delay: 0.1 },
    { icon: Brain, angle: 60, delay: 0.15 },
    { icon: Zap, angle: 120, delay: 0.2 },
    { icon: Network, angle: 180, delay: 0.25 },
    { icon: Bot, angle: 240, delay: 0.3 },
    { icon: Cpu, angle: 300, delay: 0.35 }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
      {/* Dynamic Background with Mesh Pattern */}
      <div className="absolute inset-0">
      <div className="min-h-screen w-full bg-transparent relative">
  {/* Emerald Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff00 40%, #10b981 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
  {/* Your Content/Components */}
</div>
        {/* Neural network grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 122, 26, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 122, 26, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 0 0'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-sm mx-auto px-6 flex flex-col items-center">
        {/* Complex Hexagon Network */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 border border-orange-500/20 rounded-full"
            style={{ 
              background: "conic-gradient(from 0deg, transparent, rgba(255, 122, 26, 0.1), transparent)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner rotating ring */}
          <motion.div
            className="absolute inset-8 border border-orange-400/30 rounded-full"
            animate={{ rotate: [360, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Dynamic Connection Web */}
          <svg className="absolute inset-0 w-full h-full" viewBox="-130 -130 260 260">
            {/* Hexagon outline */}
            <motion.polygon
              points="-75,0 -37.5,-65 37.5,-65 75,0 37.5,65 -37.5,65"
              fill="none"
              stroke="rgba(255, 122, 26, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Dynamic connection lines */}
            {satellites.map((_, i) => (
              <g key={`connections-${i}`}>
                {/* To center */}
                <motion.line
                  x1={75 * Math.cos((i * 60 * Math.PI) / 180)}
                  y1={75 * Math.sin((i * 60 * Math.PI) / 180)}
                  x2={0}
                  y2={0}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2 + i * 0.05,
                    ease: "easeOut" 
                  }}
                />
                {/* To next satellite */}
                <motion.line
                  x1={75 * Math.cos((i * 60 * Math.PI) / 180)}
                  y1={75 * Math.sin((i * 60 * Math.PI) / 180)}
                  x2={75 * Math.cos(((i + 1) * 60 * Math.PI) / 180)}
                  y2={75 * Math.sin(((i + 1) * 60 * Math.PI) / 180)}
                  stroke="rgba(255, 122, 26, 0.2)"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + i * 0.03,
                    ease: "easeOut" 
                  }}
                />
              </g>
            ))}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 122, 26, 0.1)" />
                <stop offset="50%" stopColor="rgba(255, 122, 26, 0.6)" />
                <stop offset="100%" stopColor="rgba(255, 122, 26, 0.1)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Satellite Hexagons with Enhanced Design */}
          {satellites.map((satellite, i) => {
            const angle = (satellite.angle * Math.PI) / 180;
            const radius = 75;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const IconComponent = satellite.icon;
            
            return (
              <motion.div
                key={i}
                className="absolute w-14 h-14 flex items-center justify-center"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1 
                }}
                transition={{ 
                  duration: 0.5,
                  delay: satellite.delay,
                  ease: [0.68, -0.55, 0.265, 1.55]
                }}
              >
                {/* Hexagon with layered design */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 122, 26, 0.4), rgba(255, 122, 26, 0.1))",
                    clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                    border: '1px solid rgba(255, 122, 26, 0.6)',
                    boxShadow: '0 0 20px rgba(255, 122, 26, 0.3), inset 0 0 10px rgba(255, 122, 26, 0.2)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 122, 26, 0.3), inset 0 0 10px rgba(255, 122, 26, 0.2)',
                      '0 0 30px rgba(255, 122, 26, 0.5), inset 0 0 15px rgba(255, 122, 26, 0.3)',
                      '0 0 20px rgba(255, 122, 26, 0.3), inset 0 0 10px rgba(255, 122, 26, 0.2)'
                    ]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                />
                
                {/* Icon with glow effect */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                >
                  <IconComponent 
                    size={18} 
                    className="text-orange-200"
                    style={{ 
                      filter: 'drop-shadow(0 0 8px rgba(255, 122, 26, 0.8))',
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Central Hexagon with Advanced Design */}
          <motion.div
            className="relative w-24 h-24 flex items-center justify-center z-20"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1 
            }}
            transition={{ 
              duration: 0.7,
              delay: 0.4,
              ease: [0.68, -0.55, 0.265, 1.55]
            }}
          >
            {/* Multiple layered hexagons for depth */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255, 122, 26, 0.8), rgba(255, 122, 26, 0.4))",
                clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                border: '2px solid rgba(255, 122, 26, 0.8)',
                boxShadow: '0 0 40px rgba(255, 122, 26, 0.6), inset 0 0 20px rgba(255, 122, 26, 0.3)'
              }}
              animate={{
                boxShadow: [
                  '0 0 40px rgba(255, 122, 26, 0.6), inset 0 0 20px rgba(255, 122, 26, 0.3)',
                  '0 0 60px rgba(255, 122, 26, 0.8), inset 0 0 30px rgba(255, 122, 26, 0.5)',
                  '0 0 40px rgba(255, 122, 26, 0.6), inset 0 0 20px rgba(255, 122, 26, 0.3)'
                ],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="relative text-white font-black text-lg tracking-wider z-10"
              style={{ 
                textShadow: '0 0 20px rgba(255, 122, 26, 1), 0 0 40px rgba(255, 122, 26, 0.5)',
                fontFamily: 'system-ui'
              }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 122, 26, 1), 0 0 40px rgba(255, 122, 26, 0.5)',
                  '0 0 30px rgba(255, 122, 26, 1), 0 0 60px rgba(255, 122, 26, 0.7)',
                  '0 0 20px rgba(255, 122, 26, 1), 0 0 40px rgba(255, 122, 26, 0.5)'
                ]
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              LX
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Brand Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-black text-white tracking-wide"
            style={{ 
              textShadow: '0 0 30px rgba(255, 122, 26, 0.8), 0 0 60px rgba(255, 122, 26, 0.4)',
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 122, 26, 0.8), 0 0 60px rgba(255, 122, 26, 0.4)',
                '0 0 40px rgba(255, 122, 26, 1), 0 0 80px rgba(255, 122, 26, 0.6)',
                '0 0 30px rgba(255, 122, 26, 0.8), 0 0 60px rgba(255, 122, 26, 0.4)'
              ]
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            LabelX
          </motion.h1>
          
          <motion.p
            className="text-orange-200/90 text-sm font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            style={{
              textShadow: '0 0 10px rgba(255, 122, 26, 0.5)'
            }}
          >
            Train AI • Earn Tokens
          </motion.p>
        </motion.div>

        {/* Advanced Loading Animation */}
        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          {/* Progress bar with energy effect */}
          <motion.div 
            className="w-32 h-1 bg-orange-900/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full"
              style={{
                boxShadow: '0 0 15px rgba(255, 122, 26, 0.8)'
              }}
              initial={{ width: '0%', x: '-100%' }}
              animate={{ 
                width: ['0%', '100%', '0%'],
                x: ['0%', '0%', '100%']
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LabelXLoader;
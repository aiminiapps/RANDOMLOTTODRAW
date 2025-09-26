'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FiHome } from "react-icons/fi";
import { GoTrophy } from "react-icons/go";

export default function PortiqBottomNav({ activeTab, setActiveTab }) {
    const [isVisible, setIsVisible] = useState(true);
    const [particles, setParticles] = useState([]);

    const navItems = [
        { 
            id: 'home', 
            icon: <FiHome size={22} />, 
            label: 'Home',
            color: '#A3FF12',
            position: 'left'
        },
        { 
            id: 'leaderboard', 
            icon: <GoTrophy size={22} />, 
            label: 'Champions',
            color: '#A3FF12',
            position: 'right'
        }
    ];

    // Generate particles for background effect
    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 12; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 4 + 2,
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2
                });
            }
            setParticles(newParticles);
        };
        generateParticles();
    }, []);

    // Create particle components
    const ParticleEffect = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-green-400/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );

    return (
        <motion.div 
            className="w-full max-w-md mx-3 bottomnav backdrop-blur-xl py-4 relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Creative Container with Hard Shadow */}
            <div className="relative px-6">
                <div 
                    className="glass rounded-3xl p-2 relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, 
                            rgba(20, 90, 50, 0.08) 0%, 
                            rgba(11, 61, 46, 0.12) 50%,
                            rgba(20, 90, 50, 0.08) 100%)`,
                        boxShadow: `
                            0 8px 32px rgba(11, 61, 46, 0.3),
                            0 16px 64px rgba(11, 61, 46, 0.2),
                            inset 0 1px 0 rgba(163, 255, 18, 0.1),
                            inset 0 -1px 0 rgba(11, 61, 46, 0.2)
                        `,
                        border: '0.5px solid rgba(163, 255, 18, 0.15)'
                    }}
                >
                    {/* Particle Background Effect */}
                    <ParticleEffect />
                    
                    {/* Liquid Glass Toggle Track */}
                    <div className="relative flex items-center h-16 rounded-3xl overflow-hidden">
                        
                        {/* Background Glow Effect */}
                        <div 
                            className="absolute inset-0 rounded-3xl opacity-30"
                            style={{
                                background: `radial-gradient(ellipse at center, 
                                    rgba(163, 255, 18, 0.15) 0%, 
                                    transparent 70%)`
                            }}
                        />

                        {/* Sliding Toggle Button */}
                        <motion.div
                            className="absolute top-1 h-14 rounded-2xl z-20 overflow-hidden"
                            style={{
                                width: 'calc(50% - 4px)',
                                background: `linear-gradient(135deg,
                                    rgba(163, 255, 18, 0.25) 0%,
                                    rgba(163, 255, 18, 0.15) 50%,
                                    rgba(163, 255, 18, 0.25) 100%)`,
                                boxShadow: `
                                    0 4px 20px rgba(163, 255, 18, 0.25),
                                    0 8px 40px rgba(11, 61, 46, 0.3),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                    inset 0 -1px 0 rgba(11, 61, 46, 0.3)
                                `,
                                border: '1px solid rgba(163, 255, 18, 0.3)'
                            }}
                            animate={{
                                left: activeTab === 'home' ? '2px' : 'calc(50% + 2px)',
                            }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 30,
                                duration: 0.3
                            }}
                        >
                            {/* Inner Glow Effect */}
                            <div 
                                className="absolute inset-0 rounded-2xl opacity-60"
                                style={{
                                    background: `radial-gradient(ellipse at center,
                                        rgba(163, 255, 18, 0.2) 0%,
                                        transparent 70%)`
                                }}
                            />
                            
                            {/* Liquid Surface Effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    background: `linear-gradient(45deg,
                                        rgba(255, 255, 255, 0.08) 0%,
                                        transparent 30%,
                                        rgba(163, 255, 18, 0.06) 60%,
                                        transparent 100%)`
                                }}
                                animate={{
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>

                        {/* Navigation Items */}
                        <div className="flex w-full h-full relative z-10">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="flex-1 flex items-center justify-center h-full"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={`/?tab=${item.id}`}
                                        onClick={() => setActiveTab(item.id)}
                                        className="flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300"
                                    >
                                        {/* Icon with Dynamic Styling */}
                                        <motion.div 
                                            className={cn(
                                                "flex items-center justify-center mb-1 transition-all duration-300 relative",
                                                activeTab === item.id 
                                                    ? "text-white drop-shadow-[0_0_8px_rgba(163,255,18,0.8)]" 
                                                    : "text-gray-400"
                                            )}
                                            animate={{
                                                scale: activeTab === item.id ? 1.1 : 1,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Active Icon Glow */}
                                            {activeTab === item.id && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full"
                                                    style={{
                                                        background: `radial-gradient(circle,
                                                            rgba(163, 255, 18, 0.3) 0%,
                                                            transparent 70%)`
                                                    }}
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1.5, opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                            {item.icon}
                                        </motion.div>

                                        {/* Label with Smooth Animation */}
                                        <motion.span 
                                            className={cn(
                                                "text-xs font-semibold transition-all duration-300 relative z-10",
                                                activeTab === item.id 
                                                    ? "text-white" 
                                                    : "text-gray-500"
                                            )}
                                            animate={{
                                                opacity: activeTab === item.id ? 1 : 0.7,
                                            }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Edge Highlight Effects */}
                        <div 
                            className="absolute left-0 top-0 w-1 h-full rounded-l-3xl opacity-60"
                            style={{
                                background: `linear-gradient(to bottom,
                                    rgba(163, 255, 18, 0.3) 0%,
                                    rgba(163, 255, 18, 0.1) 50%,
                                    rgba(163, 255, 18, 0.3) 100%)`
                            }}
                        />
                        <div 
                            className="absolute right-0 top-0 w-1 h-full rounded-r-3xl opacity-60"
                            style={{
                                background: `linear-gradient(to bottom,
                                    rgba(163, 255, 18, 0.3) 0%,
                                    rgba(163, 255, 18, 0.1) 50%,
                                    rgba(163, 255, 18, 0.3) 100%)`
                            }}
                        />
                    </div>

                    {/* Bottom Reflection */}
                    <div 
                        className="absolute bottom-0 left-0 w-full h-2 rounded-b-3xl"
                        style={{
                            background: `linear-gradient(to top,
                                rgba(11, 61, 46, 0.4) 0%,
                                transparent 100%)`
                        }}
                    />
                </div>

                {/* Hard Shadow Base */}
                <div 
                    className="absolute inset-0 rounded-3xl -z-10"
                    style={{
                        background: 'rgba(11, 61, 46, 0.15)',
                        transform: 'translateY(4px) scale(0.98)',
                        filter: 'blur(2px)'
                    }}
                />
                
                {/* Secondary Shadow */}
                <div 
                    className="absolute inset-0 rounded-3xl -z-20"
                    style={{
                        background: 'rgba(11, 61, 46, 0.08)',
                        transform: 'translateY(8px) scale(0.95)',
                        filter: 'blur(4px)'
                    }}
                />
            </div>

            {/* Ambient Light Effect */}
            <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse,
                        rgba(163, 255, 18, 0.4) 0%,
                        transparent 70%)`
                }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Gem, Star, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data for the adventure path
const modules = [
    {
        id: 'badge',
        title: 'WingRunner Badge',
        subTitle: '8 Units',
        type: 'badge',
        unlocked: true,
        progress: 0,
        icon: Crown,
        href: '/rank/wingrunner/stage/badge', // UPDATED LINK
    },
    {
        id: 'red-1',
        title: 'Red Jewel 1',
        subTitle: '4 Units',
        type: 'red',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/red-jewel-1', // UPDATED LINK
    },
    {
        id: 'green-1',
        title: 'Green Jewel 1',
        subTitle: '4 Units',
        type: 'green',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/green-jewel-1', // UPDATED LINK
    },
    {
        id: 'red-2',
        title: 'Red Jewel 2',
        subTitle: '4 Units',
        type: 'red',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/red-jewel-2', // UPDATED LINK
    },
    {
        id: 'green-2',
        title: 'Green Jewel 2',
        subTitle: '4 Units',
        type: 'green',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/green-jewel-2', // UPDATED LINK
    },
    {
        id: 'red-3',
        title: 'Red Jewel 3',
        subTitle: '4 Units',
        type: 'red',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/red-jewel-3', // UPDATED LINK
    },
    {
        id: 'green-3',
        title: 'Green Jewel 3',
        subTitle: '4 Units',
        type: 'green',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/green-jewel-3', // UPDATED LINK
    },
    {
        id: 'red-4',
        title: 'Red Jewel 4',
        subTitle: '4 Units',
        type: 'red',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/red-jewel-4', // UPDATED LINK
    },
    {
        id: 'green-4',
        title: 'Green Jewel 4',
        subTitle: '4 Units',
        type: 'green',
        unlocked: true,
        progress: 0,
        icon: Gem,
        href: '/rank/wingrunner/stage/green-jewel-4', // UPDATED LINK
    },
];

export default function WingRunnerRankPage() {
    return (
        <div className="min-h-screen bg-sky-300 overflow-x-hidden relative">
            {/* Sky Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-16 bg-white/80 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="absolute top-20 right-20 w-48 h-24 bg-white/80 rounded-full blur-xl opacity-40 animate-pulse delay-1000" />
                <div className="absolute top-1/3 left-1/4 w-64 h-32 bg-white/60 rounded-full blur-2xl opacity-30" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="
                        inline-flex items-center 
                        text-sky-900 bg-white/40 hover:bg-white/60 
                        backdrop-blur-sm rounded-full 
                        px-6 py-3 mb-6
                        text-xl font-bold 
                        transition-all duration-300 
                        transform hover:scale-105 hover:shadow-lg
                    "
                >
                    <ArrowLeft className="w-8 h-8 mr-3 stroke-[3]" />
                    Back to Home
                </Link>
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md tracking-tight mb-2">
                        My Adventure Path
                    </h1>
                    <p className="text-xl text-sky-100 font-medium">
                        Keep going, WingRunner! You're doing great.
                    </p>
                </header>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {modules.map((module, index) => (
                            <ModuleCard key={module.id} module={module} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModuleCard({ module, index }: { module: any; index: number }) {
    const isLocked = !module.unlocked;

    // Color mappings
    const colorStyles = {
        badge: 'bg-amber-400 border-amber-600 shadow-amber-900/20',
        red: 'bg-rose-500 border-rose-700 shadow-rose-900/20',
        green: 'bg-emerald-500 border-emerald-700 shadow-emerald-900/20',
    };

    const currentStyle = colorStyles[module.type as keyof typeof colorStyles] || colorStyles.badge;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: isLocked ? 0 : [-1, 1, -1, 0] }}
            className={`relative group ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
        >
            <Link href={isLocked ? '#' : module.href} className={isLocked ? 'cursor-not-allowed' : ''}>
                <div
                    className={`
            relative p-6 rounded-3xl border-b-8 
            ${currentStyle} 
            text-white shadow-xl transition-all duration-300
            transform hover:-translate-y-1 hover:shadow-2xl
            flex flex-col items-center text-center
            min-h-[200px] justify-center
          `}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent rounded-3xl" />

                    {/* Icon Floating */}
                    <div className="mb-4 p-4 bg-white/20 rounded-full backdrop-blur-sm shadow-inner ring-2 ring-white/30">
                        {isLocked ? <Lock className="w-8 h-8 md:w-10 md:h-10 text-white/80" /> : <module.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                    </div>

                    <h3 className="text-2xl font-bold mb-1 drop-shadow-sm">{module.title}</h3>
                    <span className="text-white/90 font-medium bg-black/10 px-3 py-1 rounded-full text-sm">
                        {module.subTitle}
                    </span>

                    {/* Progress Bar (if unlocked and not complete) */}
                    {module.unlocked && module.progress < 100 && module.progress > 0 && (
                        <div className="absolute bottom-6 w-3/4 h-3 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full"
                                style={{ width: `${module.progress}%` }}
                            />
                        </div>
                    )}

                    {/* Completed Check/Star */}
                    {module.progress === 100 && (
                        <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-800 p-2 rounded-full shadow-lg border-4 border-white transform rotate-12">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                    )}
                </div>

                {/* Floating Island Base Shadow/Cloud */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-lg rounded-full -z-10 group-hover:scale-110 transition-transform duration-300" />
            </Link>
        </motion.div>
    );
}

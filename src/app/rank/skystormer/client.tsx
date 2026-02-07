'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Gem, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SkyStormerGrid({ stages }: { stages: any[] }) {
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
                        SkyStormer Adventure
                    </h1>
                    <p className="text-xl text-sky-100 font-medium">
                        Soar high, SkyStormer!
                    </p>
                </header>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {stages.map((stage, index) => (
                            <ModuleCard key={stage.id} stage={stage} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModuleCard({ stage, index }: { stage: any; index: number }) {
    // Determine type/icon based on title for now
    let type = 'badge';
    let Icon = Crown;

    const titleLower = stage.title.toLowerCase();
    if (titleLower.includes('red')) {
        type = 'red';
        Icon = Gem;
    } else if (titleLower.includes('green')) {
        type = 'green';
        Icon = Gem;
    } else if (titleLower.includes('blue')) {
        type = 'blue';
        Icon = Gem;
    }

    const isLocked = false;

    // Color mappings
    const colorStyles = {
        badge: 'bg-amber-400 border-amber-600 shadow-amber-900/20',
        red: 'bg-rose-500 border-rose-700 shadow-rose-900/20',
        green: 'bg-emerald-500 border-emerald-700 shadow-emerald-900/20',
        blue: 'bg-blue-500 border-blue-700 shadow-blue-900/20',
    };

    const currentStyle = colorStyles[type as keyof typeof colorStyles] || colorStyles.badge;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: isLocked ? 0 : [-1, 1, -1, 0] }}
            className={`relative group ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
        >
            <Link href={`/rank/skystormer/stage/${stage.id}`} className={isLocked ? 'cursor-not-allowed' : ''}>
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
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-1 drop-shadow-sm">{stage.title}</h3>
                    <span className="text-white/90 font-medium bg-black/10 px-3 py-1 rounded-full text-sm">
                        {stage.units.length} Units
                    </span>
                </div>

                {/* Floating Island Base Shadow/Cloud */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-lg rounded-full -z-10 group-hover:scale-110 transition-transform duration-300" />
            </Link>
        </motion.div>
    );
}

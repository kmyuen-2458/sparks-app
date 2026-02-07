'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Gem, ArrowLeft, Bird } from 'lucide-react';
import Link from 'next/link';

export default function HangGliderGrid({ stages }: { stages: any[] }) {
    return (
        <div className="min-h-screen bg-green-50 overflow-x-hidden relative">
            {/* Background Elements - Nature Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-100/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-200/30 to-transparent" />

                {/* Decorative Circles */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-100/40 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-200/40 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="
                        inline-flex items-center 
                        text-green-800 bg-white/60 hover:bg-white/80 
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
                    <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 drop-shadow-sm tracking-tight mb-2">
                        HangGlider Adventure
                    </h1>
                    <p className="text-xl text-green-700 font-medium">
                        Glide through God's Word!
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
    // Determine type/icon based on title
    let type = 'badge';
    let Icon = Bird; // Default icon

    const titleLower = stage.title.toLowerCase();

    if (titleLower.includes('badge')) {
        type = 'badge';
        Icon = Crown;
    } else if (titleLower.includes('red')) {
        type = 'red';
        Icon = Gem;
    } else if (titleLower.includes('green')) {
        type = 'green';
        Icon = Gem;
    }

    const isLocked = false;

    // Color mappings - Green/Nature Theme
    const colorStyles = {
        badge: 'bg-yellow-400 border-yellow-600 shadow-yellow-900/10 text-yellow-900',
        red: 'bg-red-400 border-red-600 shadow-red-900/10 text-white',
        green: 'bg-green-500 border-green-700 shadow-green-900/10 text-white',
        default: 'bg-emerald-400 border-emerald-600 shadow-emerald-900/10 text-white'
    };

    const currentStyle = colorStyles[type as keyof typeof colorStyles] || colorStyles.default;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: isLocked ? 0 : [-1, 1, -1, 0] }}
            className={`relative group ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
        >
            <Link href={`/rank/hangglider/stage/${stage.id}`} className={isLocked ? 'cursor-not-allowed' : ''}>
                <div
                    className={`
            relative p-6 rounded-3xl border-b-8 
            ${currentStyle} 
            shadow-xl transition-all duration-300
            transform hover:-translate-y-1 hover:shadow-2xl
            flex flex-col items-center text-center
            min-h-[200px] justify-center
          `}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent rounded-3xl" />


                    {/* Icon Floating */}
                    <div className="mb-4 p-4 bg-white/30 rounded-full backdrop-blur-sm shadow-inner ring-2 ring-white/40">
                        <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>

                    <h3 className="text-2xl font-bold mb-1 drop-shadow-sm">{stage.title}</h3>
                    <span className="font-medium bg-black/10 px-3 py-1 rounded-full text-sm">
                        {stage.units.length} Units
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

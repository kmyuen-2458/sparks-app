'use client';

import { useAudioData } from '@/hooks/use-audio-data';
import Link from 'next/link';
import { Crown, Gem, Star, Lock, ArrowLeft, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function UnitListClient({ rankId }: { rankId: string }) {
    const { data, loading, error } = useAudioData();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-blue-500 font-bold animate-pulse">Loading Adventure...</div>
            </div>
        );
    }

    const rank = data?.ranks.find(r => r.id === rankId);

    if (!rank) {
        return (
            <div className="min-h-screen p-8 text-center flex flex-col items-center justify-center bg-sky-100">
                <h1 className="text-3xl font-bold mb-4 text-slate-800">Rank Not Found</h1>
                <p className="text-slate-600 mb-6">We couldn't find the rank "{rankId}".</p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    // Determine background style based on rank (just for the main bg)
    const bgStyle = getRankBackground(rankId);

    return (
        <div className={`min-h-screen ${bgStyle} overflow-x-hidden relative font-sans`}>
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
                        {rank.title}
                    </h1>
                    <p className="text-xl text-sky-100 font-medium bg-black/10 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                        My Adventure Path
                    </p>
                </header>

                <div className="max-w-5xl mx-auto">
                    {!rank.stages?.length ? (
                        <div className="p-8 text-center bg-white/50 rounded-2xl backdrop-blur-sm">
                            <p className="text-slate-600 font-medium text-lg">No stages found for this rank yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {rank.stages.map((stage, index) => (
                                <StageCard
                                    key={stage.id}
                                    stage={stage}
                                    rankId={rankId}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StageCard({ stage, rankId, index }: { stage: any; rankId: string; index: number }) {
    // Logic to determine style based on title text
    const style = getStageStyle(stage.title);

    // Logic to determine icon
    const Icon = getStageIcon(stage.title);

    // Default unlocked for now (since we don't have user progress tracking yet)
    // You can hook up real progress later
    const isLocked = false;
    const progress = 0; // Placeholder

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: isLocked ? 0 : [-1, 1, -1, 0] }}
            className={`relative group ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
        >
            <Link
                href={`/rank/${rankId}/stage/${stage.id}`}
                className={isLocked ? 'cursor-not-allowed pointer-events-none' : ''}
            >
                <div
                    className={`
                        relative p-6 rounded-3xl border-b-8 
                        ${style.className}
                        text-white shadow-xl transition-all duration-300
                        transform hover:-translate-y-1 hover:shadow-2xl
                        flex flex-col items-center text-center
                        min-h-[220px] justify-center
                    `}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent rounded-3xl" />

                    {/* Icon Floating */}
                    <div className="mb-4 p-4 bg-white/20 rounded-full backdrop-blur-sm shadow-inner ring-2 ring-white/30">
                        {isLocked ? <Lock className="w-8 h-8 md:w-10 md:h-10 text-white/80" /> : <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                    </div>

                    <h3 className="text-2xl font-bold mb-2 drop-shadow-sm leading-tight">{stage.title}</h3>

                    <span className="text-white/90 font-medium bg-black/10 px-3 py-1 rounded-full text-sm">
                        {stage.units.length} Units
                    </span>

                    {/* Completion Star (Placeholder for future) */}
                    {progress === 100 && (
                        <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-800 p-2 rounded-full shadow-lg border-4 border-white transform rotate-12">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                    )}
                </div>

                {/* Floating Island Base Shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-lg rounded-full -z-10 group-hover:scale-110 transition-transform duration-300" />
            </Link>
        </motion.div>
    );
}

// --- Helper Functions ---

function getRankBackground(rankId: string) {
    const id = rankId.toLowerCase();
    if (id.includes('hangglider')) return 'bg-lime-400'; // Specific green for HangGlider
    if (id.includes('wingrunner')) return 'bg-sky-300';
    if (id.includes('skystormer')) return 'bg-rose-400';
    return 'bg-blue-300'; // Default
}

function getStageStyle(title: string) {
    const t = title.toLowerCase();

    if (t.includes('badge')) {
        return { className: 'bg-amber-400 border-amber-600 shadow-amber-900/20' };
    }
    if (t.includes('red')) {
        return { className: 'bg-rose-500 border-rose-700 shadow-rose-900/20' };
    }
    if (t.includes('green')) {
        return { className: 'bg-emerald-500 border-emerald-700 shadow-emerald-900/20' };
    }

    // Fallback/Generic styles
    return { className: 'bg-indigo-500 border-indigo-700 shadow-indigo-900/20' };
}

function getStageIcon(title: string) {
    const t = title.toLowerCase();
    if (t.includes('badge')) return Crown;
    if (t.includes('red') || t.includes('green')) return Gem;
    return Star; // Default icon
}

'use client';

import { useAudioData } from '@/hooks/use-audio-data';
import { useProgressStore } from '@/store/progress-store';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

export default function StageListClient({ rankId, stageId }: { rankId: string; stageId: string }) {
    const { data, loading } = useAudioData();
    const tracksProgress = useProgressStore((state) => state.tracks);

    if (loading) {
        return <div className="min-h-screen bg-sky-50 flex items-center justify-center animate-pulse text-blue-500 font-bold">Loading Stage...</div>;
    }

    const rank = data?.ranks.find(r => r.id === rankId);
    const stage = rank?.stages?.find(s => s.id === stageId);

    if (!rank || !stage) {
        return (
            <div className="min-h-screen p-8 text-center bg-sky-50">
                <h1 className="text-2xl font-bold mb-4">Stage Not Found</h1>
                <Link href={`/rank/${rankId}`} className="text-blue-600 underline">Back to Rank</Link>
            </div>
        );
    }

    const theme = getTheme(rankId);

    return (
        <div className={clsx("min-h-screen font-sans pb-20", theme.bg)}>
            {/* Header */}
            <header className={clsx("p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4", theme.headerBg)}>
                <Link href={`/rank/${rankId}`} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                    <ChevronLeft className="text-white" size={32} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-white/90">{rank.title}</h1>
                    <h2 className="text-3xl font-black text-white drop-shadow-md tracking-tight leading-none">{stage.title}</h2>
                </div>
            </header>

            <div className="max-w-md mx-auto p-4 space-y-4 pt-8">
                <p className={clsx("font-bold text-lg mb-4 px-2 opacity-80", theme.textColor)}>
                    Select a Unit:
                </p>

                {stage.units.map((unit) => {
                    // Calculate Progress
                    const totalTracks = unit.tracks.length;
                    const completedTracks = unit.tracks.filter(t => tracksProgress[t.driveFileId]?.isCompleted).length; // Check Key
                    const isCompleted = totalTracks > 0 && completedTracks === totalTracks;
                    const percent = totalTracks > 0 ? Math.round((completedTracks / totalTracks) * 100) : 0;

                    return (
                        <Link
                            key={unit.id}
                            href={`/rank/${rankId}/stage/${stageId}/unit/${unit.id}`}
                            className={clsx(
                                "block group bg-white rounded-3xl p-5 shadow-lg border-b-8 transition-all hover:scale-105 active:scale-95",
                                isCompleted ? "border-green-400 bg-green-50" : "border-slate-100"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon / Status */}
                                <div className={clsx(
                                    "w-14 h-14 rounded-full flex items-center justify-center shadow-inner text-white transition-colors",
                                    isCompleted ? "bg-green-500" : theme.iconBg
                                )}>
                                    {isCompleted ? <CheckCircle2 size={32} /> : <PlayCircle size={32} />}
                                </div>

                                <div className="flex-1">
                                    <h3 className={clsx("text-xl font-bold leading-tight group-hover:text-black", isCompleted ? "text-green-800" : "text-slate-800")}>
                                        {unit.title}
                                    </h3>

                                    {/* Progress Bar */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={clsx("h-full rounded-full transition-all duration-500", theme.progressColor)}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 w-12 text-right">{completedTracks}/{totalTracks}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function getTheme(rankId: string) {
    const id = rankId.toLowerCase();

    // HangGlider = Green
    if (id.includes('hangglider')) {
        return {
            bg: 'bg-green-50', headerBg: 'bg-green-500', iconBg: 'bg-green-400',
            textColor: 'text-green-800', progressColor: 'bg-green-500'
        };
    }
    // WingRunner = Blue
    if (id.includes('wingrunner')) {
        return {
            bg: 'bg-blue-50', headerBg: 'bg-blue-500', iconBg: 'bg-blue-400',
            textColor: 'text-blue-800', progressColor: 'bg-blue-500'
        };
    }
    // SkyStormer = Red
    if (id.includes('skystormer')) {
        return {
            bg: 'bg-red-50', headerBg: 'bg-red-500', iconBg: 'bg-red-400',
            textColor: 'text-red-800', progressColor: 'bg-red-500'
        };
    }
    return {
        bg: 'bg-slate-50', headerBg: 'bg-slate-500', iconBg: 'bg-slate-400',
        textColor: 'text-slate-800', progressColor: 'bg-slate-500'
    };
}

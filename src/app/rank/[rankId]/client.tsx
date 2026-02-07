'use client';

import { useAudioData } from '@/hooks/use-audio-data';
import Link from 'next/link';
import { ChevronLeft, Book } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function UnitListClient({ rankId }: { rankId: string }) {
    const { data, loading, error } = useAudioData();
    const router = useRouter();

    if (loading) {
        return <div className="min-h-screen bg-sky-50 flex items-center justify-center animate-pulse text-blue-500 font-bold">Loading Units...</div>;
    }

    const rank = data?.ranks.find(r => r.id === rankId);
    console.log('Target Rank:', rankId);
    console.log('Available Ranks:', data?.ranks.map(r => r.id));

    if (!rank) {
        return (
            <div className="min-h-screen p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Rank Not Found</h1>
                <div className="bg-slate-100 p-4 rounded text-left text-xs font-mono mb-4 overflow-auto max-h-64">
                    <p><strong>Target:</strong> {rankId}</p>
                    <p><strong>Loaded Ranks:</strong> {data?.ranks?.length || 0}</p>
                    <p><strong>IDs:</strong> {data?.ranks?.map(r => r.id).join(', ') || 'None'}</p>
                    <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                    <p><strong>Error:</strong> {JSON.stringify(error)}</p>
                </div>
                <Link href="/" className="text-blue-600 underline">Go Home</Link>
            </div>
        );
    }

    const theme = getTheme(rankId);

    return (
        <div className={clsx("min-h-screen font-sans pb-20", theme.bg)}>
            {/* Header */}
            <header className={clsx("p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4", theme.headerBg)}>
                <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                    <ChevronLeft className="text-white" size={32} />
                </Link>
                <h1 className="text-3xl font-black text-white drop-shadow-md tracking-tight">{rank.title}</h1>
            </header>

            <div className="max-w-md mx-auto p-4 space-y-4 pt-8">
                <p className={clsx("font-bold text-lg mb-4 px-2 opacity-80", theme.textColor)}>
                    Select a Stage:
                </p>

                {!rank.stages?.length && (
                    <div className="p-8 text-center bg-white/50 rounded-2xl">
                        <p className="text-gray-500 font-medium">No stages found for this rank.</p>
                    </div>
                )}

                {rank.stages?.map((stage) => (
                    <Link
                        key={stage.id}
                        href={`/rank/${rankId}/stage/${stage.id}`}
                        className="block group bg-white rounded-3xl p-6 shadow-lg border-b-8 border-slate-100 hover:border-slate-200 hover:scale-105 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-5">
                            <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md", theme.iconBg)}>
                                <Book size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-black">{stage.title}</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">
                                    {stage.units.length} Units
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function getTheme(rankId: string) {
    const id = rankId.toLowerCase();
    if (id.includes('hangglider')) {
        return {
            bg: 'bg-green-50',
            headerBg: 'bg-green-500',
            iconBg: 'bg-green-500',
            textColor: 'text-green-800'
        };
    }
    if (id.includes('wingrunner')) {
        return {
            bg: 'bg-blue-50',
            headerBg: 'bg-blue-500',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-800'
        };
    }
    if (id.includes('skystormer')) {
        return {
            bg: 'bg-red-50',
            headerBg: 'bg-red-500',
            iconBg: 'bg-red-500',
            textColor: 'text-red-800'
        };
    }
    return {
        bg: 'bg-slate-50',
        headerBg: 'bg-slate-500',
        iconBg: 'bg-slate-500',
        textColor: 'text-slate-800'
    };
}

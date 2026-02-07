'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioData } from '@/hooks/use-audio-data';
import { useProgressStore } from '@/store/progress-store';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';

export default function UnitPlayerClient({ rankId, stageId, unitId }: { rankId: string; stageId: string; unitId: string }) {
    const { data, loading } = useAudioData();

    // Audio State
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0); // 0-100
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Store
    const { tracks: savedTracks, updateProgress, markCompleted } = useProgressStore();

    const rank = data?.ranks.find(r => r.id === rankId);
    const stage = rank?.stages?.find(s => s.id === stageId);
    const unit = stage?.units.find(u => u.id === unitId);

    const tracks = unit?.tracks || [];
    const currentTrack = tracks[currentTrackIndex];

    // Restore last position on mount (if same track)
    // Resume logic removed as per request
    // Restoring last position on mount is disabled.
    useEffect(() => {
        // Reset to start when changing tracks
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }, [currentTrack?.id]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // Handle Track Change
    useEffect(() => {
        if (currentTrack) {
            setIsPlaying(true); // Auto-play when changing tracks via UI
            setProgress(0);
            setCurrentTime(0);
        }
    }, [currentTrackIndex]);

    if (loading) return <div className="min-h-screen bg-sky-50 flex items-center justify-center animate-pulse text-blue-500 font-bold">Loading Player...</div>;

    if (!rank || !stage || !unit) {
        return (
            <div className="min-h-screen p-8 text-center bg-sky-50">
                <h1 className="text-2xl font-bold mb-4">Unit Not Found</h1>
                <Link href={`/rank/${rankId}/stage/${stageId}`} className="text-blue-600 underline">Back</Link>
            </div>
        );
    }

    const theme = getTheme(rankId);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                // Ignore AbortError which happens if play is interrupted by pause() or unmount
                if (e.name === 'AbortError') return;
                console.error("Play error:", e);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const playTrack = (index: number) => {
        setCurrentTrackIndex(index);
    };

    const onTimeUpdate = () => {
        if (!audioRef.current || !currentTrack) return;
        const curr = audioRef.current.currentTime;
        const dur = audioRef.current.duration;

        setCurrentTime(curr);
        setDuration(dur);
        setProgress((curr / dur) * 100);

        if (Math.round(curr) % 2 === 0) {
            updateProgress(currentTrack.driveFileId, curr, dur);
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        if (currentTrack) {
            markCompleted(currentTrack.driveFileId);
            // Auto-advance
            if (currentTrackIndex < tracks.length - 1) {
                setTimeout(() => {
                    setCurrentTrackIndex(prev => prev + 1);
                }, 1000);
            }
        }
    };

    const cycleSpeed = () => {
        const speeds = [0.75, 1, 1.25];
        const idx = speeds.indexOf(playbackRate);
        setPlaybackRate(speeds[(idx + 1) % speeds.length]);
    };

    return (
        <div className={clsx("min-h-screen font-sans pb-40", theme.bg)}>
            <audio
                ref={audioRef}
                src={currentTrack?.localUrl}
                autoPlay={isPlaying}
                onTimeUpdate={onTimeUpdate}
                onEnded={onEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onError={(e) => {
                    console.error("Audio Error", e);
                    setIsPlaying(false);
                }}
            />

            {/* Header */}
            <header className={clsx("p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3", theme.headerBg)}>
                <Link href={`/rank/${rankId}/stage/${stageId}`} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                    <ChevronLeft className="text-white" size={28} />
                </Link>
                <div className="flex-1 overflow-hidden">
                    <h1 className="text-sm font-semibold text-white/80 truncate">{rank.title} &bull; {stage.title}</h1>
                    <h2 className="text-xl font-bold text-white truncate">{unit.title}</h2>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-md mx-auto p-4 pt-6 space-y-3">
                {tracks.length === 0 && <p className="text-center text-gray-500">No tracks found.</p>}

                {/* Special Content for Specific Units */}
                {(() => {
                    const key = `${rankId}-${stageId}-${unitId}`;

                    // Bring a Friend (Red Jewel 1, Unit 1) - All Ranks
                    if (stageId === 'red-jewel-1' && unitId === '1') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-rose-100 text-center">
                                <h3 className="text-2xl font-bold text-rose-600 mb-4">Bring a Friend</h3>
                                <p className="text-slate-600">
                                    Invite a friend to join you on your <span className="font-bold">{rank.title}</span> adventure!
                                </p>
                            </div>
                        );
                    }

                    // HangGlider - Red Jewel 3, Unit 1
                    if (key === 'hangglider-red-jewel-3-1') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-rose-100 text-center">
                                <h3 className="text-xl font-bold text-rose-600 mb-4">Bible Fact</h3>
                                <p className="text-lg text-slate-700">Remember: There are 27 books in the New Testament</p>
                            </div>
                        );
                    }

                    // HangGlider - Green Jewel 4, Unit 3
                    if (key === 'hangglider-green-jewel-4-3') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-emerald-100 text-center">
                                <h3 className="text-xl font-bold text-emerald-600 mb-4">Home Activity</h3>
                                <p className="text-lg text-slate-700">Complete the Obey Your Parents Chart this week</p>
                            </div>
                        );
                    }

                    // SkyStormer - Green Jewel 4, Unit 2
                    if (key === 'skystormer-green-jewel-4-2') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-emerald-100 text-center">
                                <h3 className="text-xl font-bold text-emerald-600 mb-4">Friendship Activity</h3>
                                <p className="text-lg text-slate-700">Pick three things from the list to do for a friend</p>
                            </div>
                        );
                    }

                    if (key === 'wingrunner-red-jewel-3-1') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-rose-100 text-center">
                                <h3 className="text-xl font-bold text-rose-600 mb-4">Activity Time</h3>
                                <p className="text-lg text-slate-700">Answer the 6 questions on p. 74</p>
                            </div>
                        );
                    }
                    if (key === 'wingrunner-green-jewel-4-3') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-emerald-100 text-center">
                                <h3 className="text-xl font-bold text-emerald-600 mb-4">Parent Activity</h3>
                                <p className="text-lg text-slate-700">Work with your parents on p. 103</p>
                            </div>
                        );
                    }
                    // WingRunner - Badge, Unit 7
                    if (key === 'wingrunner-badge-7') {
                        return (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-emerald-100 text-center">
                                <h3 className="text-xl font-bold text-emerald-600 mb-4">Activity</h3>
                                <p className="text-lg text-slate-700">Complete the New Testament puzzle</p>
                            </div>
                        );
                    }
                    console.log('Rendering special content key:', key);
                    return null;
                })()}

                {tracks.map((track, idx) => {
                    const isCurrent = idx === currentTrackIndex;
                    const status = savedTracks[track.driveFileId];
                    const isCompleted = status?.isCompleted;

                    return (
                        <button
                            key={track.id}
                            onClick={() => playTrack(idx)}
                            className={clsx(
                                "w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all shadow-sm border-2",
                                isCurrent ? `bg-white border-${theme.colorKey}-500 ring-2 ring-${theme.colorKey}-200` : "bg-white border-transparent hover:border-slate-200"
                            )}
                        >
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                isCurrent ? theme.iconBg + " text-white" : "bg-slate-100 text-slate-400"
                            )}>
                                {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className={isCurrent ? "" : "ml-0.5"} />}
                            </div>

                            <div className="flex-1">
                                <p className={clsx("font-bold text-lg", isCurrent ? theme.textColor : "text-slate-600")}>{track.title}</p>
                                {status && !isCompleted && status.lastPosition > 0 && (
                                    <p className="text-xs text-slate-400">Resuming from {formatTime(status.lastPosition)}</p>
                                )}
                            </div>

                            {isCompleted ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-slate-200" />}
                        </button>
                    );
                })}

                {/* Next Unit Button */}
                {(() => {
                    // Logic to find next unit
                    let nextUrl = null;
                    let nextTitle = '';

                    const currentUnitIndex = stage.units.findIndex(u => u.id === unitId);

                    // 1. Check next unit in current stage
                    if (currentUnitIndex < stage.units.length - 1) {
                        const nextUnit = stage.units[currentUnitIndex + 1];
                        nextUrl = `/rank/${rankId}/stage/${stageId}/unit/${nextUnit.id}`;
                        nextTitle = nextUnit.title;
                    }
                    // 2. Check first unit of next stage
                    else {
                        const currentStageIndex = rank.stages.findIndex(s => s.id === stageId);
                        if (currentStageIndex < rank.stages.length - 1) {
                            const nextStage = rank.stages[currentStageIndex + 1];
                            if (nextStage.units.length > 0) {
                                const nextUnit = nextStage.units[0];
                                nextUrl = `/rank/${rankId}/stage/${nextStage.id}/unit/${nextUnit.id}`;
                                nextTitle = nextUnit.title;
                            }
                        }
                    }

                    if (!nextUrl) return null;

                    return (
                        <div className="pt-4">
                            <Link
                                href={nextUrl}
                                className={clsx(
                                    "w-full flex items-center justify-between p-4 rounded-xl text-white font-bold text-lg shadow-md hover:opacity-90 active:scale-95 transition-all",
                                    theme.headerBg
                                )}
                            >
                                <span>Next Unit</span>
                                <ChevronLeft className="rotate-180" size={24} />
                            </Link>
                        </div>
                    );
                })()}

            </div>

            {/* Sticky Player (Only show if not special content) */}
            {(() => {
                const key = `${rankId}-${stageId}-${unitId}`;

                // Check for special content
                const isBringAFriend = stageId === 'red-jewel-1' && unitId === '1';
                const isWingRunnerSpecial = ['wingrunner-red-jewel-3-1', 'wingrunner-green-jewel-4-3', 'wingrunner-badge-7'].includes(key);
                const isHangGliderSpecial = ['hangglider-red-jewel-3-1', 'hangglider-green-jewel-4-3'].includes(key);
                const isSkyStormerSpecial = ['skystormer-green-jewel-4-2'].includes(key);

                if (isBringAFriend || isWingRunnerSpecial || isHangGliderSpecial || isSkyStormerSpecial) return null;

                return (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 pb-8 safe-area-pb">
                        <div className="max-w-md mx-auto relative">

                            {/* Progress Bar (Interactive Slider) */}
                            <div className="mb-4">
                                <div className="relative h-4 flex items-center group">
                                    {/* Track Background */}
                                    <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full transition-all", theme.progressBar)}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    {/* Interactive Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={(e) => {
                                            const newTime = Number(e.target.value);
                                            if (audioRef.current) {
                                                audioRef.current.currentTime = newTime;
                                                setCurrentTime(newTime);
                                                setProgress((newTime / duration) * 100);
                                            }
                                        }}
                                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                    />

                                    {/* Thumb (Visual only) */}
                                    <div
                                        className={clsx(
                                            "absolute w-4 h-4 bg-white rounded-full shadow-md border-2 transform -translate-x-1/2 pointer-events-none transition-transform group-hover:scale-110",
                                            theme.iconBg.replace('bg-', 'border-')
                                        )}
                                        style={{ left: `${progress}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-slate-400 font-bold mt-1 select-none">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={cycleSpeed}
                                    className="w-12 h-12 flex items-center justify-center font-bold text-slate-500 bg-slate-100 rounded-full active:scale-95"
                                >
                                    {playbackRate}x
                                </button>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCurrentTrackIndex(Math.max(0, currentTrackIndex - 1))}
                                        disabled={currentTrackIndex === 0}
                                        className="p-3 text-slate-400 hover:text-slate-600 disabled:opacity-30 active:scale-95"
                                    >
                                        <SkipBack size={32} fill="currentColor" />
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className={clsx("w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform", theme.iconBg)}
                                    >
                                        {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <button
                                        onClick={() => setCurrentTrackIndex(Math.min(tracks.length - 1, currentTrackIndex + 1))}
                                        disabled={currentTrackIndex === tracks.length - 1}
                                        className="p-3 text-slate-400 hover:text-slate-600 disabled:opacity-30 active:scale-95"
                                    >
                                        <SkipForward size={32} fill="currentColor" />
                                    </button>
                                </div>

                                <div className="w-12" /> {/* Spacer for balance */}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

function formatTime(seconds: number) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function getTheme(rankId: string) {
    const id = rankId.toLowerCase();

    // HangGlider = Green
    if (id.includes('hangglider')) {
        return {
            colorKey: 'green',
            bg: 'bg-green-50', headerBg: 'bg-green-500', iconBg: 'bg-green-500',
            textColor: 'text-green-800', progressBar: 'bg-green-500'
        };
    }
    // WingRunner = Blue
    if (id.includes('wingrunner')) {
        return {
            colorKey: 'blue',
            bg: 'bg-blue-50', headerBg: 'bg-blue-500', iconBg: 'bg-blue-500',
            textColor: 'text-blue-800', progressBar: 'bg-blue-500'
        };
    }
    // SkyStormer = Red
    if (id.includes('skystormer')) {
        return {
            colorKey: 'red',
            bg: 'bg-red-50', headerBg: 'bg-red-500', iconBg: 'bg-red-500',
            textColor: 'text-red-800', progressBar: 'bg-red-500'
        };
    }
    return {
        colorKey: 'slate',
        bg: 'bg-slate-50', headerBg: 'bg-slate-500', iconBg: 'bg-slate-500',
        textColor: 'text-slate-800', progressBar: 'bg-slate-500'
    };
}

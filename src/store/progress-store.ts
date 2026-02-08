import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TrackProgress {
    trackId: string;
    isCompleted: boolean;
    lastPosition: number; // seconds
    lastPlayedAt: number; // timestamp
}

interface ProgressState {
    tracks: Record<string, TrackProgress>;

    // Actions
    updateProgress: (trackId: string, position: number, duration: number) => void;
    markCompleted: (trackId: string) => void;
    getTrackProgress: (trackId: string) => TrackProgress | undefined;

    // Unit Actions
    completedUnits: string[];
    toggleUnitComplete: (unitId: string) => void;
    isUnitComplete: (unitId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            tracks: {},
            completedUnits: [],

            updateProgress: (trackId, position, duration) => {
                set((state) => {
                    const current = state.tracks[trackId] || {
                        trackId,
                        isCompleted: false,
                        lastPosition: 0,
                        lastPlayedAt: 0
                    };

                    // Mark completed if >= 90%
                    const isCompleted = current.isCompleted || (duration > 0 && position / duration >= 0.9);

                    return {
                        tracks: {
                            ...state.tracks,
                            [trackId]: {
                                ...current,
                                lastPosition: position,
                                isCompleted,
                                lastPlayedAt: Date.now()
                            }
                        }
                    };
                });
            },

            markCompleted: (trackId) => {
                set((state) => {
                    const current = state.tracks[trackId] || {
                        trackId,
                        isCompleted: false,
                        lastPosition: 0,
                        lastPlayedAt: 0
                    };
                    return {
                        tracks: {
                            ...state.tracks,
                            [trackId]: { ...current, isCompleted: true, lastPlayedAt: Date.now() }
                        }
                    };
                });
            },

            getTrackProgress: (trackId) => get().tracks[trackId],

            // Unit Progress
            toggleUnitComplete: (unitId) => {
                set((state) => {
                    const exists = state.completedUnits.includes(unitId);
                    if (exists) {
                        return { ...state, completedUnits: state.completedUnits.filter((id) => id !== unitId) };
                    } else {
                        return { ...state, completedUnits: [...state.completedUnits, unitId] };
                    }
                });
            },
            isUnitComplete: (unitId) => get().completedUnits.includes(unitId),
        }),
        {
            name: 'ccac_sparks_progress_v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

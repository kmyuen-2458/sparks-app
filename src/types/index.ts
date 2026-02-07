export interface Track {
    id: string; // derived from drive_file_id
    order: number;
    title: string;
    driveFileId: string;
    driveUrl: string;
    localUrl: string; // New local path
    streamUrl?: string;
    streamUrlAlt?: string;
    sectionId: string; // Keeping for compatibility, maps to Unit ID
}

export interface Unit {
    id: string; // e.g. '1', '2'
    title: string;
    order: number;
    rankId: string; // Keeping for ref, though technically child of Stage
    tracks: Track[];
}

export interface Stage {
    id: string; // e.g. 'badge', 'red-jewel-1'
    title: string;
    order: number;
    units: Unit[];
}

export interface Rank {
    id: string;
    title: string; // HangGlider, WingRunner, SkyStormer
    order: number;
    stages: Stage[]; // Renamed from units
}

export interface AudioData {
    ranks: Rank[];
    rawCount: number;
}

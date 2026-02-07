import Papa from 'papaparse';
import { Rank, Stage, Unit, Track, AudioData } from '@/types';

// Sheet 1: Structure (Hierarchy)
const WING_RUNNER_STRUCTURE_ID = '1siBKZaKQYr4DBXvvR7lzN1hsUC1UFMWiNVjPSfavasc';
const SKY_STORMER_STRUCTURE_ID = '1htICnuNXXy_KrVXYU-q2qHKGtZ0fuHZ8VizBrJaiJb4';
const HANG_GLIDER_STRUCTURE_ID = '194yAShJebCjGJiVO6ODUrOpZuXbZ_UQjlhE1wI83qZ0';

// Sheet 2: Data (Audio Files)
const WING_RUNNER_DATA_ID = '1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4';
const SKY_STORMER_DATA_ID = '11TY3G_8L0fjXzfHnMGFkEyp6ivm1hUOY-YT5uw58HOM';
const HANG_GLIDER_DATA_ID = '13wzeAuYUxw24V-LcRMcEydSS0qrJL9tZxrSRfwrjLoU';

export async function fetchAudioData(): Promise<AudioData> {
    try {
        const [wrStruct, wrData, ssStruct, ssData, hgStruct, hgData] = await Promise.all([
            fetchCsv(WING_RUNNER_STRUCTURE_ID),
            fetchCsv(WING_RUNNER_DATA_ID, 'audio_stream'),
            fetchCsv(SKY_STORMER_STRUCTURE_ID),
            fetchCsv(SKY_STORMER_DATA_ID, 'Sheet1'),
            fetchCsv(HANG_GLIDER_STRUCTURE_ID),
            fetchCsv(HANG_GLIDER_DATA_ID) // Default Sheet1 usually
        ]);

        return parseAndMerge(wrStruct, wrData, ssStruct, ssData, hgStruct, hgData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return { ranks: [], rawCount: 0 };
    }
}

async function fetchCsv(sheetId: string, tabName?: string) {
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    if (tabName) url += `&sheet=${tabName}`;
    const res = await fetch(url, { cache: 'no-store' }); // Ensure fresh data
    return res.text();
}

function parseAndMerge(
    wrStruct: string, wrData: string,
    ssStruct: string, ssData: string,
    hgStruct: string, hgData: string
): AudioData {
    // 1. Parse Data Sheets (Track ID -> Metadata)
    const trackMap = new Map<string, { title: string; driveUrl?: string; localUrl: string }>();

    // Helper to parse data sheet
    const parseDataSheet = (csv: string, prefix: string) => {
        Papa.parse(csv, {
            header: true,
            transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
            skipEmptyLines: true,
            complete: (results: any) => {
                results.data.forEach((row: any) => {
                    // Expected: track, file_name, file_link
                    if (row.track) {
                        const trackId = row.track.toString().trim();
                        // Create unique key: prefix-trackId
                        const key = `${prefix}-${trackId}`;

                        trackMap.set(key, {
                            title: row.file_name || `Track ${trackId}`,
                            localUrl: `/tracks/${prefix}/${trackId}.mp3`
                        });
                    }
                });
            }
        });
    };

    parseDataSheet(wrData, 'wingrunner');
    parseDataSheet(ssData, 'skystormer');
    parseDataSheet(hgData, 'hangglider');

    // 2. Parse Structure Sheets
    const ranksMap = new Map<string, Rank>();

    // Initialize standard ranks
    ['HangGlider', 'WingRunner', 'SkyStormer'].forEach((id, i) => {
        ranksMap.set(id.toLowerCase(), {
            id: id.toLowerCase(),
            title: id,
            order: i,
            stages: []
        });
    });

    // Helper to parse structure
    const parseStructure = (csv: string, targetRankId: string) => {
        Papa.parse(csv, {
            header: false,
            skipEmptyLines: true,
            complete: (results: any) => {
                let currentStage: Stage | null = null;
                const rank = ranksMap.get(targetRankId)!;

                results.data.forEach((row: any[], index: number) => {
                    if (index < 1) return; // Skip Header

                    // Clean data
                    // Col 3 = Stage (Index 3), Col 4 = Unit (Index 4), Col 5 = Title (Index 5), Col 6+ = Tracks
                    const colStage = row[3]?.toString().trim();
                    const colUnit = row[4]?.toString().trim();
                    const colTitle = row[5]?.toString().trim();

                    if (!colUnit || !colTitle) return; // Not a valid unit row

                    // Handle Stage
                    let stageTitle = colStage;
                    if (!stageTitle && currentStage) {
                        stageTitle = currentStage.title; // Continue previous
                    }

                    if (stageTitle) {
                        const stageId = stageTitle.toLowerCase().replace(/\s+/g, '-');

                        let stage = rank.stages.find(s => s.id === stageId);
                        if (!stage) {
                            stage = {
                                id: stageId,
                                title: stageTitle,
                                order: rank.stages.length,
                                units: []
                            };
                            rank.stages.push(stage);
                        }
                        currentStage = stage;
                    }

                    if (!currentStage) return;

                    // Create Unit
                    const unitId = colUnit.toLowerCase().replace(/\s+/g, '-');
                    const unitTitle = colUnit;

                    // Collect Tracks
                    const trackIds = row.slice(6)
                        .map(c => c.toString().trim())
                        .filter(c => c && c.match(/^\d+$/)); // Only numbers

                    const unitTracks: Track[] = trackIds.map((tid) => {
                        // Look up with prefix
                        const key = `${targetRankId}-${tid}`;
                        const meta = trackMap.get(key);

                        return {
                            id: tid,
                            title: meta?.title || `Track ${tid}`,
                            driveFileId: tid,
                            driveUrl: '',
                            // Use folder-based path: /tracks/[rank]/[id].mp3
                            localUrl: meta ? meta.localUrl : `/tracks/${targetRankId}/${tid}.mp3`,
                            order: parseInt(tid),
                            sectionId: unitId
                        };
                    });

                    currentStage.units.push({
                        id: unitId,
                        title: `Unit ${unitTitle}: ${colTitle}`,
                        order: parseInt(colUnit) || 0,
                        rankId: rank.id,
                        tracks: unitTracks
                    });
                });
            }
        });
    };

    parseStructure(hgStruct, 'hangglider'); // HangGlider is typically first, but order in map is preserved
    parseStructure(wrStruct, 'wingrunner');
    parseStructure(ssStruct, 'skystormer');

    return {
        ranks: Array.from(ranksMap.values()),
        rawCount: trackMap.size
    };
}

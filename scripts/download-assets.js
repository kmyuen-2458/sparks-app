const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const DATA_SHEET_ID = '1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4';
const OUTPUT_DIR = path.join(__dirname, '../public/tracks');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractDriveId(url = '') {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

const downloadFile = async (url, outputPath) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Unexpected response ${res.statusText}`);

        // Handle redirects if fetch doesn't automatically (native fetch usually does)
        // But for Drive export=download, sometimes 303s happen.
        // We'll trust fetch generally follows redirects.

        const fileStream = fs.createWriteStream(outputPath);
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
        return true;
    } catch (error) {
        console.error(`Error downloading to ${outputPath}:`, error.message);
        return false;
    }
};

async function main() {
    console.log("Fetching Data Sheet...");
    const dataUrl = `https://docs.google.com/spreadsheets/d/${DATA_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=audio_stream`;
    const res = await fetch(dataUrl);
    const text = await res.text();

    // Parse manually to avoid dependency
    const rows = text.split('\n');
    let count = 0;

    // Skip header
    for (let i = 1; i < rows.length; i++) {
        // Simple CSV parse (handling quotes roughly)
        // Expected format: "TrackId","Filename","Link"
        const row = rows[i];
        if (!row || row.trim() === '') continue;

        // Extract Track ID (first quoted column)
        const trackMatch = row.match(/^"([^"]+)"/);
        const linkMatch = row.match(/https:\/\/[^"]+/);

        if (trackMatch && linkMatch) {
            const trackId = trackMatch[1];
            const link = linkMatch[0];
            const driveId = extractDriveId(link);

            if (driveId) {
                const filename = `${trackId}.mp3`;
                const filePath = path.join(OUTPUT_DIR, filename);

                // Skip if exists (optional, but good for retries)
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    if (stats.size > 1000) { // arbitrary small size check
                        console.log(`[${i}/${rows.length}] Skipping ${filename}, already exists.`);
                        continue;
                    }
                }

                console.log(`[${i}/${rows.length}] Downloading Track ${trackId} (${driveId})...`);
                const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
                const success = await downloadFile(downloadUrl, filePath);
                if (success) count++;
            }
        }
    }

    console.log(`\nDownload Complete! Saved ${count} files to ${OUTPUT_DIR}`);
}

main();

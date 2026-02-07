const SHEET_ID = '1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4';
const TAB_NAME = 'audio_stream';
const fs = require('fs');

function extractDriveId(url = '') {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

async function checkSize() {
    console.log("Fetching Sheet...");
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${TAB_NAME}`;
    const res = await fetch(url);
    const text = await res.text();

    // Simple parse manually to avoid huge dependency if not needed, or just use regex for IDs
    const ids = [];
    const regex = /\/d\/([a-zA-Z0-9_-]+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (!ids.includes(match[1])) ids.push(match[1]);
    }

    console.log(`Found ${ids.length} unique file IDs.`);

    // Check first 5 sizes
    let totalSize = 0;
    const sampleCount = 5;

    console.log(`Checking size of first ${sampleCount}...`);

    for (let i = 0; i < Math.min(ids.length, sampleCount); i++) {
        const id = ids[i];
        const dUrl = `https://drive.google.com/uc?export=download&id=${id}`;
        try {
            const head = await fetch(dUrl, { method: 'HEAD', redirect: 'follow' });
            const len = head.headers.get('content-length');
            if (len) {
                const mb = parseInt(len) / 1024 / 1024;
                console.log(`File ${id}: ${mb.toFixed(2)} MB`);
                totalSize += mb;
            } else {
                console.log(`File ${id}: Unknown size (chunked?)`);
                // Estimate 2MB
                totalSize += 2;
            }
        } catch (e) {
            console.log(`Error checking ${id}`);
        }
    }

    const avg = totalSize / sampleCount;
    const estimatedTotal = avg * ids.length;
    console.log(`\nAverage Size: ${avg.toFixed(2)} MB`);
    console.log(`Estimated Total for ${ids.length} files: ${estimatedTotal.toFixed(2)} MB`);
}

checkSize();

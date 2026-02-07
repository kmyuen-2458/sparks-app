const Papa = require('papaparse');
const SHEET_ID = '1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4';
const TAB_NAME = 'audio_stream';

function extractDriveId(url = '') {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

async function check() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${TAB_NAME}`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    const text = await res.text();

    Papa.parse(text, {
        header: true,
        transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
        complete: (results) => {
            console.log(`Total Rows: ${results.data.length}`);
            let valid = 0;
            let invalid = 0;
            results.data.forEach((row, i) => {
                if (!row.file_link && !row.drive_file_id) return;
                const id = row.drive_file_id || extractDriveId(row.file_link);
                if (id) {
                    valid++;
                } else {
                    invalid++;
                    console.log(`Row ${i + 1} Invalid:`, row);
                }
            });
            // Check first valid file content
            const firstValid = results.data.find(r => rowHasId(r));
            if (firstValid) {
                const id = extractDriveId(firstValid.drive_file_id || firstValid.file_link);
                const url = `https://drive.google.com/uc?export=media&id=${id}`;
                console.log("Testing URL:", url);

                fetch(url).then(async (res) => {
                    console.log("Status:", res.status);
                    console.log("Content-Type:", res.headers.get('content-type'));
                    const buffer = await res.arrayBuffer();
                    const arr = new Uint8Array(buffer).slice(0, 50);
                    console.log("First 50 bytes:", Buffer.from(arr).toString('hex'));
                    console.log("As Text:", Buffer.from(arr).toString('utf-8'));
                });
            }

            console.log(`Valid: ${valid}, Invalid: ${invalid}`);
        }
    });
}

function rowHasId(row) {
    return (row.file_link || row.drive_file_id) && extractDriveId(row.file_link || row.drive_file_id);
}

check();

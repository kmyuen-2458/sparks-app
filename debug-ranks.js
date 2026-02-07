const Papa = require('papaparse');
const { fetch } = require('undici');

// Sheet 1: Structure (Hierarchy)
const WING_RUNNER_STRUCTURE_ID = '1siBKZaKQYr4DBXvvR7lzN1hsUC1UFMWiNVjPSfavasc';
const SKY_STORMER_STRUCTURE_ID = '1htICnuNXXy_KrVXYU-q2qHKGtZ0fuHZ8VizBrJaiJb4';
const HANG_GLIDER_STRUCTURE_ID = '194yAShJebCjGJiVO6ODUrOpZuXbZ_UQjlhE1wI83qZ0';

// Sheet 2: Data (Audio Files)
const WING_RUNNER_DATA_ID = '1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4';
const SKY_STORMER_DATA_ID = '11TY3G_8L0fjXzfHnMGFkEyp6ivm1hUOY-YT5uw58HOM';
const HANG_GLIDER_DATA_ID = '13wzeAuYUxw24V-LcRMcEydSS0qrJL9tZxrSRfwrjLoU';

async function fetchCsv(sheetId, tabName) {
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    if (tabName) url += `&sheet=${tabName}`;
    const res = await fetch(url);
    return res.text();
}

async function debug() {
    console.log('Fetching data...');
    try {
        const [wrStruct, wrData, ssStruct, ssData, hgStruct, hgData] = await Promise.all([
            fetchCsv(WING_RUNNER_STRUCTURE_ID),
            fetchCsv(WING_RUNNER_DATA_ID, 'audio_stream'),
            fetchCsv(SKY_STORMER_STRUCTURE_ID),
            fetchCsv(SKY_STORMER_DATA_ID, 'Sheet1'),
            fetchCsv(HANG_GLIDER_STRUCTURE_ID),
            fetchCsv(HANG_GLIDER_DATA_ID)
        ]);

        console.log('Data fetched. Parsing structures...');

        // Mock rank map
        const ranks = [];
        ['HangGlider', 'WingRunner', 'SkyStormer'].forEach((id, i) => {
            ranks.push({ id: id.toLowerCase(), title: id });
        });

        console.log('Expected Ranks:');
        ranks.forEach(r => console.log(`- ${r.title} (ID: ${r.id})`));

        // Check HangGlider Structure first few lines
        console.log('\nHangGlider Structure CSV Head:');
        console.log(hgStruct.substring(0, 500));

    } catch (e) {
        console.error(e);
    }
}

debug();

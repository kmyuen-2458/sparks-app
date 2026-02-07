const Papa = require('papaparse');
const HG_STRUCTURE_ID = '194yAShJebCjGJiVO6ODUrOpZuXbZ_UQjlhE1wI83qZ0';
const HG_DATA_ID = '13wzeAuYUxw24V-LcRMcEydSS0qrJL9tZxrSRfwrjLoU';

async function fetchSheet(id, name) {
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
    console.log(`Fetching ${name}...`);
    try {
        const res = await fetch(url);
        const text = await res.text();
        Papa.parse(text, {
            header: false,
            complete: (results) => {
                console.log(`--- ${name} ---`);
                console.log(JSON.stringify(results.data.slice(0, 5), null, 2));
            }
        });
    } catch (e) {
        console.error(e);
    }
}

fetchSheet(HG_STRUCTURE_ID, 'Structure');
fetchSheet(HG_DATA_ID, 'Data');

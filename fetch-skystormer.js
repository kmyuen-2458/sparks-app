const Papa = require('papaparse');
const STRUCTURE_SHEET_ID_SKY = '1htICnuNXXy_KrVXYU-q2qHKGtZ0fuHZ8VizBrJaiJb4';

async function fetchStructure() {
    const url = `https://docs.google.com/spreadsheets/d/${STRUCTURE_SHEET_ID_SKY}/gviz/tq?tqx=out:csv`;
    console.log(`Fetching SkyStormer Structure...`);
    try {
        const res = await fetch(url);
        const text = await res.text();
        Papa.parse(text, {
            header: false,
            complete: (results) => {
                console.log(`--- SkyStormer Structure ---`);
                console.log(JSON.stringify(results.data.slice(0, 10), null, 2));
            }
        });
    } catch (e) {
        console.error(e);
    }
}

fetchStructure(); 

const Papa = require('papaparse');

const STRUCTURE_SHEET_ID = '1siBKZaKQYr4DBXvvR7lzN1hsUC1UFMWiNVjPSfavasc';

async function fetchCsv(sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const res = await fetch(url);
    return res.text();
}

async function analyze() {
    const csv = await fetchCsv(STRUCTURE_SHEET_ID);

    let totalUnits = 0;
    let stages = [];

    Papa.parse(csv, {
        header: false,
        complete: (results) => {
            let currentStage = null;

            results.data.forEach((row, i) => {
                if (i < 1) return; // Skip header
                // Col 3=Stage, 4=Unit
                const colStage = row[3]?.trim();
                const colUnit = row[4]?.trim();

                if (colStage) {
                    currentStage = colStage;
                    stages.push({ name: currentStage, count: 0 });
                }

                if (colUnit && currentStage) {
                    totalUnits++;
                    stages[stages.length - 1].count++;
                }
            });

            console.log("Total WingRunner Units:", totalUnits);
            console.log("Stages:", JSON.stringify(stages, null, 2));
        }
    });
}

analyze();

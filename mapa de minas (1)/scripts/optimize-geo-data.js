
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as turf from '@turf/turf';

// Import data directly from the source files
import { microregions } from '../src/data/microregions.js';
import { macroregions } from '../src/data/macroregions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_GEOJSON = path.join(__dirname, '../public/data/geojs-31-mun.json');
const OUTPUT_FILE_MICRO = path.join(__dirname, '../public/data/minas-microregions-optimized.json');
const OUTPUT_FILE_MACRO = path.join(__dirname, '../public/data/minas-macroregions-optimized.json');

async function optimizeData() {
    console.log('🚀 Starting Data Optimization...');

    // 1. Load Raw GeoJSON
    console.log(`Reading ${INPUT_GEOJSON}...`);
    const rawData = JSON.parse(fs.readFileSync(INPUT_GEOJSON, 'utf-8'));
    console.log(`Loaded ${rawData.features.length} municipality features.`);

    // 2. Prepare Maps
    const municipalMap = new Map();
    const activeMacroList = Object.keys(macroregions).sort();
    const microToMacro = new Map();

    // Map Micro -> Macro
    activeMacroList.forEach(macro => {
        const micros = macroregions[macro];
        micros.forEach(micro => microToMacro.set(micro, macro));
    });

    // Corrections Map
    const geoJsonCorrections = {
        'brasopolis': 'brazopolis',
        'dona eusebia': 'dona euzebia',
        'sao tome das letras': 'sao thome das letras'
    };

    // Map Municipality -> Data
    Object.keys(microregions).forEach(micro => {
        const municipalities = microregions[micro];
        const macro = microToMacro.get(micro) || "Desconhecida";
        municipalities.forEach(muni => {
            const normalizedMuni = muni.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const data = { micro, macro, muniName: muni };
            municipalMap.set(normalizedMuni, data);

            Object.entries(geoJsonCorrections).forEach(([wrong, correct]) => {
                if (normalizedMuni === correct) {
                    municipalMap.set(wrong, data);
                }
            });
        });
    });

    // 3. Process Features & Group by Micro
    const featuresByMicro = {};

    rawData.features.forEach(feature => {
        const name = feature.properties.name || feature.properties.NOME_MUN;
        const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const mData = municipalMap.get(normalizedName);

        if (mData) {
            const microName = mData.micro;
            if (!featuresByMicro[microName]) featuresByMicro[microName] = [];
            featuresByMicro[microName].push(feature);
        }
    });

    // 4. Merge Microregions & Calculate Metadata
    const finalMicroFeatures = [];
    const featuresByMacro = {}; // To build macro regions

    console.log('Merging Microregions...');

    for (const [microName, feats] of Object.entries(featuresByMicro)) {
        if (feats.length === 0) continue;

        const macroName = microToMacro.get(microName) || "Desconhecida";
        let microFeature = null;

        try {
            if (feats.length === 1) {
                microFeature = feats[0];
            } else {
                const fc = turf.featureCollection(feats);
                const merged = turf.union(fc);
                if (merged) microFeature = merged;
            }

            if (microFeature) {
                // Pre-calculate Metadata for Labels
                const center = turf.centerOfMass(microFeature); // Use centerOfMass for better label placement
                const area = turf.area(microFeature);

                microFeature.properties = {
                    microName,
                    macroName,
                    center: center.geometry.coordinates, // [lng, lat]
                    area: area
                };

                finalMicroFeatures.push(microFeature);

                // Add to macro grouping
                if (!featuresByMacro[macroName]) featuresByMacro[macroName] = [];
                featuresByMacro[macroName].push(microFeature); // Use the MERGED micro for macro union? Or original raw? 
                // Better use merged micro to be faster? Or better usage might be raw.
                // Actually turf.union(fc) where fc contains complex polygons is fine. Use merged is better.
            }
        } catch (error) {
            console.error(`Error merging ${microName}:`, error.message);
        }
    }

    // 5. Generate Macro Regions
    const finalMacroFeatures = [];
    console.log('Generating Macroregions...');

    for (const [macroName, feats] of Object.entries(featuresByMacro)) {
        try {
            const fc = turf.featureCollection(feats);
            const merged = turf.union(fc);
            if (merged) {
                const center = turf.centerOfMass(merged);
                merged.properties = {
                    macroName,
                    center: center.geometry.coordinates // [lng, lat]
                };
                finalMacroFeatures.push(merged);
            }
        } catch (e) {
            console.error(`Error merging Macro ${macroName}:`, e.message);
        }
    }

    // 6. Write Output
    const microCollection = turf.featureCollection(finalMicroFeatures);
    const macroCollection = turf.featureCollection(finalMacroFeatures);

    fs.writeFileSync(OUTPUT_FILE_MICRO, JSON.stringify(microCollection));
    fs.writeFileSync(OUTPUT_FILE_MACRO, JSON.stringify(macroCollection));

    console.log(`✅ Optimization Complete!`);
    console.log(`Micro features: ${finalMicroFeatures.length}`);
    console.log(`Macro features: ${finalMacroFeatures.length}`);
    console.log(`Saved Micros to: ${OUTPUT_FILE_MICRO}`);
    console.log(`Saved Macros to: ${OUTPUT_FILE_MACRO}`);
}

optimizeData().catch(err => console.error(err));

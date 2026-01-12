
import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';

// Helper to "parse" the TS files without a TS compiler (since they are simple objects)
function parseTsObject(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove "export const name =" and trailing semicolon/newlines
    const objectStr = content
        .replace(/export const \w+ =/, '')
        .replace(/;\s*$/, '')
        .trim();

    // Use Function constructor to evaluate the object literal safely-ish
    // This handles unquoted keys and trailing commas which JSON.parse doesn't
    return new Function(`return ${objectStr}`)();
}

console.log('Starting map layer generation...');

// 1. Load Data
const projectRoot = process.cwd();
const macroregions = parseTsObject(path.join(projectRoot, 'src/data/mapamg/macroregions.ts'));
const microregions = parseTsObject(path.join(projectRoot, 'src/data/mapamg/microregions.ts'));
const geoJsonPath = path.join(projectRoot, 'public/data/geojs-31-mun.json');

console.log('Loading municipalities GeoJSON...');
const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));

// 2. Build Lookup Maps
console.log('Building lookup maps...');
const muniMap = new Map();

// Helper to normalize names for matching
const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Corrections map from original code
const geoJsonCorrections = {
    'brasopolis': 'brazopolis',
    'dona eusebia': 'dona euzebia',
    'sao tome das letras': 'sao thome das letras'
};

// Build Micro -> Macro map
const microToMacro = new Map();
Object.entries(macroregions).forEach(([macro, micros]) => {
    micros.forEach(micro => microToMacro.set(micro, macro));
});

// Build Muni -> Micro/Macro map
Object.entries(microregions).forEach(([micro, munis]) => {
    const macro = microToMacro.get(micro) || "Desconhecida";
    munis.forEach(muni => {
        const normalized = normalize(muni);
        muniMap.set(normalized, { micro, macro, name: muni });

        // Add corrections logic
        Object.entries(geoJsonCorrections).forEach(([wrong, correct]) => {
            if (normalized === correct) {
                muniMap.set(wrong, { micro, macro, name: muni });
            }
        });
    });
});

// 3. Process Municipalities and Group by Macro/Micro
console.log('Processing municipalities...');
const featuresByMacro = {};
const featuresByMicro = {};
const enrichedMunis = [];

geoJson.features.forEach(feature => {
    const name = feature.properties.name || feature.properties.NOME_MUN;
    const normalizedName = normalize(name);
    const info = muniMap.get(normalizedName);

    // Enrich properties
    feature.properties.muniDisplayName = name;
    feature.properties.microName = info ? info.micro : "Desconhecida";
    feature.properties.macroName = info ? info.macro : "Desconhecida";

    enrichedMunis.push(feature);

    if (info) {
        // Group for Macro
        if (!featuresByMacro[info.macro]) featuresByMacro[info.macro] = [];
        featuresByMacro[info.macro].push(feature);

        // Group for Micro
        if (!featuresByMicro[info.micro]) featuresByMicro[info.micro] = [];
        featuresByMicro[info.micro].push(feature);
    }
});

// 4. Generate Merged Macro Regions
console.log('Generating Macro Regions...');
const macroFeatures = [];
const macroCenters = {};

Object.entries(featuresByMacro).forEach(([macroName, features]) => {
    console.log(`  Merging ${macroName} (${features.length} municipalities)...`);
    try {
        if (features.length > 0) {
            const fc = turf.featureCollection(features);
            // Union handles merging polygons
            const merged = features.length > 1 ? turf.union(fc) : features[0];

            if (merged) {
                merged.properties = { macroName };
                // Simplify for performance (optional, keeping high quality for now but could reduce precision)
                // const simplified = turf.simplify(merged, { tolerance: 0.0001, highQuality: true });
                macroFeatures.push(merged);

                // Calculate Center
                const center = turf.centerOfMass(merged);
                macroCenters[macroName] = center.geometry.coordinates.reverse(); // Lat, Lng
            }
        }
    } catch (e) {
        console.warn(`  Error merging macro ${macroName}:`, e.message);
    }
});

// 5. Generate Merged Micro Regions
console.log('Generating Micro Regions...');
const microFeatures = [];
const microCenters = {};

Object.entries(featuresByMicro).forEach(([microName, features]) => {
    try {
        if (features.length > 0) {
            const fc = turf.featureCollection(features);
            const merged = features.length > 1 ? turf.union(fc) : features[0];

            if (merged) {
                merged.properties = { microName, macroName: features[0].properties.macroName };
                microFeatures.push(merged);

                const center = turf.centerOfMass(merged);
                const area = turf.area(merged);
                microCenters[microName] = {
                    lat: center.geometry.coordinates[1],
                    lng: center.geometry.coordinates[0],
                    area
                };
            }
        }
    } catch (e) {
        console.warn(`  Error merging micro ${microName}:`, e.message);
    }
});

// 6. Write Files
console.log('Writing files...');
const outputDir = path.join(projectRoot, 'public/data/generated');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'minas-macro-regions.json'), JSON.stringify({ type: "FeatureCollection", features: macroFeatures }));
fs.writeFileSync(path.join(outputDir, 'minas-micro-regions.json'), JSON.stringify({ type: "FeatureCollection", features: microFeatures }));
fs.writeFileSync(path.join(outputDir, 'minas-munis-enriched.json'), JSON.stringify({ type: "FeatureCollection", features: enrichedMunis }));

// Write centers as a small JSON for quick lookup
fs.writeFileSync(path.join(outputDir, 'minas-centers.json'), JSON.stringify({ macro: macroCenters, micro: microCenters }));

console.log('Done! Files saved to public/data/generated/');

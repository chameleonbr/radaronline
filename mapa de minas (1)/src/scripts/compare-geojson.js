// Script para comparar nomes de municípios com o GeoJSON
// Execute: node src/scripts/compare-geojson.js

import { microregions } from '../data/microregions.js';
import fs from 'fs';

const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

async function main() {
    console.log("Baixando GeoJSON...");

    const response = await fetch('https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-31-mun.json');
    const data = await response.json();

    // Extrair nomes do GeoJSON
    const geoNames = new Map();
    data.features.forEach(f => {
        const name = f.properties.name || f.properties.NOME_MUN;
        const normalized = normalize(name);
        geoNames.set(normalized, name);
    });

    console.log(`GeoJSON tem ${geoNames.size} municípios`);

    // Extrair nomes dos seus dados
    const localNames = new Map();
    Object.entries(microregions).forEach(([micro, munis]) => {
        munis.forEach(muni => {
            const normalized = normalize(muni);
            localNames.set(normalized, { original: muni, micro });
        });
    });

    console.log(`Seus dados têm ${localNames.size} municípios`);

    // Encontrar municípios no GeoJSON que NÃO estão nos seus dados
    const naoEncontradosNoLocal = [];
    geoNames.forEach((originalName, normalized) => {
        if (!localNames.has(normalized)) {
            naoEncontradosNoLocal.push(originalName);
        }
    });

    // Encontrar municípios nos seus dados que NÃO estão no GeoJSON
    const naoEncontradosNoGeo = [];
    localNames.forEach((info, normalized) => {
        if (!geoNames.has(normalized)) {
            naoEncontradosNoGeo.push({ ...info, normalized });
        }
    });

    // Relatório
    let report = `
========== COMPARAÇÃO COM GEOJSON ==========

GeoJSON: ${geoNames.size} municípios
Seus dados: ${localNames.size} municípios

MUNICÍPIOS NO GEOJSON QUE NÃO FORAM ENCONTRADOS NOS SEUS DADOS (${naoEncontradosNoLocal.length}):
${naoEncontradosNoLocal.length === 0 ? "Nenhum!" : naoEncontradosNoLocal.map(m => `  - "${m}"`).join('\n')}

MUNICÍPIOS NOS SEUS DADOS QUE NÃO FORAM ENCONTRADOS NO GEOJSON (${naoEncontradosNoGeo.length}):
${naoEncontradosNoGeo.length === 0 ? "Nenhum!" : naoEncontradosNoGeo.map(m => `  - "${m.original}" (Micro: ${m.micro})`).join('\n')}
`;

    // Se houver diferenças, tentar sugerir correções (fuzzy matching simples)
    if (naoEncontradosNoGeo.length > 0 && naoEncontradosNoLocal.length > 0) {
        report += `\n\nPOSSÍVEIS CORRESPONDÊNCIAS (nomes parecidos):\n`;

        naoEncontradosNoGeo.forEach(local => {
            // Procurar o mais parecido no GeoJSON
            let bestMatch = null;
            let bestScore = 0;

            naoEncontradosNoLocal.forEach(geo => {
                const geoNorm = normalize(geo);
                // Score simples: quantas letras em comum
                let score = 0;
                const shorter = Math.min(local.normalized.length, geoNorm.length);
                for (let i = 0; i < shorter; i++) {
                    if (local.normalized[i] === geoNorm[i]) score++;
                }
                // Penalizar diferenças de tamanho
                score = score / Math.max(local.normalized.length, geoNorm.length);

                if (score > bestScore && score > 0.5) {
                    bestScore = score;
                    bestMatch = geo;
                }
            });

            if (bestMatch) {
                report += `  "${local.original}" -> talvez seja "${bestMatch}"?\n`;
            }
        });
    }

    fs.writeFileSync('geojson-comparison.txt', report);
    console.log("\n>>> Relatório salvo em: geojson-comparison.txt");
    console.log(report);
}

main();

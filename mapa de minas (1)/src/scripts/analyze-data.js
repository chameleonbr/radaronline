// Script de Análise de Dados - Execute com: node src/scripts/analyze-data.js

import { microregions } from '../data/microregions.js';
import { macroregions } from '../data/macroregions.js';

// ========== CONTAGEM BÁSICA ==========
const macroCount = Object.keys(macroregions).length;
const microCount = Object.keys(microregions).length;

let totalMunicipios = 0;
const allMunicipios = new Set();

Object.values(microregions).forEach(munis => {
    munis.forEach(m => {
        allMunicipios.add(m);
        totalMunicipios++;
    });
});

console.log("\n========== CONTAGEM ==========");
console.log(`Macrorregiões: ${macroCount}`);
console.log(`Microrregiões: ${microCount}`);
console.log(`Municípios (total): ${totalMunicipios}`);
console.log(`Municípios (únicos): ${allMunicipios.size}`);

// ========== VERIFICAR SE TODAS AS MICROS ESTÃO EM ALGUMA MACRO ==========
console.log("\n========== MICROS SEM MACRO ==========");
const microsNasMacros = new Set();
Object.values(macroregions).forEach(micros => {
    micros.forEach(m => microsNasMacros.add(m));
});

const microsSemMacro = [];
Object.keys(microregions).forEach(micro => {
    if (!microsNasMacros.has(micro)) {
        microsSemMacro.push(micro);
    }
});

if (microsSemMacro.length === 0) {
    console.log("✓ Todas as micros estão associadas a uma macro!");
} else {
    console.log(`✗ ${microsSemMacro.length} micros SEM macro:`);
    microsSemMacro.forEach(m => console.log(`  - ${m}`));
}

// ========== VERIFICAR MICROS NAS MACROS QUE NÃO EXISTEM NO ARQUIVO DE MICROS ==========
console.log("\n========== MACROS REFERENCIANDO MICROS INEXISTENTES ==========");
const microsExistentes = new Set(Object.keys(microregions));
const microsInexistentes = [];

Object.entries(macroregions).forEach(([macro, micros]) => {
    micros.forEach(micro => {
        if (!microsExistentes.has(micro)) {
            microsInexistentes.push({ macro, micro });
        }
    });
});

if (microsInexistentes.length === 0) {
    console.log("✓ Todas as micros referenciadas nas macros existem!");
} else {
    console.log(`✗ ${microsInexistentes.length} referências quebradas:`);
    microsInexistentes.forEach(({ macro, micro }) => {
        console.log(`  [${macro}] -> "${micro}" (não existe)`);
    });
}

// ========== TOTAL DE MICROS NAS MACROS vs MICROS NO ARQUIVO ==========
console.log("\n========== RESUMO ==========");
console.log(`Micros no arquivo microregions.js: ${microCount}`);
console.log(`Micros referenciadas nas macros: ${microsNasMacros.size}`);

if (microCount !== microsNasMacros.size) {
    console.log(`\n⚠️  DIFERENÇA: ${Math.abs(microCount - microsNasMacros.size)} micros não batem!`);
}

// ========== LISTAR DIFERENÇAS ==========
console.log("\n========== MICROS EM microregions.js MAS NÃO EM macroregions.js ==========");
const microsSoNoArquivo = [];
Object.keys(microregions).forEach(micro => {
    if (!microsNasMacros.has(micro)) {
        microsSoNoArquivo.push(micro);
    }
});

if (microsSoNoArquivo.length === 0) {
    console.log("✓ Nenhuma!");
} else {
    microsSoNoArquivo.forEach(m => console.log(`  - "${m}"`));
}

console.log("\n========== MICROS EM macroregions.js MAS NÃO EM microregions.js ==========");
const microsSoNasMacros = [];
microsNasMacros.forEach(micro => {
    if (!microsExistentes.has(micro)) {
        microsSoNasMacros.push(micro);
    }
});

if (microsSoNasMacros.length === 0) {
    console.log("✓ Nenhuma!");
} else {
    microsSoNasMacros.forEach(m => console.log(`  - "${m}"`));
}

// ========== SALVAR RELATÓRIO ==========
import fs from 'node:fs';

const report = `
========== RELATÓRIO DE ANÁLISE DE DADOS ==========

CONTAGEM:
- Macrorregiões: ${macroCount}
- Microrregiões: ${microCount}
- Municípios (total): ${totalMunicipios}
- Municípios (únicos): ${allMunicipios.size}

MICROS SEM MACRO (${microsSemMacro.length}):
${microsSemMacro.length === 0 ? "Nenhuma!" : microsSemMacro.map(m => `  - "${m}"`).join('\n')}

MICROS EM macroregions.js MAS NÃO EM microregions.js (${microsSoNasMacros.length}):
${microsSoNasMacros.length === 0 ? "Nenhuma!" : microsSoNasMacros.map(m => `  - "${m}"`).join('\n')}

MICROS EM microregions.js MAS NÃO EM macroregions.js (${microsSoNoArquivo.length}):
${microsSoNoArquivo.length === 0 ? "Nenhuma!" : microsSoNoArquivo.map(m => `  - "${m}"`).join('\n')}
`;

fs.writeFileSync('analysis-report.txt', report);
console.log("\n\n>>> Relatório salvo em: analysis-report.txt");

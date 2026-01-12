/**
 * Utilitários geográficos centralizados para o mapa de Minas Gerais
 * 
 * Este arquivo resolve o problema de múltiplas definições da função normalize
 * e cria mapas de lookup bidirecionais para tradução rápida ID <-> Nome
 */

import { MACRORREGIOES, MICROREGIOES, Microrregiao } from '../data/microregioes';

/**
 * Normaliza uma string para comparação case-insensitive
 * Remove acentos, converte para minúsculas e remove espaços extras
 * 
 * @example normalize("São Paulo") => "sao paulo"
 * @example normalize("BELO HORIZONTE") => "belo horizonte"
 */
export const normalize = (str: string): string =>
    str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";

/**
 * Interface para os mapas de lookup geográficos
 */
export interface GeoLookupMaps {
    // Macro: ID -> Nome (ex: "MAC05" -> "Oeste")
    macroIdToName: Record<string, string>;
    // Macro: Nome normalizado -> ID (ex: "oeste" -> "MAC05")
    macroNameToId: Record<string, string>;
    // Macro: Nome normalizado -> Nome original (ex: "oeste" -> "Oeste")
    macroNormalizedToOriginal: Record<string, string>;

    // Micro: ID -> Nome (ex: "MR001" -> "Alfenas/Machado")
    microIdToName: Record<string, string>;
    // Micro: Nome normalizado -> ID (ex: "alfenas/machado" -> "MR001")
    microNameToId: Record<string, string>;
    // Micro: Nome normalizado -> macroId (ex: "alfenas/machado" -> "MAC16")
    microNameToMacroId: Record<string, string>;
    // Micro: Nome normalizado -> Nome da Macro (ex: "alfenas/machado" -> "Sudoeste")
    microNameToMacroName: Record<string, string>;
    // Micro: Nome normalizado -> objeto completo
    microNameToObject: Record<string, Microrregiao>;

    // Listas
    allMacroNames: string[];
    allMicroNames: string[];
}

/**
 * Cria mapas de lookup bidirecionais para tradução rápida entre IDs e Nomes
 * Deve ser chamado uma única vez no início do componente via useMemo
 */
export function createGeoLookupMaps(): GeoLookupMaps {
    const macroIdToName: Record<string, string> = {};
    const macroNameToId: Record<string, string> = {};
    const macroNormalizedToOriginal: Record<string, string> = {};

    const microIdToName: Record<string, string> = {};
    const microNameToId: Record<string, string> = {};
    const microNameToMacroId: Record<string, string> = {};
    const microNameToMacroName: Record<string, string> = {};
    const microNameToObject: Record<string, Microrregiao> = {};

    // Popular mapas de Macros
    MACRORREGIOES.forEach(macro => {
        macroIdToName[macro.id] = macro.nome;
        const normalizedName = normalize(macro.nome);
        macroNameToId[normalizedName] = macro.id;
        macroNormalizedToOriginal[normalizedName] = macro.nome;
    });

    // Popular mapas de Micros
    MICROREGIOES.forEach(micro => {
        microIdToName[micro.id] = micro.nome;
        const normalizedName = normalize(micro.nome);
        microNameToId[normalizedName] = micro.id;
        microNameToMacroId[normalizedName] = micro.macroId;
        microNameToMacroName[normalizedName] = micro.macrorregiao;
        microNameToObject[normalizedName] = micro;
    });

    return {
        macroIdToName,
        macroNameToId,
        macroNormalizedToOriginal,
        microIdToName,
        microNameToId,
        microNameToMacroId,
        microNameToMacroName,
        microNameToObject,
        allMacroNames: MACRORREGIOES.map(m => m.nome),
        allMicroNames: MICROREGIOES.map(m => m.nome),
    };
}

/**
 * Resolve um termo (ID ou Nome) para o nome da Macrorregião
 * Útil para exibição amigável
 */
export function resolveMacroNameFromTerm(term: string | null, maps: GeoLookupMaps): string | null {
    if (!term) return null;

    // Se parece um ID (MACxx), busca pelo ID
    if (term.startsWith('MAC')) {
        return maps.macroIdToName[term] || null;
    }

    // Tenta buscar pelo nome normalizado
    const normalized = normalize(term);
    return maps.macroNormalizedToOriginal[normalized] || term;
}

/**
 * Resolve um termo (ID ou Nome) para o ID da Macrorregião
 */
export function resolveMacroId(term: string | null, maps: GeoLookupMaps): string | null {
    if (!term) return null;

    // Se já é um ID, retorna ele
    if (term.startsWith('MAC')) {
        return maps.macroIdToName[term] ? term : null;
    }

    // Busca pelo nome normalizado
    return maps.macroNameToId[normalize(term)] || null;
}

/**
 * Resolve um termo (ID ou Nome) para o ID da Microrregião
 */
export function resolveMicroId(term: string | null, maps: GeoLookupMaps): string | null {
    if (!term) return null;

    // Se já é um ID, retorna ele
    if (term.startsWith('MR')) {
        return maps.microIdToName[term] ? term : null;
    }

    // Busca pelo nome normalizado
    return maps.microNameToId[normalize(term)] || null;
}

/**
 * Encontra a chave original de um nome no objeto macroregions (case-insensitive)
 * Útil para compatibilidade com arquivos que usam nomes em MAIÚSCULO
 */
export function findMacroKeyInObject(
    name: string | null,
    macroregionsObj: Record<string, string[]>
): string | null {
    if (!name) return null;
    const normalizedTarget = normalize(name);
    return Object.keys(macroregionsObj).find(k => normalize(k) === normalizedTarget) || null;
}

/**
 * Encontra a chave original de um nome no objeto microregions (case-insensitive)
 */
export function findMicroKeyInObject(
    name: string | null,
    microregionsObj: Record<string, string[]>
): string | null {
    if (!name) return null;
    const normalizedTarget = normalize(name);
    return Object.keys(microregionsObj).find(k => normalize(k) === normalizedTarget) || null;
}

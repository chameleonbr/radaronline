import { useState, useMemo } from 'react';
import {
    Filter,
    GitCompare,
    ChevronDown,
    X,
    Layers,
    MapPin,
    Building2
} from 'lucide-react';
import {
    MACRORREGIOES,
    MICROREGIOES,
    MUNICIPIOS,
    getMicroregioesByMacro,
    getMunicipiosByMicro,
    Macrorregiao,
    Microrregiao,
    Municipio
} from '../../../data/microregioes';

export type CompareLevel = 'macro' | 'municipio';

export interface DashboardFiltersState {
    // Standard filter mode
    selectedMacroId: string | null;
    selectedMicroId: string | null;
    selectedMunicipioCode: string | null;
    // Comparison mode
    isCompareMode: boolean;
    compareLevel: CompareLevel;
    entityA: string | null;
    entityB: string | null;
}

interface DashboardFiltersProps {
    filters: DashboardFiltersState;
    onChange: (filters: DashboardFiltersState) => void;
}

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
    // Cascading options
    const microOptions = useMemo(() => {
        if (!filters.selectedMacroId) return MICROREGIOES;
        const macro = MACRORREGIOES.find(m => m.id === filters.selectedMacroId);
        return macro ? getMicroregioesByMacro(macro.nome) : MICROREGIOES;
    }, [filters.selectedMacroId]);

    const municipioOptions = useMemo(() => {
        if (!filters.selectedMicroId) return [];
        return getMunicipiosByMicro(filters.selectedMicroId);
    }, [filters.selectedMicroId]);

    // Entity options for comparison
    const entityOptions = useMemo(() => {
        if (filters.compareLevel === 'macro') {
            return MACRORREGIOES.map(m => ({ id: m.id, label: m.nome }));
        } else {
            return MUNICIPIOS.map(m => ({ id: m.codigo, label: m.nome }));
        }
    }, [filters.compareLevel]);

    const handleMacroChange = (macroId: string) => {
        onChange({
            ...filters,
            selectedMacroId: macroId || null,
            selectedMicroId: null,
            selectedMunicipioCode: null,
        });
    };

    const handleMicroChange = (microId: string) => {
        onChange({
            ...filters,
            selectedMicroId: microId || null,
            selectedMunicipioCode: null,
        });
    };

    const handleMunicipioChange = (codigo: string) => {
        onChange({
            ...filters,
            selectedMunicipioCode: codigo || null,
        });
    };

    const toggleCompareMode = () => {
        onChange({
            ...filters,
            isCompareMode: !filters.isCompareMode,
            entityA: null,
            entityB: null,
        });
    };

    const handleCompareLevelChange = (level: CompareLevel) => {
        onChange({
            ...filters,
            compareLevel: level,
            entityA: null,
            entityB: null,
        });
    };

    const handleEntityAChange = (id: string) => {
        onChange({ ...filters, entityA: id || null });
    };

    const handleEntityBChange = (id: string) => {
        onChange({ ...filters, entityB: id || null });
    };

    const clearFilters = () => {
        onChange({
            selectedMacroId: null,
            selectedMicroId: null,
            selectedMunicipioCode: null,
            isCompareMode: false,
            compareLevel: 'macro',
            entityA: null,
            entityB: null,
        });
    };

    const hasActiveFilters = filters.selectedMacroId || filters.selectedMicroId || filters.selectedMunicipioCode;

    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-slate-200/60 shadow-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Filter Icon + Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                        <Filter className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">
                            {filters.isCompareMode ? 'Modo Comparação' : 'Filtros do Dashboard'}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {filters.isCompareMode
                                ? 'Compare entidades lado a lado'
                                : 'Refine os dados exibidos'}
                        </p>
                    </div>
                </div>

                {/* Center: Filters or Comparison Selectors */}
                <div className="flex-1 flex flex-wrap items-center gap-3">
                    {!filters.isCompareMode ? (
                        <>
                            {/* Macro Filter */}
                            <div className="relative min-w-[180px]">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={filters.selectedMacroId || ''}
                                    onChange={(e) => handleMacroChange(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer hover:border-teal-300 transition-colors"
                                >
                                    <option value="">Todas Macrorregiões</option>
                                    {MACRORREGIOES.map(macro => (
                                        <option key={macro.id} value={macro.id}>{macro.nome}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Micro Filter */}
                            <div className="relative min-w-[200px]">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={filters.selectedMicroId || ''}
                                    onChange={(e) => handleMicroChange(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer hover:border-teal-300 transition-colors"
                                >
                                    <option value="">Todas Microrregiões</option>
                                    {microOptions.map(micro => (
                                        <option key={micro.id} value={micro.id}>{micro.nome}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Limpar
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Comparison Level Tabs */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button
                                    onClick={() => handleCompareLevelChange('macro')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filters.compareLevel === 'macro'
                                        ? 'bg-white text-teal-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    <Layers className="w-4 h-4 inline mr-1.5" />
                                    Macro vs Macro
                                </button>
                                <button
                                    onClick={() => handleCompareLevelChange('municipio')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filters.compareLevel === 'municipio'
                                        ? 'bg-white text-teal-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    <Building2 className="w-4 h-4 inline mr-1.5" />
                                    Município vs Município
                                </button>
                            </div>

                            {/* Entity A Picker */}
                            <div className="relative min-w-[200px]">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                                    A
                                </div>
                                <select
                                    value={filters.entityA || ''}
                                    onChange={(e) => handleEntityAChange(e.target.value)}
                                    className="w-full pl-10 pr-8 py-2 text-sm border border-teal-200 rounded-lg bg-teal-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">Selecione...</option>
                                    {entityOptions.map(opt => (
                                        <option key={opt.id} value={opt.id} disabled={opt.id === filters.entityB}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" />
                            </div>

                            <span className="text-slate-400 font-bold">vs</span>

                            {/* Entity B Picker */}
                            <div className="relative min-w-[200px]">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">
                                    B
                                </div>
                                <select
                                    value={filters.entityB || ''}
                                    onChange={(e) => handleEntityBChange(e.target.value)}
                                    className="w-full pl-10 pr-8 py-2 text-sm border border-purple-200 rounded-lg bg-purple-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">Selecione...</option>
                                    {entityOptions.map(opt => (
                                        <option key={opt.id} value={opt.id} disabled={opt.id === filters.entityA}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Compare Mode Toggle */}
                <button
                    onClick={toggleCompareMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${filters.isCompareMode
                        ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <GitCompare className="w-4 h-4" />
                    {filters.isCompareMode ? 'Sair da Comparação' : 'Comparar'}
                </button>
            </div>
        </div>
    );
}

export const defaultFiltersState: DashboardFiltersState = {
    selectedMacroId: null,
    selectedMicroId: null,
    selectedMunicipioCode: null,
    isCompareMode: false,
    compareLevel: 'macro',
    entityA: null,
    entityB: null,
};

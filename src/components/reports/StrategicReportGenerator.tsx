import React, { useState } from "react";
import { Calendar, Eye, FileText, Filter, Printer, Target, X } from "lucide-react";

import { formatReportDate, formatReportPeriod, printReport } from "../../lib/reportUtils";
import { generateStrategicReportHTML } from "./strategicReport/strategicReportHtml";
import { calculateStrategicReportMetrics } from "./strategicReport/strategicReportMetrics";
import type { ReportType, StrategicReportGeneratorProps } from "./strategicReport/strategicReport.types";

export function StrategicReportGenerator({
    isOpen,
    onClose,
    actions,
    objectives,
    activities,
    team,
    microName = "Microrregião",
    userName = "Gestor",
}: StrategicReportGeneratorProps) {
    const [reportType, setReportType] = useState<ReportType>("consolidated");
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) {
        return null;
    }

    const metrics = calculateStrategicReportMetrics(actions, objectives, activities, team);

    const handleGenerate = () => {
        setIsGenerating(true);

        const reportHtml = generateStrategicReportHTML({
            actions,
            activities,
            metrics,
            microName,
            objectives,
            team,
            type: reportType,
            userName,
        });

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = reportHtml;
        printReport(tempDiv, `Relatório Estratégico - ${microName}`);

        setTimeout(() => {
            setIsGenerating(false);
        }, 500);
    };

    const reportTypes: Array<{ description: string; icon: React.ReactNode; id: ReportType; title: string }> = [
        {
            description: "Visão completa com todos os indicadores e ações",
            icon: <FileText className="w-5 h-5" />,
            id: "consolidated",
            title: "Relatório Consolidado",
        },
        {
            description: "Versão resumida para tomada de decisão rápida",
            icon: <Target className="w-5 h-5" />,
            id: "executive",
            title: "Sumário Executivo",
        },
        {
            description: "Detalhamento organizado por objetivo estratégico",
            icon: <Filter className="w-5 h-5" />,
            id: "byObjective",
            title: "Por Objetivo",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl" />

                    <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Exportar Relatório</h2>
                                <p className="text-white/70 text-sm mt-1">Gere um documento pronto para impressão</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{metrics.total}</div>
                            <div className="text-xs text-white/70">Ações</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-teal-300">{metrics.percentConcluido}%</div>
                            <div className="text-xs text-white/70">Conclusão</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{metrics.emAndamento}</div>
                            <div className="text-xs text-white/70">Em Exec.</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className={`text-2xl font-bold ${metrics.atrasados > 0 ? "text-rose-300" : ""}`}>{metrics.atrasados}</div>
                            <div className="text-xs text-white/70">Atenção</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 block flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Tipo de Relatório
                        </label>
                        <div className="space-y-2">
                            {reportTypes.map((type) => (
                                <button
                                    key={type.id}
                                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${reportType === type.id ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
                                    onClick={() => setReportType(type.id)}
                                >
                                    <div className={`p-2 rounded-lg ${reportType === type.id ? "bg-teal-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <div className={`${reportType === type.id ? "text-teal-700 dark:text-teal-300" : "text-slate-800 dark:text-slate-200"} font-semibold`}>
                                            {type.title}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {type.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">Informações do Relatório</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-slate-500 dark:text-slate-400">Unidade:</div>
                            <div className="text-slate-700 dark:text-slate-200 font-medium">{microName}</div>
                            <div className="text-slate-500 dark:text-slate-400">Período:</div>
                            <div className="text-slate-700 dark:text-slate-200 font-medium">{formatReportPeriod(new Date())}</div>
                            <div className="text-slate-500 dark:text-slate-400">Data de Geração:</div>
                            <div className="text-slate-700 dark:text-slate-200 font-medium">{formatReportDate(new Date())}</div>
                            <div className="text-slate-500 dark:text-slate-400">Objetivos:</div>
                            <div className="text-slate-700 dark:text-slate-200 font-medium">{objectives.length}</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                    <button className="flex-1 py-3 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        disabled={isGenerating}
                        onClick={handleGenerate}
                    >
                        <Printer className="w-4 h-4" />
                        {isGenerating ? "Gerando..." : "Gerar Relatório"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StrategicReportGenerator;

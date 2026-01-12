import React, { useMemo, useState, useRef, useEffect } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay, addMonths, isWeekend, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Action } from '../../../types';
import { MICROREGIOES } from '../../../data/microregioes';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface LinearCalendarProps {
    actions: Action[];
    microId?: string | null;
}

export function LinearCalendar({ actions, microId }: LinearCalendarProps) {
    const [selectedMicro, setSelectedMicro] = useState<string | null>(microId || null);
    const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal, 0.5 = small, 2 = large
    const containerRef = useRef<HTMLDivElement>(null);

    // Update internal state if prop changes
    useEffect(() => {
        if (microId !== undefined) setSelectedMicro(microId);
    }, [microId]);

    const year = 2026;
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 0, 1));

    const days = useMemo(() => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [year]);

    const months = useMemo(() => {
        const ms = [];
        let current = startDate;
        while (current <= endDate) {
            ms.push(current);
            current = addMonths(current, 1);
        }
        return ms;
    }, [startDate, endDate]);

    // Filter actions
    const filteredActions = useMemo(() => {
        let filtered = actions;
        if (selectedMicro && selectedMicro !== 'all') {
            filtered = filtered.filter(a => a.microregiaoId === selectedMicro);
        }
        return filtered.filter(a => {
            // Only show actions that fall within the year or overlap it
            const startStr = a.startDate || a.plannedEndDate || a.endDate;
            const endStr = a.plannedEndDate || a.endDate || startStr;

            if (!startStr) return false;

            const start = new Date(startStr);
            const end = new Date(endStr);

            // invalid date check
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

            return start <= endDate && end >= startDate;
        }).sort((a, b) => {
            const startA = new Date(a.startDate || a.plannedEndDate || a.endDate).getTime();
            const startB = new Date(b.startDate || b.plannedEndDate || b.endDate).getTime();
            return startA - startB;
        });
    }, [actions, selectedMicro, startDate, endDate]);

    const microName = useMemo(() => {
        if (!selectedMicro || selectedMicro === 'all') return 'Todas as Microrregiões';
        return MICROREGIOES.find(m => m.id === selectedMicro)?.nome || 'Microrregião Selecionada';
    }, [selectedMicro]);

    // Calendar Metrics
    const DAY_WIDTH = 40 * zoomLevel;
    const HEADER_HEIGHT = 80;
    const ROW_HEIGHT = 48;

    const getPosition = (date: Date) => {
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays * DAY_WIDTH;
    };

    const getWidth = (start: Date, end: Date) => {
        const s = start < startDate ? startDate : start;
        const e = end > endDate ? endDate : end;
        const diffTime = e.getTime() - s.getTime();
        const diffDays = Math.max(1, diffTime / (1000 * 60 * 60 * 24)); // At least 1 day width
        return diffDays * DAY_WIDTH;
    };

    const scrollToToday = () => {
        if (!containerRef.current) return;
        const today = new Date();
        if (today.getFullYear() === year) {
            const pos = getPosition(today);
            containerRef.current.scrollTo({ left: pos - containerRef.current.clientWidth / 2, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Create horizontal scroll wheel listener
        const el = containerRef.current;
        if (el) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    el.scrollLeft += e.deltaY;
                }
            };
            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Header Controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">Calendário Linear {year}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{microName} • {filteredActions.length} ações</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                        <button
                            onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors text-slate-500 dark:text-slate-400"
                            title="Diminuir Zoom"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button
                            onClick={() => setZoomLevel(z => Math.min(2, z + 0.25))}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors text-slate-500 dark:text-slate-400"
                            title="Aumentar Zoom"
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>

                    <button
                        onClick={scrollToToday}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Hoje
                    </button>
                </div>
            </div>

            {/* Calendar Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col">

                {/* Scrollable Container */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative bg-white dark:bg-slate-900"
                    style={{ cursor: 'grab' }}
                >
                    <div style={{ width: `${days.length * DAY_WIDTH}px`, minHeight: '100%' }} className="relative">

                        {/* 1. Header Row (Months) */}
                        <div className="sticky top-0 z-10 flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-10">
                            {months.map(month => {
                                const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
                                const width = daysInMonth * DAY_WIDTH;
                                return (
                                    <div
                                        key={month.toISOString()}
                                        className="flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 uppercase tracking-wider"
                                        style={{ width, minWidth: width }}
                                    >
                                        {format(month, 'MMMM', { locale: ptBR })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 2. Sub-Header Row (Days) */}
                        <div className="sticky top-10 z-10 flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-8 text-[10px] text-slate-400">
                            {days.map(day => {
                                const isWknd = isWeekend(day);
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 box-border ${isWknd ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''} ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold' : ''}`}
                                        style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                                    >
                                        <span>{format(day, 'dd')}</span>
                                        <span className="text-[8px] opacity-70">{format(day, 'EEEEE', { locale: ptBR })}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 3. Grid Background & Content */}
                        <div className="relative min-h-[500px]">
                            {/* Vertical Lines for days */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {days.map(day => (
                                    <div
                                        key={`bg-${day.toISOString()}`}
                                        className={`border-r border-slate-100 dark:border-slate-800 h-full ${isWeekend(day) ? 'bg-slate-50/30 dark:bg-slate-800/30' : ''} ${isSameDay(day, new Date()) ? 'bg-indigo-50/10' : ''}`}
                                        style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                                    />
                                ))}
                            </div>

                            {/* Today Marker Line */}
                            {year === new Date().getFullYear() && (
                                <div
                                    className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10 pointer-events-none"
                                    style={{ left: getPosition(new Date()) + (DAY_WIDTH / 2) }}
                                >
                                    <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm" />
                                </div>
                            )}


                            {/* Actions Rows */}
                            <div className="relative z-0 pt-4 pb-20 space-y-2">
                                {filteredActions.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400 dark:text-slate-500 sticky left-0 w-screen">
                                        Nenhuma ação encontrada para este período.
                                    </div>
                                ) : (
                                    filteredActions.map((action, index) => {
                                        const startStr = action.startDate || action.plannedEndDate || action.endDate;
                                        const endStr = action.plannedEndDate || action.endDate || startStr;

                                        const start = new Date(startStr);
                                        const end = new Date(endStr);

                                        const left = getPosition(start);
                                        const width = getWidth(start, end);

                                        return (
                                            <motion.div
                                                key={action.uid}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="relative h-10 group"
                                            >
                                                <div
                                                    className={`absolute top-0 bottom-0 rounded-lg shadow-sm border border-white/20 px-3 flex items-center whitespace-nowrap overflow-hidden transition-all hover:z-20 hover:scale-[1.01] hover:shadow-md cursor-pointer
                                                ${action.status === 'Concluído' ? 'bg-emerald-500 text-white' :
                                                            action.status === 'Em Andamento' ? 'bg-blue-500 text-white' :
                                                                action.status === 'Atrasado' ? 'bg-rose-500 text-white' : 'bg-slate-400 text-white'}
                                            `}
                                                    style={{ left, width: Math.max(width, DAY_WIDTH) }} // Ensure at least 1 day visual width
                                                    title={`${action.title} (${format(start, 'dd/MM')} - ${format(end, 'dd/MM')})`}
                                                >
                                                    <span className="font-medium text-xs truncate">{action.title}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

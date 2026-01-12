import React, { useState, useRef, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ZoomControl() {
    const { zoom, setZoom } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const levels = [
        { value: 0.75, label: '75%', tag: 'Compacto' },
        { value: 0.80, label: '80%', tag: 'TV' },
        { value: 0.90, label: '90%', tag: '' },
        { value: 1.00, label: '100%', tag: 'Padrão' },
        { value: 1.10, label: '110%', tag: '' },
        { value: 1.25, label: '125%', tag: 'Grande' },
        { value: 1.50, label: '150%', tag: 'Extra' },
    ];

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = Math.round(zoom * 100) + '%';

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 min-w-[70px]"
                title="Ajustar Zoom da Interface (Modo TV/Notebook)"
            >
                <div className="p-1 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                    <Monitor size={14} />
                </div>
                <span className="text-xs font-bold">{currentLabel}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                        Escala da Tela
                    </div>
                    {levels.map((level) => (
                        <button
                            key={level.value}
                            onClick={() => {
                                setZoom(level.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between group
                                ${Math.abs(zoom - level.value) < 0.01
                                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            <span>{level.label}</span>
                            {level.tag && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${Math.abs(zoom - level.value) < 0.01
                                    ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                                    : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500'
                                    }`}>
                                    {level.tag}
                                </span>
                            )}
                        </button>
                    ))}
                    <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 text-center italic">
                        Ajusta o tamanho para TVs e Notebooks
                    </div>
                </div>
            )}
        </div>
    );
}

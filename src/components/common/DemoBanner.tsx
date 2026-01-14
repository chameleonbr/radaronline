// =====================================
// DEMO BANNER - Modo Visualização
// =====================================
// Banner persistente que aparece quando o usuário está em modo demonstração

import { AlertTriangle, X, LogIn } from 'lucide-react';
import { useState } from 'react';

interface DemoBannerProps {
    onLoginClick?: () => void;
}

export function DemoBanner({ onLoginClick }: DemoBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
                {/* Indicator */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            Modo Visualização
                        </span>
                    </div>
                    <p className="text-sm text-white/90 hidden sm:block">
                        Você está explorando com dados fictícios. Alterações <strong>não serão salvas</strong>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {onLoginClick && (
                        <button
                            onClick={onLoginClick}
                            className="flex items-center gap-1.5 bg-white text-amber-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden sm:inline">Fazer Login Real</span>
                            <span className="inline sm:hidden">Login</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Fechar aviso"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

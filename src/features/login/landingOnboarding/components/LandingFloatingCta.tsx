import { ArrowRight, Sparkles } from "lucide-react";

import { COLORS, GRADIENT } from "../landingOnboarding.constants";

export function LandingFloatingCta({
    onClick,
    isVisible,
}: {
    onClick: () => void;
    isVisible: boolean;
}) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6" style={{ zIndex: 9999, pointerEvents: "auto" }}>
            <div
                className="max-w-4xl mx-auto p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 border-black flex flex-col md:flex-row items-center justify-between gap-4"
                style={{
                    background: "rgba(255,255,255,0.98)",
                    boxShadow: "0 -10px 40px rgba(0,0,0,0.3), 0 4px 0 rgba(0,0,0,1)",
                }}
            >
                <div className="text-center md:text-left">
                    <p className="text-lg md:text-xl font-black" style={{ color: COLORS.ink }}>
                        Pronto para começar?
                    </p>
                    <p className="text-sm md:text-base font-semibold opacity-70" style={{ color: COLORS.ink }}>
                        Aceite os termos de uso e acesse o Radar
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onClick();
                    }}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-lg cursor-pointer whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
                    style={{
                        color: "#04110C",
                        background: GRADIENT,
                        boxShadow: "6px 6px 0px rgba(0,0,0,1)",
                        border: "2px solid #000",
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 10000,
                    }}
                >
                    <Sparkles size={20} />
                    Aceitar e Continuar
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}

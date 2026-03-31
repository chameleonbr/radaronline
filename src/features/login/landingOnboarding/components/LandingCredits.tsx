import { useState } from "react";
import { Code2 } from "lucide-react";
import { COLORS } from "../landingOnboarding.constants";

export function LandingCredits() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="fixed top-4 right-4 z-50 select-none"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div
                className="rounded-2xl border-2 border-black transition-all duration-300 cursor-default"
                style={{
                    background: "rgba(255,255,255,0.96)",
                    boxShadow: "4px 4px 0px rgba(0,0,0,1)",
                    width: expanded ? "260px" : "40px",
                    height: expanded ? "auto" : "40px",
                    overflow: "hidden",
                }}
            >
                {/* Ícone — centralizado quando expandido, canto quando recolhido */}
                <div
                    className="absolute transition-all duration-300 w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                        backgroundColor: COLORS.bgDark,
                        top: expanded ? "10px" : "7px",
                        left: expanded ? "50%" : "7px",
                        transform: expanded ? "translateX(-50%)" : "none",
                    }}
                >
                    <Code2 size={14} color="#fff" />
                </div>

                {/* Expanded: conteúdo completo */}
                <div
                    className="p-4 pt-10 flex flex-col items-center text-center transition-all duration-300"
                    style={{
                        opacity: expanded ? 1 : 0,
                        pointerEvents: expanded ? "auto" : "none",
                    }}
                >
                    <p
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: COLORS.bgDark, opacity: 0.4 }}
                    >
                        Realização
                    </p>
                    <p
                        className="text-[11px] font-semibold leading-snug mt-1"
                        style={{ color: COLORS.bgDark, opacity: 0.7 }}
                    >
                        Secretaria de Estado de Saúde MG
                    </p>
                    <p
                        className="text-[11px] font-bold leading-snug mt-1"
                        style={{ color: COLORS.bgDark, opacity: 0.8 }}
                    >
                        Núcleo de Saúde Digital
                    </p>
                    <p
                        className="text-[9px] font-mono leading-snug"
                        style={{ color: COLORS.bgDark, opacity: 0.4 }}
                    >
                        SES/GAB/ATI-NSDIGI
                    </p>

                    <div
                        className="w-full mt-3 pt-3 border-t flex flex-col items-center"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        <p
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: COLORS.bgDark, opacity: 0.4 }}
                        >
                            Coordenador NSDIGI
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-1"
                            style={{ color: COLORS.bgDark }}
                        >
                            Jonathan Henrique Souza
                        </p>
                    </div>

                    <div
                        className="w-full mt-3 pt-3 border-t flex flex-col items-center"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        <p
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: COLORS.bgDark, opacity: 0.4 }}
                        >
                            Concepção &amp; Desenvolvimento
                        </p>
                        <p
                            className="text-[10px] font-black uppercase tracking-widest mt-1"
                            style={{ color: COLORS.bgDark, opacity: 0.35 }}
                        >
                            Radar - NSDIGI
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-1"
                            style={{ color: COLORS.bgDark }}
                        >
                            Clévio Clênio Ferreira
                            <br />
                            Da Silva Júnior
                        </p>
                    </div>

                    <div
                        className="w-full mt-3 pt-3 border-t flex flex-col items-center"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        <p
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: COLORS.bgDark, opacity: 0.4 }}
                        >
                            Concepção HUB
                        </p>
                        <p
                            className="text-[10px] font-black uppercase tracking-widest mt-1"
                            style={{ color: COLORS.bgDark, opacity: 0.35 }}
                        >
                            NSDIGI
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-1"
                            style={{ color: COLORS.bgDark }}
                        >
                            João Paulo Gomes Carvalho
                        </p>
                    </div>

                    <div
                        className="w-full mt-3 pt-3 border-t flex flex-col items-center"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                        <p
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: COLORS.bgDark, opacity: 0.4 }}
                        >
                            Apoio Geral NSDIGI
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-1"
                            style={{ color: COLORS.bgDark }}
                        >
                            Gabrielle Guimarães Gonçalves
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-0.5"
                            style={{ color: COLORS.bgDark }}
                        >
                            Alice Isabelle Gonçalves da Silva
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-0.5"
                            style={{ color: COLORS.bgDark }}
                        >
                            Sande Cristina Evangelista Ribeiro
                        </p>
                        <p
                            className="text-[11px] font-bold leading-snug mt-0.5"
                            style={{ color: COLORS.bgDark }}
                        >
                            Elisiane Ribeiro Sales
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

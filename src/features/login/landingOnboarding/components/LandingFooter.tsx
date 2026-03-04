import { COLORS, FOOTER_QUICK_LINKS } from "../landingOnboarding.constants";
import { SecondaryButton } from "./LandingButtons";

export function LandingFooter() {
    return (
        <footer className="relative py-24 px-6 pb-40 overflow-hidden" style={{ backgroundColor: COLORS.bgDark }}>
            <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none">
                <h1 className="text-[18vw] font-black leading-none text-white">MINAS</h1>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Radar Minas Digital
                        </h3>
                        <p className="mt-4 text-white/70 text-lg font-semibold leading-relaxed max-w-xl">
                            Uma jornada integrada que une Planejamento Local, Capacitação e BI ao Radar, transformando
                            estratégia em execução e resultados práticos.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="text-white/80 font-black uppercase tracking-wider">Links rápidos</div>
                        <div className="flex flex-wrap gap-3">
                            {FOOTER_QUICK_LINKS.map((link) => (
                                <SecondaryButton key={link.href} href={link.href}>
                                    {link.label}
                                </SecondaryButton>
                            ))}
                        </div>
                        <div className="mt-4 text-white/55 text-sm font-mono">
                            Suporte: saudedigital@saude.mg.gov.br
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-white/45 text-xs md:text-sm font-mono space-y-1">
                    <p>SES - Secretaria de Estado de Saúde</p>
                    <p>Núcleo de Saúde Digital - SES/GAB/ATI-NSDIGI</p>
                </div>
            </div>
        </footer>
    );
}

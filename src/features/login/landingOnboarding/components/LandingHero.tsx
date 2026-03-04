import { ArrowDown, Sparkles, Stethoscope, Wifi } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import { COLORS, GRADIENT } from "../landingOnboarding.constants";
import { AnimatedTitle, GradientBlob } from "./LandingDecorations";

export function LandingHero() {
    const { scrollY } = useScroll();
    const yPrimary = useTransform(scrollY, [0, 700], [0, 220]);
    const ySecondary = useTransform(scrollY, [0, 700], [0, -140]);
    const rotation = useTransform(scrollY, [0, 700], [0, 18]);

    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden py-20"
            style={{
                background:
                    "radial-gradient(1200px 800px at 50% 20%, rgba(53,211,255,0.25), transparent 60%), radial-gradient(1200px 900px at 20% 70%, rgba(24,195,160,0.18), transparent 55%), linear-gradient(180deg, #F4FFF9 0%, #ECFFF6 60%, #F7FFFB 100%)",
                color: COLORS.ink,
            }}
        >
            <GradientBlob className="-top-24 -left-24 w-[520px] h-[520px]" />
            <GradientBlob className="top-1/3 -right-24 w-[620px] h-[620px] opacity-30" />

            <motion.div
                style={{ y: ySecondary, rotate: rotation }}
                className="absolute -top-10 left-0 md:left-10 hidden md:block opacity-40"
            >
                <div
                    className="w-48 h-48 rounded-[3rem] border-2 flex items-center justify-center backdrop-blur-sm"
                    style={{
                        borderColor: "rgba(24,195,160,0.2)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(24,195,160,0.1))",
                    }}
                >
                    <Stethoscope size={96} className="text-[#18C3A0] opacity-80" />
                </div>
            </motion.div>

            <motion.div
                style={{ y: yPrimary, rotate: rotation }}
                className="absolute top-32 right-0 md:right-12 hidden md:block opacity-40"
            >
                <div
                    className="w-56 h-56 rounded-full border-[2px] border-dashed flex items-center justify-center backdrop-blur-sm"
                    style={{
                        borderColor: "rgba(30,107,255,0.25)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(30,107,255,0.05))",
                    }}
                >
                    <Wifi size={108} className="text-[#1E6BFF] opacity-70" />
                </div>
            </motion.div>

            <div className="relative z-10 max-w-6xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 inline-flex items-center gap-5 px-6 py-3 rounded-full border border-black/5 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-default"
                >
                    <img
                        src="https://aquiotremprospera.com.br/wp-content/themes/secom-lp/images/logo-mg.png"
                        alt="Governo de Minas Gerais"
                        className="h-10 md:h-12 w-auto object-contain opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all"
                    />
                    <div className="h-8 w-px bg-black/10" />
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
                            Núcleo
                        </span>
                        <span className="text-lg font-black tracking-tight leading-none" style={{ color: COLORS.ink }}>
                            NSDIGI
                        </span>
                    </div>
                </motion.div>

                <div className="uppercase leading-[0.85] font-black tracking-tighter text-5xl md:text-8xl">
                    <AnimatedTitle text="Radar Minas Digital" />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="mt-6 text-lg md:text-2xl font-semibold opacity-80 leading-snug max-w-3xl mx-auto"
                >
                    O primeiro acesso que faz o gestor entender, com clareza, por que a transformação digital é o
                    futuro do SUS e como Minas Gerais já está executando isso agora.
                </motion.p>
            </div>

            <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-10 flex flex-col items-center gap-3 z-20"
            >
                <div
                    className="px-6 py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest border-2 flex items-center gap-2 cursor-default"
                    style={{
                        background: GRADIENT,
                        color: "#04110C",
                        borderColor: "#000",
                        boxShadow: "5px 5px 0px rgba(0,0,0,1)",
                    }}
                >
                    <Sparkles size={16} />
                    Começar a jornada
                </div>
                <ArrowDown size={32} strokeWidth={3} color={COLORS.ink} className="mt-1 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-slate-800 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    Use o scroll do mouse para navegar
                </span>
            </motion.div>
        </section>
    );
}

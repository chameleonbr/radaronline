import { motion } from "framer-motion";

import { COLORS, GRADIENT_SOFT, WHY_NOW_ITEMS } from "../landingOnboarding.constants";
import { GradientBlob } from "./LandingDecorations";

export function LandingWhyNow() {
    return (
        <section className="relative py-28 md:py-36 px-6 overflow-hidden" style={{ backgroundColor: COLORS.bgDark }}>
            <GradientBlob className="-top-32 left-10 w-[560px] h-[560px] opacity-25" />
            <GradientBlob className="bottom-[-120px] right-[-120px] w-[680px] h-[680px] opacity-25" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black tracking-tight text-center text-white"
                >
                    O recado para o gestor no primeiro acesso
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-5 text-center text-lg md:text-2xl font-semibold text-white/75 max-w-4xl mx-auto"
                >
                    Isso não é moda, é capacidade de governar: planejar melhor, executar com rastreabilidade e provar
                    resultado com evidência.
                </motion.p>

                <div className="mt-14 grid lg:grid-cols-3 gap-6 md:gap-8">
                    {WHY_NOW_ITEMS.map((item, index) => {
                        const ItemIcon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06 }}
                                className="p-8 rounded-[2.2rem] border-2"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    borderColor: "rgba(255,255,255,0.14)",
                                    boxShadow: "12px 12px 0px rgba(0,0,0,1)",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                                        style={{
                                            borderColor: "rgba(255,255,255,0.16)",
                                            background: GRADIENT_SOFT,
                                        }}
                                    >
                                        <ItemIcon className="text-white" size={22} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                                </div>
                                <p className="mt-4 text-white/80 text-lg font-semibold leading-relaxed">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { COLORS, FAQ_ITEMS } from "../landingOnboarding.constants";
import type { FaqItem } from "../landingOnboarding.types";
import { PrimaryButton } from "./LandingButtons";

function AccordionItem({
    item,
    isOpen,
    onClick,
    index,
}: {
    item: FaqItem;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="mb-4"
        >
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-7 md:p-8 rounded-[2rem] border-2 border-black relative overflow-hidden"
                style={{
                    background: isOpen
                        ? "linear-gradient(90deg, rgba(24,195,160,0.20), rgba(53,211,255,0.16), rgba(30,107,255,0.14))"
                        : "rgba(255,255,255,0.92)",
                }}
            >
                <span className="text-left text-lg md:text-2xl font-black" style={{ color: COLORS.ink }}>
                    {item.q}
                </span>
                <span className="p-2 rounded-full text-white" style={{ backgroundColor: "#000" }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
            </button>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div
                    className="p-7 md:p-8 text-base md:text-lg font-semibold leading-relaxed ml-6 my-3 border-l-4"
                    style={{ borderColor: "#000", color: COLORS.ink, background: "rgba(255,255,255,0.78)" }}
                >
                    {item.a}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function LandingFaq() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section
            id="faq-section"
            className="py-28 md:py-36 px-6"
            style={{
                background:
                    "radial-gradient(900px 700px at 20% 20%, rgba(24,195,160,0.12), transparent 60%), radial-gradient(900px 650px at 80% 70%, rgba(30,107,255,0.12), transparent 60%), linear-gradient(180deg, #F7FFFB 0%, #F4FFF9 100%)",
            }}
        >
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black text-center tracking-tight"
                    style={{ color: COLORS.ink }}
                >
                    Perguntas frequentes
                </motion.h2>

                <div className="mt-14">
                    {FAQ_ITEMS.map((item, index) => (
                        <AccordionItem
                            key={item.q}
                            item={item}
                            index={index}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <PrimaryButton href="https://www.saude.mg.gov.br/saudedigital/">
                        Portal Saúde Digital MG
                    </PrimaryButton>
                </div>
            </div>
        </section>
    );
}

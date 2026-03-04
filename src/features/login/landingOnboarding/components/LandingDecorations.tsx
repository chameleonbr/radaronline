import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export function NoiseOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay"
            style={{
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E\")",
            }}
        />
    );
}

export function GradientBlob({
    className = "",
    style = {},
}: {
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <div
            className={`absolute rounded-full blur-3xl opacity-40 ${className}`}
            style={{
                background:
                    "radial-gradient(circle at 30% 30%, rgba(53,211,255,0.95), rgba(24,195,160,0.75), rgba(30,107,255,0.22), transparent 70%)",
                ...style,
            }}
        />
    );
}

export function AnimatedTitle({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) {
    const words = text.split(" ");
    const container = {
        hidden: { opacity: 0 },
        visible: (index = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.05 * index },
        }),
    };
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: { type: "spring" as const, damping: 14, stiffness: 120 },
        },
        hidden: {
            opacity: 0,
            y: 60,
            rotate: 6,
            transition: { type: "spring" as const, damping: 14, stiffness: 120 },
        },
    };

    return (
        <motion.div
            className={className}
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-3 md:mr-5 whitespace-nowrap">
                    {Array.from(word).map((letter, letterIndex) => (
                        <motion.span key={letterIndex} variants={child} className="inline-block">
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
}

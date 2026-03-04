import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { COLORS, GRADIENT } from "../landingOnboarding.constants";

interface LandingButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
}

export function PrimaryButton({ children, href, onClick }: LandingButtonProps) {
    const Comp = href ? "a" : "button";

    return (
        <motion.div whileHover={{ scale: 1.04, rotate: -0.6 }} whileTap={{ scale: 0.98 }}>
            <Comp
                href={href}
                target={href ? "_blank" : undefined}
                rel={href ? "noreferrer" : undefined}
                onClick={onClick}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-extrabold text-base md:text-lg cursor-pointer"
                style={{
                    color: "#04110C",
                    background: GRADIENT,
                    boxShadow: "10px 10px 0px rgba(0,0,0,1)",
                    border: "2px solid #000",
                }}
            >
                <Sparkles size={18} />
                {children}
                {href ? <ExternalLink size={18} /> : null}
            </Comp>
        </motion.div>
    );
}

export function SecondaryButton({ children, href, onClick }: LandingButtonProps) {
    const Comp = href ? "a" : "button";

    return (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Comp
                href={href}
                target={href ? "_blank" : undefined}
                rel={href ? "noreferrer" : undefined}
                onClick={onClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold cursor-pointer"
                style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "2px solid #000",
                    boxShadow: "8px 8px 0px rgba(0,0,0,1)",
                    color: COLORS.ink,
                }}
            >
                {children}
                {href ? <ExternalLink size={18} /> : null}
            </Comp>
        </motion.div>
    );
}

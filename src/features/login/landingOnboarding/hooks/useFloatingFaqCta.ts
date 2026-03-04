import { useEffect, useState } from "react";

export function useFloatingFaqCta() {
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const faqSection = document.getElementById("faq-section");
            setShowFloatingCTA(Boolean(faqSection && faqSection.getBoundingClientRect().top < window.innerHeight));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return showFloatingCTA;
}

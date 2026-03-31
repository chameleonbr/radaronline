import { NoiseOverlay } from "./landingOnboarding/components/LandingDecorations";
import { LandingDeliveries } from "./landingOnboarding/components/LandingDeliveries";
import { LandingFaq } from "./landingOnboarding/components/LandingFaq";
import { LandingFloatingCta } from "./landingOnboarding/components/LandingFloatingCta";
import { LandingFooter } from "./landingOnboarding/components/LandingFooter";
import { LandingGlobalStyles } from "./landingOnboarding/components/LandingGlobalStyles";
import { LandingHero } from "./landingOnboarding/components/LandingHero";
import { LandingStickyStory } from "./landingOnboarding/components/LandingStickyStory";
import { LandingWhyNow } from "./landingOnboarding/components/LandingWhyNow";
import { LandingCredits } from "./landingOnboarding/components/LandingCredits";
import { COLORS } from "./landingOnboarding/landingOnboarding.constants";
import { useFloatingFaqCta } from "./landingOnboarding/hooks/useFloatingFaqCta";

interface LandingOnboardingProps {
    onComplete: () => void;
}

export function LandingOnboarding({ onComplete }: LandingOnboardingProps) {
    const showFloatingCTA = useFloatingFaqCta();

    return (
        <div className="font-sans antialiased cursor-default" style={{ backgroundColor: COLORS.bgLight }}>
            <NoiseOverlay />
            <LandingGlobalStyles />

            <LandingHero />
            <LandingStickyStory />
            <LandingDeliveries />
            <LandingWhyNow />
            <LandingFaq />
            <LandingFooter />

            <LandingFloatingCta onClick={onComplete} isVisible={showFloatingCTA} />
            <LandingCredits />
        </div>
    );
}

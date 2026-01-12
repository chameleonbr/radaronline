import { Variants } from 'framer-motion';

/**
 * Motion Library - Reusable Framer Motion Animation Variants
 * Professional-grade animations for a polished user experience
 */

// =====================================
// EASING CURVES
// =====================================

/**
 * Custom easing functions for natural motion
 * Based on Material Design and Apple's HIG
 */
export const easings = {
    // Smooth and natural (recommended default)
    easeOutQuint: [0.22, 1, 0.36, 1],

    // Snappy and responsive
    easeOutExpo: [0.16, 1, 0.3, 1],

    // Bouncy and playful
    easeOutBack: [0.34, 1.56, 0.64, 1],

    // Standard Material Design
    standard: [0.4, 0, 0.2, 1],
} as const;

// =====================================
// BASIC REVEAL ANIMATIONS
// =====================================

/**
 * Fade in animation (simple opacity change)
 */
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: easings.easeOutQuint
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: easings.standard
        }
    }
};

/**
 * Fade in from below (opacity + y translation)
 * Great for: Cards, sections, form fields
 */
export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 24
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easings.easeOutQuint
        }
    },
    exit: {
        opacity: 0,
        y: -16,
        transition: {
            duration: 0.3,
            ease: easings.standard
        }
    }
};

/**
 * Fade in from above
 * Great for: Modals, dropdowns
 */
export const fadeInDown: Variants = {
    initial: {
        opacity: 0,
        y: -24
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easings.easeOutQuint
        }
    }
};

/**
 * Slide in from left
 * Great for: Sidebars, mobile menus
 */
export const slideInLeft: Variants = {
    initial: {
        x: -300,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: easings.easeOutExpo
        }
    },
    exit: {
        x: -300,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: easings.standard
        }
    }
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
    initial: {
        x: 300,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: easings.easeOutExpo
        }
    },
    exit: {
        x: 300,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: easings.standard
        }
    }
};

// =====================================
// SCALE ANIMATIONS
// =====================================

/**
 * Scale and fade in
 * Great for: Modals, popovers, tooltips
 */
export const scaleIn: Variants = {
    initial: {
        scale: 0.9,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: easings.easeOutQuint
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: easings.standard
        }
    }
};

/**
 * Pop effect (scale with bounce)
 * Great for: Success indicators, badges
 */
export const popIn: Variants = {
    initial: {
        scale: 0,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: easings.easeOutBack
        }
    }
};

// =====================================
// STAGGER ANIMATIONS (for lists)
// =====================================

/**
 * Container for staggered children
 * Use with staggerItem for cascading effect
 */
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

/**
 * Fast stagger (for many items)
 */
export const staggerContainerFast: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0
        }
    }
};

/**
 * Item to be used inside stagger container
 */
export const staggerItem: Variants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easings.easeOutQuint
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2
        }
    }
};

// =====================================
// HOVER/TAP INTERACTIONS
// =====================================

/**
 * Button hover/press effects
 */
export const buttonHover = {
    scale: 1.02,
    transition: { duration: 0.2 }
};

export const buttonTap = {
    scale: 0.98,
    transition: { duration: 0.1 }
};

/**
 * Card hover effect
 */
export const cardHover = {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3, ease: easings.easeOutQuint }
};

/**
 * Icon rotation on hover
 */
export const iconRotate = {
    rotate: 15,
    transition: { duration: 0.3 }
};

// =====================================
// PAGE TRANSITIONS
// =====================================

/**
 * Page fade transition
 */
export const pageTransition: Variants = {
    initial: {
        opacity: 0,
        y: 8
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easings.easeOutQuint
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
};

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation variants respecting user preferences
 * If reduced motion is preferred, returns instant transitions
 */
export function getVariants(variants: Variants): Variants {
    if (prefersReducedMotion()) {
        // Return variants with zero duration
        return Object.keys(variants).reduce((acc, key) => {
            acc[key] = {
                ...variants[key],
                transition: { duration: 0 }
            };
            return acc;
        }, {} as Variants);
    }
    return variants;
}

/**
 * Delay helper for custom transitions
 */
export function withDelay(delay: number, variants: Variants): Variants {
    return {
        ...variants,
        animate: {
            ...variants.animate,
            transition: {
                ...(variants.animate as any).transition,
                delay
            }
        }
    };
}

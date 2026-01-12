import { motion } from 'framer-motion';
import { fadeInUp, scaleIn } from './motion';

/**
 * Pre-configured Motion Components
 * Drop-in replacements for common animations
 */

/**
 * FadeIn wrapper - fade in content on mount
 * Usage: <FadeIn>content</FadeIn>
 */
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay }}
    >
        {children}
    </motion.div>
);

/**
 * SlideUp wrapper - slide up + fade in
 * Perfect for cards, sections
 */
export const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay }}
    >
        {children}
    </motion.div>
);

/**
 * ScaleIn wrapper - scale + fade in
 * Perfect for modals, popovers
 */
export const ScaleIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
    >
        {children}
    </motion.div>
);

import type { ReactNode } from 'react';

export interface OnboardingStep {
  action?: string;
  description: string;
  icon: ReactNode;
  id: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  targetSelector?: string;
  title: string;
}

export interface TooltipPosition {
  arrowPosition: 'top' | 'bottom' | 'left' | 'right' | 'none';
  left: number;
  top: number;
}

export interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

import { useCallback, useEffect, useRef, useState } from 'react';

import { logWarn } from '../../../lib/logger';
import { ONBOARDING_TOUR_STEPS } from './onboardingTour.constants';
import type { OnboardingTourProps, TooltipPosition } from './onboardingTour.types';

export function useOnboardingTour({ isOpen, onComplete, onSkip }: Pick<OnboardingTourProps, 'isOpen' | 'onComplete' | 'onSkip'>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0, arrowPosition: 'none' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = ONBOARDING_TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_TOUR_STEPS.length - 1;
  const progress = ((currentStep + 1) / ONBOARDING_TOUR_STEPS.length) * 100;

  const clearHighlights = useCallback(() => {
    document.querySelectorAll('.onboarding-highlight').forEach((element) => {
      element.classList.remove('onboarding-highlight');
    });
  }, []);

  const findTargetElement = useCallback(() => {
    if (!step.targetSelector) {
      setTargetRect(null);
      return null;
    }

    const selectors = step.targetSelector.split(',').map((selector) => selector.trim());

    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect(rect);
          return element;
        }
      } catch {
        logWarn('OnboardingTour', `Invalid selector: ${selector}`);
      }
    }

    setTargetRect(null);
    return null;
  }, [step.targetSelector]);

  const calculateTooltipPosition = useCallback(() => {
    const tooltipWidth = Math.min(350, window.innerWidth - 32);
    const tooltipHeight = tooltipRef.current?.offsetHeight || 250;
    const padding = 16;
    const arrowOffset = 16;

    if (!targetRect || step.position === 'center') {
      setTooltipPosition({
        arrowPosition: 'none',
        left: Math.max(padding, (window.innerWidth - tooltipWidth) / 2),
        top: Math.max(padding, (window.innerHeight - tooltipHeight) / 2),
      });
      return;
    }

    let top = 0;
    let left = 0;
    let arrowPosition: TooltipPosition['arrowPosition'] = 'top';
    const centerX = targetRect.left + targetRect.width / 2;
    const centerY = targetRect.top + targetRect.height / 2;

    switch (step.position) {
      case 'bottom':
        top = targetRect.bottom + padding + arrowOffset;
        left = Math.max(padding, Math.min(centerX - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding));
        arrowPosition = 'top';
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - padding - arrowOffset;
        left = Math.max(padding, Math.min(centerX - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding));
        arrowPosition = 'bottom';
        break;
      case 'left':
        top = Math.max(padding, Math.min(centerY - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding));
        left = targetRect.left - tooltipWidth - padding - arrowOffset;
        arrowPosition = 'right';
        break;
      case 'right':
        top = Math.max(padding, Math.min(centerY - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding));
        left = targetRect.right + padding + arrowOffset;
        arrowPosition = 'left';
        break;
      default:
        break;
    }

    setTooltipPosition({
      arrowPosition,
      left: Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding)),
      top: Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding)),
    });
  }, [step.position, targetRect]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    clearHighlights();
    const element = findTargetElement();

    if (element) {
      element.classList.add('onboarding-highlight');
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 100);
    }

    const timer = setTimeout(() => {
      findTargetElement();
      calculateTooltipPosition();
    }, 300);

    return () => clearTimeout(timer);
  }, [calculateTooltipPosition, clearHighlights, currentStep, findTargetElement, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      clearHighlights();
    }
  }, [clearHighlights, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => {
      findTargetElement();
      setTimeout(calculateTooltipPosition, 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [calculateTooltipPosition, findTargetElement, isOpen]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setCurrentStep((previous) => previous + 1);
  }, [isLastStep, onComplete]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((previous) => previous - 1);
    }
  }, [isFirstStep]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'Escape') {
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isOpen, onSkip]);

  return {
    currentStep,
    handleNext,
    handlePrev,
    isFirstStep,
    isLastStep,
    progress,
    setCurrentStep,
    step,
    targetRect,
    tooltipPosition,
    tooltipRef,
  };
}

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Zap } from 'lucide-react';

import { ONBOARDING_TOUR_STEPS } from './onboardingTour.constants';
import type { OnboardingStep, TooltipPosition } from './onboardingTour.types';

interface OnboardingTooltipCardProps {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSkip: () => void;
  progress: number;
  setCurrentStep: (step: number) => void;
  step: OnboardingStep;
  tooltipPosition: TooltipPosition;
  tooltipRef: React.RefObject<HTMLDivElement>;
}

export function OnboardingTooltipCard({
  currentStep,
  handleNext,
  handlePrev,
  isFirstStep,
  isLastStep,
  onSkip,
  progress,
  setCurrentStep,
  step,
  tooltipPosition,
  tooltipRef,
}: OnboardingTooltipCardProps) {
  return (
    <motion.div
      ref={tooltipRef}
      key={currentStep}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute z-10"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        width: Math.min(350, window.innerWidth - 32),
      }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        {tooltipPosition.arrowPosition !== 'none' ? (
          <div
            className="absolute w-4 h-4 bg-white dark:bg-slate-800 border-teal-400 dark:border-teal-500 rotate-45"
            style={{
              ...(tooltipPosition.arrowPosition === 'top' && {
                top: -8,
                left: '50%',
                marginLeft: -8,
                borderTop: '2px solid',
                borderLeft: '2px solid',
              }),
              ...(tooltipPosition.arrowPosition === 'bottom' && {
                bottom: -8,
                left: '50%',
                marginLeft: -8,
                borderBottom: '2px solid',
                borderRight: '2px solid',
              }),
              ...(tooltipPosition.arrowPosition === 'left' && {
                left: -8,
                top: '50%',
                marginTop: -8,
                borderBottom: '2px solid',
                borderLeft: '2px solid',
              }),
              ...(tooltipPosition.arrowPosition === 'right' && {
                right: -8,
                top: '50%',
                marginTop: -8,
                borderTop: '2px solid',
                borderRight: '2px solid',
              }),
            }}
          />
        ) : null}

        <div className="h-1.5 bg-slate-100 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 shrink-0 shadow-sm">
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{step.title}</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Passo {currentStep + 1} de {ONBOARDING_TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={onSkip}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Pular tour"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{step.description}</p>

          {step.action ? (
            <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl mb-4 border border-amber-200/50 dark:border-amber-800/30">
              <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                💡 {step.action}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-1">
              {ONBOARDING_TOUR_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'w-6 bg-teal-500' : index < currentStep ? 'w-2 bg-teal-300 dark:bg-teal-700 hover:bg-teal-400' : 'w-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300'}`}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-95"
            >
              {isLastStep ? '🚀 Começar!' : 'Próximo'}
              {!isLastStep ? <ChevronRight size={16} /> : null}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

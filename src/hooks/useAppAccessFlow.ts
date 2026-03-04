import { useCallback, useEffect, useState } from 'react';
import { log } from '../lib/logger';
import { User } from '../types/auth.types';

interface UseAppAccessFlowProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
}

export function useAppAccessFlow({
  isAuthenticated,
  isAdmin,
  user,
}: UseAppAccessFlowProps) {
  const [hasViewedLanding, setHasViewedLanding] = useState(false);
  const [showMunicipalityModal, setShowMunicipalityModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingOnboarding, setPendingOnboarding] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasViewedLanding(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      log('App', 'Verificando FirstAccess', {
        id: user.id,
        auth: isAuthenticated,
        admin: isAdmin,
        firstAccess: user.firstAccess,
        modalOpen: showMunicipalityModal,
      });
    }

    if (isAuthenticated && user && user.firstAccess) {
      log('App', 'Triggering Municipality Modal - User needs setup');
      setShowMunicipalityModal(true);
    }
  }, [isAdmin, isAuthenticated, showMunicipalityModal, user]);

  useEffect(() => {
    if (!(isAuthenticated && user && !isAdmin)) {
      return;
    }

    const onboardingKey = `radar_onboarding_completed_${user.id}`;
    const hasCompletedOnboarding = localStorage.getItem(onboardingKey);

    if (user.firstAccess) {
      if (!hasCompletedOnboarding) {
        setPendingOnboarding(true);
      }
      return;
    }

    if (!hasCompletedOnboarding || pendingOnboarding) {
      const timerId = window.setTimeout(() => {
        setShowOnboarding(true);
        setPendingOnboarding(false);
      }, 800);

      return () => window.clearTimeout(timerId);
    }
  }, [isAdmin, isAuthenticated, pendingOnboarding, user]);

  const markOnboardingComplete = useCallback(() => {
    if (user) {
      localStorage.setItem(`radar_onboarding_completed_${user.id}`, 'true');
    }
    setShowOnboarding(false);
  }, [user]);

  const handleLandingComplete = useCallback(() => {
    setHasViewedLanding(true);
  }, []);

  const openOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  return {
    handleLandingComplete,
    handleOnboardingComplete: markOnboardingComplete,
    handleOnboardingSkip: markOnboardingComplete,
    hasViewedLanding,
    openOnboarding,
    setShowMunicipalityModal,
    showMunicipalityModal,
    showOnboarding,
  };
}

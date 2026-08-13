import { useSyncExternalStore } from 'react';
import { getFeatureFlags, subscribeFeatureFlags, FeatureFlagName } from '../featureFlags';

// Reactive read of a feature flag — re-renders the component immediately if the CMS
// Config tab toggles this flag while the app is open, no reload needed.
export const useFeatureFlag = (flag: FeatureFlagName): boolean => {
  return useSyncExternalStore(subscribeFeatureFlags, () => getFeatureFlags()[flag]);
};

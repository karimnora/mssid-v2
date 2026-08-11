import { useMemo } from 'react';
import { featureFlags, FeatureFlagName } from '../featureFlags';

export const useFeatureFlag = (flag: FeatureFlagName): boolean => {
  return useMemo(() => featureFlags[flag], [flag]);
};

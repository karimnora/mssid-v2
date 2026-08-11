import { useLocaleContext } from '../context/LocaleContext';
import type { LocaleStrings } from '../locales';

export const useTranslation = <N extends keyof LocaleStrings>(namespace: N) => {
  const { t } = useLocaleContext();
  return (key: keyof LocaleStrings[N] & string, params?: Record<string, string | number>) =>
    t(namespace, key, params);
};

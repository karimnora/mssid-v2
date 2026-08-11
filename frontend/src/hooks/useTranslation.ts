import { useLocaleContext } from '../context/LocaleContext';
import type { LocaleStrings } from '../locales';

export const useTranslation = (namespace: keyof LocaleStrings) => {
  const { t } = useLocaleContext();
  return (key: keyof LocaleStrings[typeof namespace] & string, params?: Record<string, string | number>) =>
    t(namespace, key, params);
};

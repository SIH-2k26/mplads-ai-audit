import { useLanguageStore } from '../stores/useLanguageStore';
import { TranslationKeys } from './locales';

/**
 * Returns the current translation object.
 * Usage:
 *   const t = useT();
 *   <h1>{t.district.title}</h1>
 */
export function useT(): TranslationKeys {
  return useLanguageStore((state) => state.t);
}

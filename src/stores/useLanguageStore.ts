import { create } from 'zustand';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageInfo,
} from '../i18n/types';
import { translations } from '../i18n/locales';

interface LanguageState {
  language: SupportedLanguage;
  languageInfo: LanguageInfo;
  isRtl: boolean;
  t: typeof translations.en;
  setLanguage: (lang: SupportedLanguage) => void;
}

const STORAGE_KEY = 'agastya_preferred_language';

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem(
      STORAGE_KEY
    ) as SupportedLanguage;

    if (saved && translations[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }

  return 'en';
}

function applyDocumentLanguage(lang: SupportedLanguage) {
  if (typeof document === 'undefined') return;

  const langInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) ||
    SUPPORTED_LANGUAGES[0];

  document.documentElement.lang = lang;
  document.documentElement.dir = langInfo.dir;
}

export const useLanguageStore = create<LanguageState>((set) => {
  const initialLang = getInitialLanguage();

  const initialInfo =
    SUPPORTED_LANGUAGES.find(
      (l) => l.code === initialLang
    ) || SUPPORTED_LANGUAGES[0];

  applyDocumentLanguage(initialLang);

  return {
    language: initialLang,
    languageInfo: initialInfo,
    isRtl: initialInfo.dir === 'rtl',
    t: translations[initialLang] || translations.en,

    setLanguage: (lang: SupportedLanguage) => {
      const info =
        SUPPORTED_LANGUAGES.find(
          (l) => l.code === lang
        ) || SUPPORTED_LANGUAGES[0];

      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore
      }

      applyDocumentLanguage(lang);

      set({
        language: lang,
        languageInfo: info,
        isRtl: info.dir === 'rtl',
        t: translations[lang] || translations.en,
      });
    },
  };
});

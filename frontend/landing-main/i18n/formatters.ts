import { SupportedLanguage, SUPPORTED_LANGUAGES } from './types';
import { translations } from './locales';

/**
 * Format currency in Indian Rupees (INR) with localized Crores / Lakhs representation.
 */
export function formatCurrency(
  amount: number,
  lang: SupportedLanguage = 'en',
  compact: boolean = true
): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Compact Indian Notation (Cr / L)
  if (compact) {
    if (absAmount >= 10000000) {
      const cr = (absAmount / 10000000).toFixed(2);
      const crLabel = lang === 'hi' || lang === 'mr' ? 'करोड़' : lang === 'bn' ? 'কোটি' : 'Cr';
      return `${sign}₹${cr} ${crLabel}`;
    }
    if (absAmount >= 100000) {
      const l = (absAmount / 100000).toFixed(2);
      const lLabel = lang === 'hi' || lang === 'mr' ? 'लाख' : lang === 'bn' ? 'লাখ' : 'Lakh';
      return `${sign}₹${l} ${lLabel}`;
    }
  }

  // Standard Indian comma grouping: 1,00,000
  try {
    return new Intl.NumberFormat(lang === 'ur' ? 'ur-PK' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${sign}₹${absAmount.toLocaleString('en-IN')}`;
  }
}

/**
 * Format numbers with localized separators
 */
export function formatNumber(
  value: number,
  lang: SupportedLanguage = 'en'
): string {
  if (isNaN(value)) return '0';
  try {
    return new Intl.NumberFormat(lang === 'ur' ? 'ur-PK' : 'en-IN').format(value);
  } catch {
    return value.toLocaleString('en-IN');
  }
}

/**
 * Format percentage with sign
 */
export function formatPercentage(
  value: number,
  lang: SupportedLanguage = 'en',
  signed: boolean = false
): string {
  if (isNaN(value)) return '0%';
  const prefix = signed && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

/**
 * Format date string into localized format
 */
export function formatDate(
  dateStr: string | Date,
  lang: SupportedLanguage = 'en'
): string {
  if (!dateStr) return '';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return String(dateStr);

  try {
    const localeCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'bn' ? 'bn-IN' : lang === 'ur' ? 'ur-IN' : 'en-IN';
    return d.toLocaleDateString(localeCode, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d.toISOString().split('T')[0];
  }
}

/**
 * Localize structured risk codes from the AI/ML inference engine
 */
export function getLocalizedRiskReason(
  reasonCode: string,
  lang: SupportedLanguage = 'en'
): string {
  const dict = translations[lang]?.xai || translations.en.xai;

  switch (reasonCode) {
    case 'COST_DEVIATION':
    case 'COST_ABOVE_PEER':
      return dict.costDeviation;
    case 'PROGRESS_MISMATCH':
    case 'DISBURSEMENT_LEAP':
      return dict.progressMismatch;
    case 'SINGLE_BID':
    case 'TENDER_ANOMALY':
      return dict.singleBid;
    case 'DUPLICATE_SIMILARITY':
    case 'GHOST_WORK':
      return dict.duplicateOverlap;
    case 'MISSING_UC':
    case 'SLA_BREACH':
      return dict.missingUc;
    case 'CARTEL_PATTERN':
    case 'CONTRACTOR_CONCENTRATION':
      return dict.cartelPattern;
    default:
      return reasonCode;
  }
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amount in Indian Currency notation (Crores, Lakhs, Thousands, Rupees)
 */
export function formatCurrencyINR(amountInRupees: number, compact: boolean = false): string {
  if (amountInRupees >= 10000000) {
    const cr = amountInRupees / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (amountInRupees >= 100000) {
    const lk = amountInRupees / 100000;
    return `₹${lk.toFixed(2)} Lakh`;
  } else if (amountInRupees >= 1000) {
    const th = amountInRupees / 1000;
    return `₹${th.toFixed(1)}k`;
  }
  return `₹${amountInRupees.toLocaleString('en-IN')}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

export function getRiskColorClass(score: number): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  label: string;
} {
  const level = getRiskLevel(score);
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-50',
        text: 'text-[#B44343]',
        border: 'border-[#B44343]',
        badgeBg: 'bg-[#B44343]/10 text-[#B44343] border-[#B44343]/30',
        label: 'CRITICAL RISK',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-[#C98219]',
        border: 'border-[#C98219]',
        badgeBg: 'bg-[#C98219]/10 text-[#C98219] border-[#C98219]/30',
        label: 'HIGH RISK',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50',
        text: 'text-[#B7791F]',
        border: 'border-[#B7791F]',
        badgeBg: 'bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30',
        label: 'MEDIUM RISK',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-[#2F7658]',
        border: 'border-[#2F7658]',
        badgeBg: 'bg-[#2F7658]/10 text-[#2F7658] border-[#2F7658]/30',
        label: 'LOW RISK',
      };
  }
}

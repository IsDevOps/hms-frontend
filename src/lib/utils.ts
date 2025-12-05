import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export const userType = {
  INDIVIDUAL_USER: 'INDIVIDUAL_USER' as const,
  PHARMACY: 'PHARMACY' as const,
  HEALTHCARE_PROVIDER: 'HEALTHCARE_PROVIDER' as const,
  HEALTHCARE_PRACTITIONER: 'HEALTHCARE_PRACTITIONER' as const,
  HMO: 'HMO' as const,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimAndAppendEllipsis(str: string, maxLength: number = 20): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

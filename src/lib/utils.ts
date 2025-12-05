import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimAndAppendEllipsis(str: string, maxLength: number = 20): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

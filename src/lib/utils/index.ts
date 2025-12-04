import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

const userType = {
  INDIVIDUAL_USER: 'INDIVIDUAL_USER' as const,
  PHARMACY: 'PHARMACY' as const,
  HEALTHCARE_PROVIDER: 'HEALTHCARE_PROVIDER' as const,
  HEALTHCARE_PRACTITIONER: 'HEALTHCARE_PRACTITIONER' as const,
  HMO: 'HMO' as const,
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const copyToClipboard = async (text: string): Promise<void> => {
  // Create a temporary element to hold the text
  const el: HTMLTextAreaElement = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  // Append the temporary element to the DOM
  document.body.appendChild(el);

  try {
    // Use the modern Clipboard API to copy the text
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for browsers that do not support the Clipboard API
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    // Display an error toast
    toast.error('Failed to copy text: ', {
      description: JSON.stringify(error),
    });
  } finally {
    // Remove the temporary element from the DOM
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
};

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Password validation function
const isValidPassword = (password: string) => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*_-]/.test(password),
    hasNumber: /\d/.test(password),
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[!@#$%^&*_-]/.test(password) &&
      /\d/.test(password),
  };
};

const validatePassword = (value: string) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z\d]+$/;
  return passwordRegex.test(value);
};

const trimAndAppendEllipsis = (input: string): string => {
  if (input.length <= 20) {
    return input;
  }
  return `${input.slice(0, 20)}...`;
};
const formatCurrency = (amount: number, decimal?: boolean) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: decimal ? 0 : undefined,
  }).format(amount);
};

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return 'morning';
  if (currentHour < 18) return 'afternoon';
  return 'evening';
};

const addItemToArray = (arr: string[], item: string): string[] => {
  return arr.includes(item) ? arr : [...arr, item];
};

const removeItemFromArray = (arr: string[], item: string): string[] => {
  return arr.filter((el) => el !== item);
};

const updateItemInArray = (
  arr: string[],
  oldItem: string,
  newItem: string
): string[] => {
  return arr.map((el) => (el === oldItem ? newItem : el));
};

const cleanObjData = (obj: any) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const isEmptyArray = Array.isArray(value) && value.length === 0;
    const shouldKeep =
      value !== undefined && value !== null && value !== '' && !isEmptyArray;

    if (shouldKeep) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
};

const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export {
  userType,
  addItemToArray,
  cleanObjData,
  cn,
  copyToClipboard,
  formatCurrency,
  formatNumberWithCommas,
  getGreeting,
  removeItemFromArray,
  trimAndAppendEllipsis,
  updateItemInArray,
  isValidPassword,
  validatePassword,
  calculateAge,
};

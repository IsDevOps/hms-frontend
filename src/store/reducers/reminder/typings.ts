import { UploadImage } from '@/store/services/others/typings';

type Medication = {
  medicationName: string;
  drugName: string;
  medicationType: string;
  dosage: string;
  description?: string;
  medicationImage?: UploadImage;
  startDateTime: string;
  durationInDays: number;
  endDateTime: string;
  timesPerDay: number;
  note?: string;
  dailyDoseTimes: { time: string; date: string; isoDate: string }[][];
};

export type ReminderState = {
  medications: Medication[] | null;
  notificationChannels: string[] | null;
  phoneNumbers: string[] | null;
  emails: string[] | null;
  payment: {
    amount: number;
    currency: 'NGN' | 'USD';
    reference?: string;
  } | null;
};

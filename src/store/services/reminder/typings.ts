import { ResponseType, ResponseTypeWithPagination } from '../base.typing';
import { UploadImage } from '../others/typings';

type MedicationType =
  | 'PILL'
  | 'SYRUP'
  | 'INJECTION'
  | 'DRIP'
  | 'OINTMENT'
  | 'INHALER'
  | 'OTHERS';

type Medication = {
  medicationName: string;
  drugName: string;
  medicationType: string;
  description?: string;
  medicationImage?: UploadImage;
  dosage: string;
  startDateTime: string;
  durationInDays: number;
  endDateTime: string;
  timesPerDay: number;
  note?: string;
  dailyDoseTimes: { time: string; date: string; isoDate: string }[][];
};

type CreateReminderRequestType = {
  medications: Medication[];
  notificationChannels: string[];
  phoneNumbers?: string[];
  emails?: string[];
  timezone: string;
  payment?: {
    amount: number;
    currency: 'NGN' | 'USD';
  };
};

type UpdateMedicationRequestType = Omit<
  Medication,
  'medicationName' | 'drugName' | 'description' | 'medicationType'
> & {
  id: string;
  payment?: {
    amount: number;
    currency: 'NGN' | 'USD';
  };
};

type UpdateMedicationResponse = {
  message: string;
  transactionReference?: string;
  data: Reminder | null;
};

type CreateReminderResponse = {
  message: string;
  reminderGroupId: string;
  transactionReference: string | null;
};

type ReminderRequestType = {
  status: string;
  page: number;
  limit: number;
};

interface ReminderPaymentType {
  transactionReference: string;
  amount: number;
  currency: 'NGN' | 'USD';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  reminderGroupId: string;
  notificationChannelsPaidFor: ('SMS' | 'WHATSAPP' | 'PHONE_CALL')[];
}

interface Reminder {
  _id: string;
  userId: string;
  medication: {
    medicationName: string;
    drugName: string;
    medicationType: string;
    description?: string;
    medicationImage?: UploadImage;
    dosage: string;
    startDateTime: string;
    durationInDays: number;
    endDateTime: string;
    timesPerDay: number;
    note?: string;
    dailyDoseTimes: {
      time: string;
      date: string;
      isoDate: string;
      status: 'PENDING' | 'TAKEN' | 'MISSED';
      _id: string;
    }[][];
    medicationStatus: string;
    _id: string;
  };
  notificationChannels: string[];
  phoneNumbers: string[];
  emails: string[];
  payments?: ReminderPaymentType[];
  reminderGroupId: string;
  createdAt: string;
  updatedAt: string;
}

interface TodayReminder {
  doseId: string;
  reminderId: string;
  drugName: string;
  medicationType: string;
  time: string;
  status: string;
  date: string;
  note?: string;
}

interface UpdateDoseRequestType {
  status: 'TAKEN' | 'MISSED';
  id: string;
  doseId: string;
}

type AllReminderResponseType = ResponseTypeWithPagination<
  Reminder[],
  'reminders'
>;
type CreateReminderResponseType = ResponseType<CreateReminderResponse>;
type PaymentReminderResponseType = ResponseType<ReminderPaymentType>;
type TodayReminderResponseType = ResponseType<TodayReminder[]>;
type SingleReminderResponseType = ResponseType<Reminder>;
type UpdateDoseStatusResponseType = ResponseType<{
  message: string;
}>;
type UpdateMedicationResponseType = ResponseType<UpdateMedicationResponse>;
type UploadReminderImageResponseType = ResponseType<UploadImage>;

export type {
  AllReminderResponseType,
  CreateReminderRequestType,
  CreateReminderResponseType,
  Medication,
  MedicationType,
  PaymentReminderResponseType,
  ReminderRequestType,
  Reminder,
  SingleReminderResponseType,
  TodayReminder,
  TodayReminderResponseType,
  UpdateDoseRequestType,
  UpdateDoseStatusResponseType,
  UpdateMedicationRequestType,
  UpdateMedicationResponseType,
  UploadReminderImageResponseType,
};

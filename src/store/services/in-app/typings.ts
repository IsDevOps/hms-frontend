import { MetaInfo, ResponseType } from '../base.typing';

interface Notification {
  id: string;
  username: string;
  doseTime: string;
  dosage: string;
  medicationName: string;
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP' | 'PHONE_CALL')[];
  phoneNumbers: string[];
  emails: string[];
  userId: string;
  reminderId: string;
  doseId: string;
  scheduledAt: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MarkAsReadResponse {
  id: string;
  userId: string;
  title: string;
  body: string;
  reminderId: string;
  doseId: string;
  scheduledAt: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

type NotificationResponseType = ResponseType<{
  notifications: Notification[];
  meta: MetaInfo;
}>;
type MarkAsReadResponseType = ResponseType<MarkAsReadResponse>;

export type { MarkAsReadResponseType, Notification, NotificationResponseType };

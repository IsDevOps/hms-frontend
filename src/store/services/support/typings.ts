import { ResponseType } from '../base.typing';

type MessageSupportResponse = {
  subject: string;
  message: string;
};

type MessageSupportRequestType = {
  subjectType: string;
  description: string;
};

type MessageSupportResponseType = ResponseType<MessageSupportResponse>;

export type { MessageSupportResponseType, MessageSupportRequestType };

import { ResponseType } from '../base.typing';

type PaymentRequestBody = {
  reference: string;
};

type PaymentResponeType = ResponseType<{ redirectUrl: string }>;

export type { PaymentRequestBody, PaymentResponeType };

import { api } from '../api';
import { PaymentRequestBody, PaymentResponeType } from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const payment = api.injectEndpoints({
  endpoints: (build) => ({
    initiatePayment: build.mutation<PaymentResponeType, PaymentRequestBody>({
      query: (payload) => ({
        url: `${url}/payment/initiate`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useInitiatePaymentMutation } = payment;

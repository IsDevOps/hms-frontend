import { api } from '../api';
import {
  MessageSupportRequestType,
  MessageSupportResponseType,
} from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const support = api.injectEndpoints({
  endpoints: (build) => ({
    messageSupport: build.mutation<
      MessageSupportResponseType,
      MessageSupportRequestType
    >({
      query: (formData) => ({
        url: `${url}/support`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useMessageSupportMutation } = support;

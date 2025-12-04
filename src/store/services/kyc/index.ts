import { api } from '../api';
import {
  UploadKycRequestType,
  KycResponseType,
  UploadKycResponseType,
  BankProfileResponseType,
  KycBankDetails,
} from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const kyc = api.injectEndpoints({
  endpoints: (build) => ({
    uploadKyc: build.mutation<UploadKycResponseType, UploadKycRequestType>({
      query: (payload) => ({
        url: `${url}/auth/upload-kyc`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['KYC'],
    }),
    getKyc: build.query<KycResponseType, void>({
      query: () => ({
        url: `${url}/auth/get-kyc`,
        method: 'GET',
      }),
      providesTags: ['KYC'],
    }),

    updateHmoBankDetails: build.mutation<
      BankProfileResponseType,
      KycBankDetails
    >({
      query: (payload) => ({
        url: `${url}/auth/update-hmo-profile`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetKycQuery,
  useUploadKycMutation,
  useUpdateHmoBankDetailsMutation,
} = kyc;

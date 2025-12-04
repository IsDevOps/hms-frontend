import { api } from '../api';
import {
  ChangePhoneNumberRequest,
  ChangePhoneNumberResponse,
  HealthcarePractitionerProfileRequest,
  HealthcareProviderProfileRequest,
  HMOProfileRequest,
  PharmacyProfileRequestType,
  TenantProfileResponseType,
  UpdateUserRequest,
  UserProfileResponseType,
} from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const update = api.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<UserProfileResponseType, void>({
      query: () => `${url}/auth/get-profile`,
      providesTags: ['User'],
    }),
    getTenantProfile: build.query<TenantProfileResponseType, void>({
      query: () => ({
        url: `${url}/auth/get-tenant-profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: build.mutation<
      UserProfileResponseType,
      UpdateUserRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/update-profile`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),
    updatePractitionerProfile: build.mutation<
      TenantProfileResponseType,
      HealthcarePractitionerProfileRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/update-healthcare-practitioner-profile`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),
    updateHealthcareProviderProfile: build.mutation<
      TenantProfileResponseType,
      HealthcareProviderProfileRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/update-healthcare-provider-profile`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),
    updateHmoProfile: build.mutation<
      TenantProfileResponseType,
      HMOProfileRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/update-hmo-profile`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),
    updatePharmacyProfileMutation: build.mutation<
      TenantProfileResponseType,
      PharmacyProfileRequestType
    >({
      query: (payload) => ({
        url: `${url}/auth/update-pharmacy-profile`,
        method: 'PATCH',
        body: payload,
      }),
    }),
    changePhoneNumberOnProfile: build.mutation<
      ChangePhoneNumberResponse,
      ChangePhoneNumberRequest
    >({
      query: ({ resetToken, newPhoneNumber }) => ({
        method: 'PATCH',
        headers: {
          'x-reset-token': `${resetToken}`,
        },
        url: `${url}/auth/change-phone`,
        body: { newPhoneNumber },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserProfileQuery,
  useGetTenantProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateHmoProfileMutation,
  useUpdatePractitionerProfileMutation,
  useUpdateHealthcareProviderProfileMutation,
  useUpdatePharmacyProfileMutationMutation,
  useChangePhoneNumberOnProfileMutation,
} = update;

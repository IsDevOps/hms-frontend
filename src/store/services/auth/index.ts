import { api } from '../api';
import {
  ChangePhoneNumberRequest,
  ChangePhoneNumberResponse,
  ChangePinRequest,
  ChangePinResponse,
  CreatePharmacyAccountResponseType,
  CreatePharmacyRequestType,
  RegisterUserRequest,
  RegisterUserResponse,
  ForgetPinRequest,
  ForgetPinResponse,
  LoginResponseType,
  LoginUserRequest,
  OtpRequest,
  OtpResponse,
  RefreshTokenResponse,
  RegisterHealthcareProviderRequest,
  ResetPinRequest,
  ResetPinResponse,
  SetPinRequest,
  UserDetailsForLoginResponseType,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyPinOtpResponse,
  RegisterHealthcareResponse,
  RegisterHealthcarePractitionerRequest,
  CreateHMOAccountResponseType,
  CreateHMORequestType,
} from './typings';
import { cacher } from '@/store/services/api/rtkQueryCacheUtils';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const auth = api.injectEndpoints({
  endpoints: (build) => ({
    patientSignup: build.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (payload: RegisterUserRequest) => ({
        url: `${url}/auth/register-user`,
        method: 'POST',
        body: payload,
      }),
    }),
    createPharmacyAccount: build.mutation<
      CreatePharmacyAccountResponseType,
      CreatePharmacyRequestType
    >({
      query: (data) => ({
        url: `${url}/auth/register-pharmacy`,
        method: 'POST',
        body: data,
      }),
    }),
    registerHealthcareProvider: build.mutation<
      RegisterHealthcareResponse,
      RegisterHealthcareProviderRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/register-healthcare-provider`,
        method: 'POST',
        body: payload,
      }),
    }),
    registerHealthcarePractitioner: build.mutation<
      RegisterHealthcareResponse,
      RegisterHealthcarePractitionerRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/register-healthcare-practitioner`,
        method: 'POST',
        body: payload,
      }),
    }),
    registerHMO: build.mutation<
      CreateHMOAccountResponseType,
      CreateHMORequestType
    >({
      query: (payload) => ({
        url: `${url}/auth/register-hmo`,
        method: 'POST',
        body: payload,
      }),
    }),
    verifyOtp: build.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (payload: VerifyOtpRequest) => ({
        url: `${url}/auth/verify-phone-otp`,
        method: 'POST',
        body: payload,
      }),
    }),
    //to be used during sign up only
    setPin: build.mutation<VerifyOtpResponse, SetPinRequest>({
      query: ({ accessToken, pin }) => ({
        url: `${url}/auth/set-pin`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: { pin },
      }),
    }),
    verifyPinOtp: build.mutation<VerifyPinOtpResponse, VerifyOtpRequest>({
      query: (payload) => ({
        url: `${url}/auth/verify-otp`,
        method: 'POST',
        body: payload,
      }),
    }),
    forgetPin: build.mutation<ForgetPinResponse, ForgetPinRequest>({
      query: (payload: ForgetPinRequest) => ({
        url: `${url}/auth/forgot-pin`,
        method: 'POST',
        body: payload,
      }),
    }),
    login: build.mutation<LoginResponseType, LoginUserRequest>({
      query: (payload: LoginUserRequest) => ({
        url: `${url}/auth/login`,
        method: 'POST',
        body: payload,
      }),
      // on successful login, will refetch all currently
      // 'UNAUTHORIZED' queries
      invalidatesTags: (result) => (result ? ['UNAUTHORIZED'] : []),
    }),
    getUserDetails: build.query<UserDetailsForLoginResponseType, string>({
      query: (phone) => ({
        url: `${url}/auth/user-details/${phone}`,
        method: 'GET',
      }),
    }),
    resendOtp: build.mutation<OtpResponse, OtpRequest>({
      query: (payload: OtpRequest) => ({
        url: `${url}/auth/resend-otp`,
        method: 'POST',
        body: payload,
      }),
    }),
    changePhoneNumber: build.mutation<
      ChangePhoneNumberResponse,
      ChangePhoneNumberRequest
    >({
      query: ({ id, phone }) => ({
        url: `${url}/auth/change-phonenumber/${id}`,
        method: 'PATCH',
        body: { phone },
      }),
    }),
    changePin: build.mutation<ChangePinResponse, ChangePinRequest>({
      query: (payload: ChangePinRequest) => ({
        url: `${url}/auth/change-pin`,
        method: 'POST',
        body: payload,
      }),
    }),
    resetPin: build.mutation<ResetPinResponse, ResetPinRequest>({
      query: ({ newPin, phone, userIntent, resetToken }: ResetPinRequest) => ({
        url: `${url}/auth/reset-pin`,
        method: 'POST',
        headers: {
          'x-reset-token': `${resetToken}`,
        },
        body: { newPin, phone, userIntent },
      }),
    }),
    refreshToken: build.mutation<
      RefreshTokenResponse,
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: `${url}/auth/refresh`,
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    // change phone number flow on profile
    sendOtpToPhoneNumber: build.mutation<ChangePinResponse, { phone: string }>({
      query: ({ phone }) => ({
        url: `${url}/auth/send-otp`,
        method: 'POST',
        body: { phone },
      }),
    }),
    verifyNewPhoneNumber: build.mutation<
      VerifyPinOtpResponse,
      VerifyOtpRequest
    >({
      query: (payload) => ({
        url: `${url}/auth/verify-change-phone-otp`,
        method: 'POST',
        body: payload,
      }),
    }),

    refetchErroredQueries: build.mutation<unknown, void>({
      queryFn() {
        return { data: {} };
      },
      invalidatesTags: cacher.invalidatesUnknownErrors(),
    }),
  }),
  overrideExisting: true,
});

export const {
  usePatientSignupMutation,
  useRegisterHMOMutation,
  useCreatePharmacyAccountMutation,
  useRegisterHealthcareProviderMutation,
  useRegisterHealthcarePractitionerMutation,
  useLoginMutation,
  useGetUserDetailsQuery,
  useLazyGetUserDetailsQuery,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useChangePhoneNumberMutation,
  useForgetPinMutation,
  useChangePinMutation,
  useResetPinMutation,
  useSetPinMutation,
  useVerifyPinOtpMutation,
  useRefreshTokenMutation,
  useSendOtpToPhoneNumberMutation,
  useVerifyNewPhoneNumberMutation,
} = auth;

import { ResponseType } from '../base.typing';
import { KycStatus } from '../kyc/typings';

export interface Membership {
  tenantId: string;
  tenantName: string;
  tenantType:
    | 'PHARMACY'
    | 'HEALTHCARE_PROVIDER'
    | 'HEALTHCARE_PRACTITIONER'
    | 'HMO';
  logoUrl?: string;
  role: string;
  permissions: string[];
  kycStatus: KycStatus;
  profileCompletionPercentage: 0;
}

// Request interfaces
export interface RegisterUserRequest {
  fullName: string;
  phone: string;
}

export type CreatePharmacyRequestType = {
  name: string;
  licenseNumber: string;
  businessAddress: string;
  email: string;
  phone: string;
};
export type CreateHMORequestType = {
  phone: string;
  hmoName: string;
  firstName: string;
  lastName: string;
  designation: string;
  businessEmail: string;
};

export interface RegisterHealthcareProviderRequest {
  phone: string;
  healthcareProviderType: 'CLINIC';
  healthcareFacilityName: string;
  registrationNumber: string;
}

export interface RegisterHealthcarePractitionerRequest {
  phone: string;
  practitionerType: 'DOCTOR';
  areaOfExpertise: string[];
  registrationNumber: string;
  healthcareFacilityName: string;
}

export interface LoginUserRequest {
  phone: string;
  pin: string;
}

export interface OtpRequest {
  phone: string;
}
export interface ForgetPinRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface ChangePhoneNumberRequest {
  id: string;
  phone: string;
}
export interface ChangePinRequest {
  oldPin: string;
  newPin: string;
}
export interface ResetPinRequest {
  phone: string;
  newPin: string;
  userIntent: 'login' | 'reset-pin';
  resetToken: string;
}

export interface SetPinRequest {
  pin: string;
  accessToken: string;
}

// Response data interfaces
interface UserResponseData {
  userId: string;
  phone: string;
}

interface PharmacyResponseData {
  tenantId: string;
  phone: string;
}
interface HMOResponseData {
  tenantId: string;
  phone: string;
}

interface HealthcareResponseData {
  tenantId: string;
  phone: string;
}

interface ForgetPinResponseData {
  phone: string;
}

interface ResetPinResponseData {
  message: string;
  userData: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      profilePictureUrl: string;
      profileCompletionPercentage: number;
    };
    memberships?: Membership[];
  };
}

interface UserDetailsForLoginResponse {
  fullName: string;
  phone: string;
  pinSet: boolean;
}

interface OtpResponseData {
  message: string;
}

interface AuthenticatedUserResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePictureUrl: string;
    profileCompletionPercentage: number;
  };
  memberships: Membership[];
}

interface VerifyPinOtpResponseData {
  message: string;
  resetToken: string;
}

interface ChangePhoneNumberResponseData {
  id: string;
  phone: string;
}
interface ChangePinResponseData {
  message: string;
}

interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export type RegisterUserResponse = ResponseType<UserResponseData>;
export type CreatePharmacyAccountResponseType =
  ResponseType<PharmacyResponseData>;
export type CreateHMOAccountResponseType = ResponseType<HMOResponseData>;
export type RegisterHealthcareResponse = ResponseType<HealthcareResponseData>;
export type UserDetailsForLoginResponseType =
  ResponseType<UserDetailsForLoginResponse>;
export type LoginResponseType = ResponseType<AuthenticatedUserResponseData>;
export type OtpResponse = ResponseType<OtpResponseData>;
export type VerifyOtpResponse = ResponseType<AuthenticatedUserResponseData>;
export type VerifyPinOtpResponse = ResponseType<VerifyPinOtpResponseData>;
export type ForgetPinResponse = ResponseType<ForgetPinResponseData>;
export type ResetPinResponse = ResponseType<ResetPinResponseData>;
export type RefreshTokenResponse = ResponseType<RefreshTokenResponseData>;
export type ChangePhoneNumberResponse =
  ResponseType<ChangePhoneNumberResponseData>;
export type ChangePinResponse = ResponseType<ChangePinResponseData>;

import { User } from '@/store/reducers/auth/typings';
import { ResponseType } from '../base.typing';
import { UploadImage } from '../others/typings';
import { EducationalExpType } from '@/lib/validations/others';
import { KycStatus } from '../kyc/typings';

type BankDetails = {
  accountName: string;
  bankName: string;
  accountNumber: string;
};

type UserProfile = {
  id: string;
  user: Pick<User, 'fullName' | 'email' | 'phone'> & {
    profilePicture: UploadImage;
    pinSet: boolean;
    createdAt: string;
    updatedAt: string;
  };
  dateOfBirth: string;
  gender: string;
  age: number;
  country: string;
  state: string;
  address: string;
  heightCm: number;
  weightKg: number;
  createdAt: string;
  updatedAt: string;
};

type HealthcareProviderProfileRequest = {
  logo?: UploadImage;
  healthcareFacilityName?: string;
  registrationNumber?: string;
  servicesOffered?: string[];
  bankDetails?: BankDetails[];
  country?: string;
  lga?: string;
  state?: string;
  website?: string;
  businessAddress?: string;
  businessEmail?: string;
  fullName?: string;
  phoneNumber?: string;
  position?: string;
  email?: string;
  meansOfId?: string;
  uploadMeansOfId?: UploadImage;
};

type HealthcarePractitionerProfileRequest = {
  logo?: UploadImage;
  healthcareFacilityName?: string;
  registrationNumber?: string;
  servicesOffered?: string[];
  bankDetails?: BankDetails[];
  country?: string;
  lga?: string;
  state?: string;
  website?: string;
  businessAddress?: string;
  businessEmail?: string;
  meansOfIdType?: string;
  meansOfId?: UploadImage;
  educationalExperience?: EducationalExpType;
};
type HMOProfileRequest = {
  logo?: UploadImage;
  name?: string;
  owner?: string;
  businessAddress?: string;
  businessEmail?: string;
  country?: string;
  state?: string;
  lga?: string;
  contactPersonLastName?: string;
  contactPersonFirstName?: string;
  contactPersonDesignation?: string;
  bankDetails?: BankDetails[];
};

type HealthcareProviderProfile = {
  id: string;
  tenantType: 'HEALTHCARE_PROVIDER';
  name: string;
  owner: string;
  healthcareProviderType: 'HOSPITAL';
  healthcareFacilityName: string;
  registrationNumber: string;
  logo: UploadImage;
  servicesOffered: string[];
  website: string;
  businessEmail: string;
  businessAddress: string;
  country: string;
  state: string;
  lga: string;
  authorizedRepInfo: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    meansOfIdType: string;
    meansOfId: UploadImage;
  };
  bankDetails: BankDetails[];
  createdAt: string;
  updatedAt: string;
};

type HealthcarePractitionerProfile = {
  id: string;
  tenantType: 'HEALTHCARE_PRACTITIONER';
  name: string;
  owner: string;
  practitionerType: 'DOCTOR';
  healthcareFacilityName: string;
  registrationNumber: string;
  logo: UploadImage;
  areaOfExpertise: string[];
  yearsOfExperience: number;
  bio: string;
  country: string;
  state: string;
  lga: string;
  meansOfIdType: string;
  meansOfId: UploadImage;
  servicesOffered: string[];
  businessEmail: string;
  businessAddress: string;
  educationalExperience: {
    school: string;
    degree: string;
    startMonth: string;
    startYear: number;
    endMonth: string;
    endYear: number;
  }[];
  bankDetails: BankDetails[];
  createdAt: string;
  updatedAt: string;
};

type HmoProviderProfile = {
  tenantType: 'HMO';
  name: string;
  owner: string;
  businessAddress: string;
  businessEmail: string;
  country: string;
  state: string;
  lga: string;
  contactPersonLastName: string;
  contactPersonFirstName: string;
  contactPersonDesignation: string;
  phoneNumber?: string;
  bankDetails?: BankDetails[];
  logo?: {
    url: string;
    mimeType: string;
    width: number;
    height: number;
    size: number;
    format: string;
  };
};

export type PharmacyProfileRequestType = {
  businessAddress?: string;
  email?: string;
  country?: string;
  state?: string;
  logo?: UploadImage;
  lga?: string;
  servicesOffered?: string[];
  contactPersonName?: string;
  contactEmail?: string;
  bankDetails?: BankDetails[];
};

type PharmacyProfile = {
  id: string;
  tenantType: 'PHARMACY';
  name: string;
  owner: string;
  licenseNumber: string;
  businessAddress: string;
  email: string;
  logo: UploadImage;
  servicesOffered: string[];
  kycDocuments: [
    documentType: string,
    file: UploadImage,
    status: KycStatus,
    uploadedAt: string,
  ];
  bankDetails: BankDetails[];
  contactEmail: string;
  contactPersonName: string;
  country: string;
  lga: string;
  state: string;
};

export interface UpdateUserRequest {
  profilePicture?: UploadImage;
  dateOfBirth?: string;
  gender?: string;
  age?: number;
  country?: string;
  state?: string;
  address?: string;
  heightCm?: number;
  weightKg?: number;
  email?: string;
}

interface ChangePhoneNumberRequest {
  resetToken: string;
  newPhoneNumber: string;
}

type TenantProfileResponseType = ResponseType<
  | HealthcareProviderProfile
  | HealthcarePractitionerProfile
  | HmoProviderProfile
  | PharmacyProfile
>;
type UserProfileResponseType = ResponseType<UserProfile>;
type ChangePhoneNumberResponse = ResponseType<{ message: string }>;

export type {
  HealthcareProviderProfileRequest,
  HealthcarePractitionerProfileRequest,
  HMOProfileRequest,
  HmoProviderProfile,
  TenantProfileResponseType,
  UserProfileResponseType,
  ChangePhoneNumberRequest,
  ChangePhoneNumberResponse,
};

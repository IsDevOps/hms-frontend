import { ResponseType } from '../base.typing';
import { UploadImage } from '../others/typings';

type KycDocument = {
  documentType: string;
  file: UploadImage;
};

type KycStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface UploadKycRequestType {
  documents: KycDocument[];
  level?: number;
}

interface UploadKycResponseData {
  id: string;
  tenantType:
    | 'HEALTHCARE_PROVIDER'
    | 'HEALTHCARE_PRACTITIONER'
    | 'PHARMACY'
    | 'HMO';
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

interface KycResponseData {
  _id: string;
  tenantType:
    | 'PHARMACY'
    | 'HEALTHCARE_PROVIDER'
    | 'HEALTHCARE_PRACTITIONER'
    | 'HMO';
  name: string;
  owner: string;
  licenseNumber: string;
  businessAddress: string;
  email: string;
  servicesOffered: string[];
  kycDocuments: [
    {
      documentType: string;
      file: UploadImage;
      status: KycStatus;
      uploadedAt: string;
      level?: number;
    },
  ];
}

type KycBankDetails = {
  bankDetails?:
    | {
        accountName: string;
        accountNumber: string;
        bankName: string;
      }
    | {
        accountName: string;
        accountNumber: string;
        bankName: string;
      }[];
};

type BankProfileResponseType = ResponseType<KycBankDetails>;
type UploadKycResponseType = ResponseType<UploadKycResponseData>;
type KycResponseType = ResponseType<KycResponseData>;

export type {
  KycDocument,
  KycStatus,
  UploadKycRequestType,
  UploadKycResponseType,
  KycResponseType,
  BankProfileResponseType,
  KycBankDetails,
};

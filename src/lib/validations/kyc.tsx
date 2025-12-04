import { z } from 'zod';
import { uploadedDocumentSchema } from './others';

const HealthcareKYCSchema = z.object({
  medical_license: uploadedDocumentSchema,
  tax_id_number: uploadedDocumentSchema,
  proof_of_address: uploadedDocumentSchema,
});
const PharmacyKYCFormSchema = z.object({
  meansOfIdentification: z.string().min(1, 'Means of ID is required'),
  meansOfIdentificationImage: uploadedDocumentSchema,
  cac: uploadedDocumentSchema,
  PharmacyLicense: uploadedDocumentSchema,
  TaxIdentificationNumber: uploadedDocumentSchema,
});
const HMOLevel2KYCFormSchema = z.object({
  HmoLogo: uploadedDocumentSchema,
  CacRegistrationCertificate: uploadedDocumentSchema,
  NHISLicense: uploadedDocumentSchema,
  TaxIdentificationNumber: uploadedDocumentSchema,
});
const HMOLevel3KYCFormSchema = z.object({
  bankName: z
    .string()
    .min(1, 'Enter bank name')
    .max(100, 'Bank name is too long'),

  accountName: z.string().min(1, 'Account name is required'),

  accountNumber: z
    .string()
    .min(10, 'Account number is required')
    .max(10, 'Account number must be exactly 10 digits'),
  ApplicationForm: uploadedDocumentSchema,
  AvailablePlan: uploadedDocumentSchema,
  AssociatedClinic: uploadedDocumentSchema,
});

type HealthcareKYCFormType = z.infer<typeof HealthcareKYCSchema>;
type HMOLevel2KYCFormType = z.infer<typeof HMOLevel2KYCFormSchema>;
type HMOLevel3KYCFormType = z.infer<typeof HMOLevel3KYCFormSchema>;

export {
  HealthcareKYCSchema,
  PharmacyKYCFormSchema,
  HMOLevel2KYCFormSchema,
  HMOLevel3KYCFormSchema,
};

export type {
  HealthcareKYCFormType,
  HMOLevel2KYCFormType,
  HMOLevel3KYCFormType,
  PharmacyKYCFormType,
};
type PharmacyKYCFormType = z.infer<typeof PharmacyKYCFormSchema>;

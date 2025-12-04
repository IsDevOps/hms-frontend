import { z } from 'zod';
import { HealthcareSignUpBaseSchema } from './auth';
import {
  BankDetailsSchema,
  EducationalExpSchema,
  uploadedDocumentSchema,
} from './others';

const UserProfileSchema = z.object({
  fullname: z
    .string()
    .min(2, 'Full name is too short')
    .max(100, 'Full name is too long'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),
  date: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: 'Date must be in YYYY-MM-DD format',
    }),
  gender: z
    .string()
    .optional()
    .refine((val) => !val || ['male', 'female'].includes(val), {
      message: 'Gender must be either "male" or "female"',
    }),
  age: z
    .string()
    .optional()
    .refine((val) => !val || (/^\d+$/.test(val) && Number(val) > 0), {
      message: 'Age must be a valid number',
    }),
  country: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Country is required',
    }),
  height: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^\d+$/.test(val) && Number(val) >= 100 && Number(val) <= 250),
      {
        message: 'Height must be a number between 100 and 250 cm',
      }
    ),
  weight: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^\d+$/.test(val) && Number(val) >= 30 && Number(val) <= 200),
      {
        message: 'Weight must be a number between 30 and 200 kg',
      }
    ),
});

const HealthcareProviderProfileSchema = HealthcareSignUpBaseSchema.omit({
  areaOfExpertise: true,
  phone: true,
}).extend({
  country: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Country is required',
    }),
  state: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'State is required',
    }),
  lga: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, { message: 'LGA is required' }),
  website: z.string().optional(),
  servicesOffered: z.array(z.string()).optional(),
  businessAddress: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Business address is required',
    }),
  businessEmail: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),
  bankDetails: z
    .array(BankDetailsSchema)
    .refine(
      (arr) =>
        arr.length === 0 || arr.every((item) => Object.keys(item).length > 0),
      { message: 'Bank details must not contain empty entries' }
    ),
  fullName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 2 && val.length <= 100), {
      message: 'Full name must be between 2 and 100 characters long',
    }),
  designation: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Enter your position',
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: 'Phone number should be at least 10 characters long',
    })
    .transform((val) => (val ? (val[0] !== '0' ? `0${val}` : val) : val))
    .transform((val) => (val ? val.replace(/^0+/, '+234') : val)),
  meansOfId: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Means of identification is required',
    }),
  uploadMeansOfId: uploadedDocumentSchema.or(z.string()).optional(),
});

const HealthcarePractitionerProfileSchema = HealthcareSignUpBaseSchema.omit({
  areaOfExpertise: true,
  phone: true,
}).extend({
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  bio: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Bio is required',
    }),
  country: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Country is required',
    }),
  state: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'State is required',
    }),
  lga: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, { message: 'LGA is required' }),
  servicesOffered: z.array(z.string()).optional(),
  businessAddress: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Business address is required',
    }),
  businessEmail: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),
  bankDetails: z
    .array(BankDetailsSchema)
    .refine(
      (arr) =>
        arr.length === 0 || arr.every((item) => Object.keys(item).length > 0),
      { message: 'Bank details must not contain empty entries' }
    ),
  meansOfIdType: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Means of identification is required',
    }),
  meansOfId: uploadedDocumentSchema.or(z.string()).optional(),
  educationalExperience: z.array(EducationalExpSchema).optional(),
});

const PharmacyUserUpdateProfileSchema = z.object({
  pharmacyName: z.string().min(1, 'Enter pharmacy name'),
  pharmacyLicenseNumber: z.string().min(1, 'Enter pharmacy license number'),
  businessAddress: z.string().min(1, 'Enter business address'),
  country: z.string().min(1, 'Select country'),
  state: z.string().min(1, 'Select state'),
  lga: z.string().min(1, 'Select LGA'),
  servicesOffered: z.array(z.string()).min(1, 'Select at least one service'),
  contactPersonName: z.string().min(1, 'Enter contact person name'),
  contactEmail: z.string().email('Invalid email address'),
  bankDetails: z
    .array(BankDetailsSchema)
    .refine(
      (arr) =>
        arr.length === 0 || arr.every((item) => Object.keys(item).length > 0),
      { message: 'Bank details must not contain empty entries' }
    ),
});
const HmoProviderUpdateProfileSchema = z.object({
  fullname: z
    .string()
    .min(2, 'Full name is too short')
    .max(100, 'Full name is too long')
    .optional(),

  name: z
    .string()
    .min(2, 'HMO name is too short')
    .max(100, 'HMO name is too long'),

  hmoName: z
    .string()
    .min(2, 'HMO name is too short')
    .max(100, 'HMO name is too long')
    .optional(),

  businessAddress: z
    .string()
    .min(1, 'Enter business address')
    .max(200, 'Business address is too long'),

  businessEmail: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    }),

  country: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Country is required',
    }),

  state: z.string().min(2, 'State is required'),
  lga: z.string().min(2, 'LGA is required'),

  contactPersonFirstName: z
    .string()
    .min(1, 'Enter contact person first name')
    .max(100, 'Contact person first name is too long'),

  contactPersonLastName: z
    .string()
    .min(1, 'Enter contact person last name')
    .max(100, 'Contact person last name is too long'),

  contactPersonDesignation: z
    .string()
    .min(2, 'Enter designation')
    .max(100, 'Designation is too long'),

  bankName: z
    .string()
    .min(1, 'Enter bank name')
    .max(100, 'Bank name is too long')
    .optional(),

  accountNumber: z
    .string()
    .min(10, 'Account number must be at least 10 digits')
    .max(20, 'Account number is too long')
    .optional(),

  profilePicture: z
    .object({
      url: z.string().url(),
      mimeType: z.string(),
      width: z.number(),
      height: z.number(),
      size: z.number(),
      format: z.string(),
    })
    .optional(),
});

type UserProfileValidation = z.infer<typeof UserProfileSchema>;
type HealthcareProviderProfileValidation = z.infer<
  typeof HealthcareProviderProfileSchema
>;
type HealthcarePractitionerProfileValidation = z.infer<
  typeof HealthcarePractitionerProfileSchema
>;
type PharmacyUserUpdateProfileValidation = z.infer<
  typeof PharmacyUserUpdateProfileSchema
>;
type HmoUserUpdateProfileValidation = z.infer<
  typeof HmoProviderUpdateProfileSchema
>;

export {
  UserProfileSchema,
  HealthcareProviderProfileSchema,
  HealthcarePractitionerProfileSchema,
  PharmacyUserUpdateProfileSchema,
  HmoProviderUpdateProfileSchema,
};
export type {
  UserProfileValidation,
  HealthcareProviderProfileValidation,
  HealthcarePractitionerProfileValidation,
  PharmacyUserUpdateProfileValidation,
  HmoUserUpdateProfileValidation,
};

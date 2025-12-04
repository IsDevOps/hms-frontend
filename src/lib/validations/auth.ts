import { z } from 'zod';
import { userType } from '../utils';

const RoleFormSchema = z.object({
  role: z.enum(['INDIVIDUAL_USER', 'PHARMACY', 'HEALTHCARE', 'HMO'], {
    required_error: 'You need to select a notification type.',
  }),
});

const LoginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long'),
  pin: z
    .string()
    .min(4, 'Pin must be 4 digits')
    .max(4, 'Pin must not exceed 4 digits'),
});

const EverydayUserSignUpSchema = z.object({
  fullName: z.string().min(1, 'Please provide your full name'),
  phone: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
});

const HmoUserSignUpSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
  hmoName: z.string().min(2, 'Please provide your HMO name'),
  firstName: z.string().min(1, 'First name is required'),

  lastName: z.string().min(1, 'Last name is required'),

  designation: z.string().min(2, 'Please enter your designation'),
  businessEmail: z.string().email('Invalid email address'),
});
const PharmacySignUpSchema = z.object({
  name: z.string().min(1, 'Please provide your pharmacy name'),
  phone: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
  licenseNumber: z.string().min(1, 'Please provide your license number'),
  businessAddress: z.string().min(1, 'Please provide your business address'),
  email: z.string().email('Invalid email address'),
});

const HealthcareSignUpBaseSchema = z.object({
  providerType: z.preprocess(
    (val) =>
      typeof val === 'string' ? val.toLocaleLowerCase().replace('_', '/') : val,
    z.enum(['hospital/clinic', 'specialist'], {
      required_error: 'Healthcare provider type is required',
    })
  ),
  areaOfExpertise: z
    .array(z.string().min(1, 'Please select at least one specialty'))
    .max(3, 'Should only select a maximum of 3')
    .optional(),
  healthcareFacilityName: z.string().min(1, 'Enter facility name'),
  registrationNumber: z.string().min(1, 'Enter registration number'),
  phone: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
});

const HealthcareSignUpSchema = HealthcareSignUpBaseSchema.refine(
  (data) =>
    data.providerType.toLocaleLowerCase() === userType.HEALTHCARE_PRACTITIONER
      ? !!data.areaOfExpertise?.length
      : true,
  {
    message: 'Please select at least one specialty',
    path: ['areaOfExpertise'],
  }
);

const ExpertiseFormSchema = z.object({
  areaOfExpertise: z.array(
    z.string().min(1, 'Please select at least one specialty')
  ),
});

const VerificationCodeSchema = z.object({
  code: z
    .string()
    .min(4, 'Pin must be 4 digits')
    .max(4, 'Pin must not exceed 4 digits'),
});

const PinSchema = z.object({
  pin: z
    .string()
    .min(4, 'Pin must be 4 digits')
    .max(4, 'Pin must not exceed 4 digits'),
});

const TwoFactorAuthSchema = z
  .object({
    pin: z
      .string()
      .min(4, 'Pin must be 4 digits')
      .max(4, 'Pin must not exceed 4 digits'),
    confirm: z
      .string()
      .min(4, 'Pin must be 4 digits')
      .max(4, 'Pin must not exceed 4 digits'),
  })
  .refine((val) => val.pin === val.confirm, {
    message: "Pins don't match",
    path: ['confirm'],
  });

type RoleFormType = z.infer<typeof RoleFormSchema>;
type EverydayUserSignUpValidation = z.infer<typeof EverydayUserSignUpSchema>;
type HmoUserSignUpValidation = z.infer<typeof HmoUserSignUpSchema>;
type HealthcareSignUpValidation = z.infer<typeof HealthcareSignUpSchema>;
type ExpertiseFormValidation = z.infer<typeof ExpertiseFormSchema>;
type LoginValidation = z.infer<typeof LoginSchema>;
type VerificationCodeValidation = z.infer<typeof VerificationCodeSchema>;
type PinValidation = z.infer<typeof PinSchema>;
type PharmacySignUpValidation = z.infer<typeof PharmacySignUpSchema>;
type TwoFactorAuthValidation = z.infer<typeof TwoFactorAuthSchema>;

export {
  RoleFormSchema,
  EverydayUserSignUpSchema,
  HmoUserSignUpSchema,
  HealthcareSignUpBaseSchema, // this for extending purposes
  HealthcareSignUpSchema, // this for form validation purposes
  ExpertiseFormSchema,
  LoginSchema,
  VerificationCodeSchema,
  PinSchema,
  PharmacySignUpSchema,
  TwoFactorAuthSchema,
};
export type {
  RoleFormType,
  EverydayUserSignUpValidation,
  HmoUserSignUpValidation,
  HealthcareSignUpValidation,
  ExpertiseFormValidation,
  LoginValidation,
  VerificationCodeValidation,
  PinValidation,
  PharmacySignUpValidation,
  TwoFactorAuthValidation,
};

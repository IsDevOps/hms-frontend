import { z } from 'zod';

const PhoneNumberFormSchema = z.object({
  phone_number: z
    .string()
    .min(10, 'Phone number should be atleast 10 characters long')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
});

const EmailFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const EducationalExpSchema = z.object({
  school: z.string().min(2, 'Enter school'),
  degree: z.string().min(2, 'Enter degree'),
  startMonth: z.string().min(1, 'Select a valid start month'),
  startYear: z.string().regex(/^\d{4}$/, 'Select a valid start year'),
  endMonth: z.string().min(1, 'Select a valid end month'),
  endYear: z.string().regex(/^\d{4}$/, 'Select a valid end year'),
});

const SupportSchema = z.object({
  subjectType: z.string().min(1, 'Subject type is required'),
  description: z.string().min(1, 'Subject type is required'),
});

const uploadedDocumentSchema = z.object({
  url: z.string(),
  mimeType: z.string(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  size: z.number(),
  format: z.string().optional(),
});

const BankDetailsSchema = z.object({
  bankName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Enter bank name',
    }),
  accountName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Enter account name',
    }),
  accountNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: 'Account number must be at least 10 characters long',
    }),
});

type PhoneNumberFormType = z.infer<typeof PhoneNumberFormSchema>;
type EmailFormType = z.infer<typeof EmailFormSchema>;
type EducationalExpType = z.infer<typeof EducationalExpSchema>;
type SupportFormType = z.infer<typeof SupportSchema>;
type BankDetailsFormType = z.infer<typeof BankDetailsSchema>;

export {
  BankDetailsSchema,
  EducationalExpSchema,
  EmailFormSchema,
  PhoneNumberFormSchema,
  SupportSchema,
  uploadedDocumentSchema,
};

export type {
  BankDetailsFormType,
  EducationalExpType,
  EmailFormType,
  PhoneNumberFormType,
  SupportFormType,
};

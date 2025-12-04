import { z } from 'zod';

const MedicationFormSchema = z.object({
  medication: z
    .object({
      medicationName: z.string().min(3, 'Enter medication name'),
      drugName: z.string().min(3, 'Enter drug name'),
      medicationType: z
        .enum([
          'PILL',
          'SYRUP',
          'INJECTION',
          'DRIP',
          'OINTMENT',
          'INHALER',
          'OTHERS',
        ])
        .optional(),
      description: z.string().optional(),
      medicationImage: z
        .object({
          url: z.string(),
          mimeType: z.string(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
          format: z.string(),
        })
        .optional(),
      dosage: z.string().min(1, 'Select dosage'),
      startDateTime: z.preprocess(
        (val) => {
          if (val instanceof Date) {
            return val.toISOString();
          }
          return val;
        },
        z.string().datetime({ message: 'Invalid datetime string' })
      ),
      durationInDays: z.string().min(1, 'Enter for how long'),
      endDateTime: z.preprocess(
        (val) => {
          if (val instanceof Date) {
            return val.toISOString();
          }
          return val;
        },
        z.string().datetime({ message: 'Invalid datetime string' }).readonly()
      ),
      timesPerDay: z.string().min(1, 'Select number of times taken'),
      dailyDoseTimes: z.array(
        z.array(
          z.object({
            time: z
              .string()
              .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time')
              .nonempty(),
            date: z.string(),
            isoDate: z.string(),
          })
        )
      ),
      note: z.string().optional(),
    })
    .array()
    .nonempty(),
});

const ChooseNotifcationFormSchema = z
  .object({
    channels: z
      .array(z.string())
      .nonempty({ message: 'Select notification channel' }),
    phoneNumbers: z.array(z.string()).optional(),
    emails: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const requiresPhoneNumber = data.channels.some((str: string) =>
        ['sms', 'phone_call', 'whatsapp'].includes(str.toLocaleLowerCase())
      );
      if (requiresPhoneNumber) {
        return (
          Array.isArray(data.phoneNumbers) &&
          data.phoneNumbers?.some((num) => num.trim() !== '')
        );
      }
      return true;
    },
    {
      message: 'Atleast one phone number is required',
      path: ['phoneNumbers'],
    }
  )
  .refine(
    (data) => {
      const requiresEmail = data.channels.some(
        (str: string) => str.toLocaleLowerCase() === 'email'
      );
      if (requiresEmail) {
        return (
          Array.isArray(data.emails) &&
          data.emails?.some((e) => e.trim() !== '')
        );
      }
      return true;
    },
    {
      message: 'Atleast one email is required',
      path: ['emails'],
    }
  );

const PaymentFormSchema = z.object({
  amount: z.string().min(1, 'Enter amount'),
  paymentMethod: z.string().min(1, 'Select payment method'),
});

type MedicationFormType = z.infer<typeof MedicationFormSchema>;
type ChooseNotificationFormType = z.infer<typeof ChooseNotifcationFormSchema>;
type PaymentFormType = z.infer<typeof PaymentFormSchema>;

export { MedicationFormSchema, ChooseNotifcationFormSchema, PaymentFormSchema };

export type { MedicationFormType, ChooseNotificationFormType, PaymentFormType };

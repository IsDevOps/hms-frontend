import { z } from 'zod';

const AddSubUserFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .transform((val) => (val[0] !== '0' ? `0${val}` : val))
    .transform((val) => val.replace(/^0+/, '+234')),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  address: z.string().min(5, 'Address is required'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  role: z.string().min(1, 'Role is required'),
  tempPin: z
    .string()
    .min(4, 'Temporary PIN must be 4 digits')
    .max(4, 'Temporary PIN must be 4 digits'),
});

const EditStaffFormSchema = AddSubUserFormSchema.omit({
  tempPin: true,
});

const AddDoctorsFormSchema = AddSubUserFormSchema.extend({
  licenseNumber: z.string().min(2, 'License number is required'),
  specialty: z.string().array().nonempty('Select atleast 1 speciality'),
});

const EditDoctorsFormSchema = AddDoctorsFormSchema.omit({
  tempPin: true,
});

const AddRoleFormSchema = z.object({
  name: z.string().min(3, 'Role name is required'),
  description: z.string().optional(),
});

const PermissionsSchema = z.object({
  service: z.string(),
  permissions: z
    .string()
    .array()
    .nonempty('At least one permission must be selected'),
});

type AddSubUserFormType = z.infer<typeof AddSubUserFormSchema>;
type AddDoctorsFormType = z.infer<typeof AddDoctorsFormSchema>;
type AddRoleFormType = z.infer<typeof AddRoleFormSchema>;
type PermissionsFormType = z.infer<typeof PermissionsSchema>;
type EditStaffFormType = z.infer<typeof EditStaffFormSchema>;
type EditDoctorsFormType = z.infer<typeof EditDoctorsFormSchema>;

export {
  AddRoleFormSchema,
  PermissionsSchema,
  AddSubUserFormSchema,
  AddDoctorsFormSchema,
  EditStaffFormSchema,
  EditDoctorsFormSchema,
};
export type {
  AddRoleFormType,
  PermissionsFormType,
  AddSubUserFormType,
  AddDoctorsFormType,
  EditStaffFormType,
  EditDoctorsFormType,
};

import { z } from 'zod';

const fileUploadSchema = z
  .custom<File>()
  .refine(
    (file) => {
      return (
        !file ||
        (file instanceof File &&
          (file.type.startsWith('image/') || file.type === 'application/pdf'))
      );
    },
    {
      message:
        'Invalid file format. Only images (JPEG, JPG, PNG) or PDF files are allowed.',
    }
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, 'File must be less than 2MB');

type FileUploadType = z.infer<typeof fileUploadSchema>;

export { fileUploadSchema };
export type { FileUploadType };

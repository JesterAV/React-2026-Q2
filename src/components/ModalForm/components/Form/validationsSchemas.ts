import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().refine(
    (value) => {
      if (value.length === 0) return true;

      return /^\p{Lu}$/u.test(value[0]);
    },
    {
      message: 'First letter must be uppercase',
    }
  ),

  age: z.string().refine(
    (value) => {
      if (value.length === 0) return true;

      const num = Number(value);

      return !isNaN(num) && num > 0;
    },
    {
      message: 'Age must be a positive number',
    }
  ),
  email: z.string().refine(
    (value) => {
      if (value.length === 0) return true;

      const emailParts = value.split('@');
      if (emailParts.length !== 2) return false;

      const localPart = emailParts[0];
      const domainPart = emailParts[1];

      if (localPart.length === 0) return false;

      const domainParts = domainPart.split('.');
      if (domainParts.length < 2) return false;

      const hasEmptyDomainPart = domainParts.some((part) => part.length === 0);
      if (hasEmptyDomainPart) return false;

      return true;
    },
    {
      message:
        'Invalid email format (must contain one @, non-empty local part, and a valid domain with a dot)',
    }
  ),
  password: z.string().refine(
    (value) => {
      if (value.length === 0) return true;

      const hasNumber = /\d/.test(value);
      const hasUppercase = /\p{Lu}/u.test(value);
      const hasLowercase = /\p{Ll}/u.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(value);

      return hasNumber && hasUppercase && hasLowercase && hasSpecial;
    },
    {
      message:
        'Password must contain: 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character',
    }
  ),
  img: z
    .instanceof(File)
    .refine(
      (file) => {
        const maxFileSize = 2 * 1024 * 1024;
        return file.size <= maxFileSize;
      },
      { message: 'File size is more than 2MB' }
    )
    .refine(
      (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        return allowedTypes.includes(file.type);
      },
      { message: 'Only jpeg, jpg and png formats are supported' }
    )
    .nullable(),

  gender: z.string(),
  country: z.string(),
  acceptTerms: z.boolean(),
});

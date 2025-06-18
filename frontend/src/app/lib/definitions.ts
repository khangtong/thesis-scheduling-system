import { z } from 'zod';

export const LoginFormSchema = z.object({
  emailOrUsername: z.union([
    z.string().email({ message: 'Please enter a valid email.' }).trim(),
    z.string().min(1, { message: 'Username cannot be empty.' }).trim(),
  ]),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .trim(),
});

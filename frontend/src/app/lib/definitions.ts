import { z } from 'zod';

export type Role =
  | {
      id: number;
      name: string;
    }
  | undefined;

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  fullname: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
} | null;

export const ITEMS_PER_PAGE = 6;

export const LoginFormSchema = z.object({
  emailOrUsername: z.union([
    z.string().email({ message: 'Email không hợp lệ.' }).trim(),
    z.string().min(1, { message: 'Tên tài khoản không được để trống.' }).trim(),
  ]),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .trim(),
});

export const UserFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Tên tài khoản không được để trống.' })
    .max(100)
    .trim(),
  email: z.string().email({ message: 'Email không hợp lệ.' }).max(255).trim(),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .max(255)
    .trim(),
  fullname: z
    .string()
    .min(1, { message: 'Họ và tên không được để trống.' })
    .max(255)
    .trim(),
  roleId: z.number({ message: 'Vai trò không hợp lệ.' }).int().positive(),
});

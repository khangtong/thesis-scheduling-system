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

export type Faculty = {
  id: number;
  name: string;
} | null;

export type Degree = {
  id: number;
  name: string;
} | null;

export type Lecturer = {
  id: number;
  code: string;
  faculty: Faculty;
  degree: Degree;
  user: User;
} | null;

export type Student = {
  id: number;
  code: string;
  studentClass: string;
  user: User;
} | null;

export const ITEMS_PER_PAGE = 8;

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

export const UserFormSchema = z
  .object({
    // Base user fields
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

    // Optional lecturer fields
    lecturerCode: z
      .string()
      .min(1, { message: 'Mã giảng viên không được để trống.' })
      .max(6)
      .trim()
      .optional()
      .or(z.literal('')),
    facultyId: z
      .number({ message: 'Khoa không hợp lệ.' })
      .int()
      .positive()
      .optional()
      .or(z.nan()),
    degreeId: z
      .number({ message: 'Học vị không hợp lệ.' })
      .int()
      .positive()
      .optional()
      .or(z.nan()),

    // Optional student fields
    studentCode: z
      .string()
      .min(1, { message: 'Mã sinh viên không được để trống.' })
      .max(8)
      .trim()
      .optional()
      .or(z.literal('')),
    studentClass: z
      .string()
      .min(1, { message: 'Tên lớp không được để trống.' })
      .max(100)
      .trim()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // If role is lecturer, lecturer fields are required
      if (data.roleId === 2) {
        // Assuming roleId 2 is GIANG_VIEN
        return (
          data.lecturerCode &&
          data.lecturerCode.trim() !== '' &&
          data.facultyId &&
          !isNaN(data.facultyId) &&
          data.degreeId &&
          !isNaN(data.degreeId)
        );
      }

      // If role is student, student fields are required
      if (data.roleId === 3) {
        // Assuming roleId 3 is SINH_VIEN
        return (
          data.studentCode &&
          data.studentCode.trim() !== '' &&
          data.studentClass &&
          data.studentClass.trim() !== ''
        );
      }

      return true;
    },
    {
      message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
      path: [], // This will be a general form error
    }
  );

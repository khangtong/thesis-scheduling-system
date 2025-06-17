'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';

import { LoginFormSchema } from './definitions';

export async function login(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Sign in
  const input = validatedFields.data;

  try {
    const response = await axios.post(
      `${process.env.API_URL}/users/signin`,
      JSON.stringify(input),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 200) {
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      (await cookies()).set('session', response.data.token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });

      return {
        success: true,
      };
    }
  } catch (error: any) {
    return {
      message: error?.response?.data?.message,
    };
  }
}

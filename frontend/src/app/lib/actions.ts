'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';

import { LoginFormSchema, User } from './definitions';

export async function login(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    emailOrUsername: formData.get('emailOrUsername'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Sign in
  let input: any = { password: validatedFields.data.password };
  if (
    validatedFields.data.emailOrUsername.match(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
    )
  ) {
    input.email = validatedFields.data.emailOrUsername;
  } else {
    input.username = validatedFields.data.emailOrUsername;
  }

  try {
    const response = await axios.post(
      `${process.env.API_URL}/login`,
      JSON.stringify(input),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 200) {
      const expiresAt = Date.now() + 90 * 24 * 60 * 60 * 1000;
      const cookieStore = await cookies();

      // Store the token
      cookieStore.set('session', response.data.token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });

      // Store user data (including role) in a separate cookie
      cookieStore.set('user', JSON.stringify(response.data.user), {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });

      return { ...response.data, success: true };
    }
  } catch (error: any) {
    return {
      message: error?.response?.data?.message,
    };
  }
}

// Helper function to get user data from cookies
export async function getUser(): Promise<User> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      return null;
    }
  }
  return null;
}

export async function logout() {
  try {
    const cookieStore = await cookies();

    // Get current user data for potential API call to backend
    const userCookie = cookieStore.get('user')?.value;
    const sessionToken = cookieStore.get('session')?.value;

    // Optional: Call backend to invalidate token
    if (sessionToken) {
      try {
        await axios.post(
          `${process.env.API_URL}/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        // Backend logout failed, but we'll still clear cookies
        console.error('Backend logout failed:', error);
      }
    }

    // Clear all authentication-related cookies
    cookieStore.delete('session');
    cookieStore.delete('user');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
}

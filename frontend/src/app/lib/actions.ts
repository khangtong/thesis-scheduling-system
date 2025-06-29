'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';

import {
  FacultyFormSchema,
  LoginFormSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  User,
  UserFormSchema,
  VerifyResetCodeSchema,
} from './definitions';

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

      return {
        ...response.data,
        success: true,
        message: 'Đăng nhập thành công',
      };
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

// Request password reset action
export async function requestPasswordReset(prevState: any, formData: FormData) {
  const validatedFields = RequestPasswordResetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại thông tin.',
    };
  }

  const { email } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        message: result.message || 'Có lỗi xảy ra khi gửi mã xác thực.',
        success: false,
      };
    }

    return {
      message: 'Mã xác thực đã được gửi đến email của bạn.',
      success: true,
      email: email,
    };
  } catch (error) {
    return {
      message: 'Lỗi kết nối. Vui lòng thử lại.',
      success: false,
    };
  }
}

// Verify reset code action
export async function verifyResetCode(prevState: any, formData: FormData) {
  const validatedFields = VerifyResetCodeSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại thông tin.',
    };
  }

  const { email, code } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/verify-reset-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        message: result.message || 'Mã xác thực không hợp lệ.',
        success: false,
      };
    }

    return {
      message: 'Mã xác thực hợp lệ.',
      success: true,
      resetToken: result.resetToken,
    };
  } catch (error) {
    return {
      message: 'Lỗi kết nối. Vui lòng thử lại.',
      success: false,
    };
  }
}

// Reset password action
export async function resetPassword(prevState: any, formData: FormData) {
  const validatedFields = ResetPasswordSchema.safeParse({
    token: formData.get('token'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Vui lòng kiểm tra lại thông tin.',
    };
  }

  const { token, newPassword } = validatedFields.data;

  try {
    const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        message: result.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.',
        success: false,
      };
    }

    return {
      message:
        'Mật khẩu đã được đặt lại thành công. Đang chuyển hướng đến trang đăng nhập...',
      success: true,
    };
  } catch (error) {
    return {
      message: 'Lỗi kết nối. Vui lòng thử lại.',
      success: false,
    };
  }
}

export async function createUser(state: any, formData: FormData) {
  // 1. Parse form data
  const formDataObj = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    fullname: formData.get('fullname'),
    roleId: Number(formData.get('roleId')),
    // Lecturer fields
    lecturerCode: formData.get('lecturerCode') || '',
    facultyId: formData.get('facultyId')
      ? Number(formData.get('facultyId'))
      : NaN,
    degreeId: formData.get('degreeId') ? Number(formData.get('degreeId')) : NaN,
    // Student fields
    studentCode: formData.get('studentCode') || '',
    studentClass: formData.get('studentClass') || '',
  };
  console.log('Form data object:', formDataObj);

  // 2. Validate form fields
  const validatedFields = UserFormSchema.safeParse(formDataObj);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const authToken = (await cookies()).get('session')?.value;

    // 3. Create base user first
    const baseUserData = {
      username: data.username,
      email: data.email,
      password: data.password,
      fullname: data.fullname,
      roleId: data.roleId,
    };

    const userResponse = await axios.post(
      `${process.env.API_URL}/users`,
      JSON.stringify(baseUserData),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userResponse.status !== 201) {
      throw new Error('Không thể tạo người dùng');
    }

    const createdUser = userResponse.data;
    const userId = createdUser.id || createdUser.user?.id;

    if (!userId) {
      throw new Error('Không tìm thấy ID người dùng trong phản hồi');
    }

    // 4. Create additional profile based on role
    // Assuming roleId 2 is GIANG_VIEN and roleId 3 is SINH_VIEN
    if (
      data.roleId === 2 &&
      data.lecturerCode &&
      data.facultyId &&
      data.degreeId
    ) {
      // Create lecturer profile
      const lecturerData = {
        userId: userId,
        code: data.lecturerCode,
        facultyId: data.facultyId,
        degreeId: data.degreeId,
      };

      await axios.post(
        `${process.env.API_URL}/lecturers`,
        JSON.stringify(lecturerData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else if (data.roleId === 3 && data.studentCode && data.studentClass) {
      // Create student profile
      const studentData = {
        userId: userId,
        code: data.studentCode,
        studentClass: data.studentClass,
      };

      await axios.post(
        `${process.env.API_URL}/students`,
        JSON.stringify(studentData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return {
      ...createdUser,
      success: true,
    };
  } catch (error: any) {
    console.error('Create user error:', error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message:
          error.response.data?.message || 'Có lỗi xảy ra khi tạo người dùng',
        errors: error.response.data?.errors || {},
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'Không thể kết nối đến server',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'Có lỗi không xác định xảy ra',
      };
    }
  }
}

export async function updateUser(
  id: number | undefined,
  lecturerId: number | undefined,
  studentId: number | undefined,
  state: any,
  formData: FormData
) {
  // 1. Parse form data
  const formDataObj = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    fullname: formData.get('fullname'),
    roleId: Number(formData.get('roleId')),
    active: formData.get('active') === 'true' ? true : false,
    // Lecturer fields
    lecturerCode: formData.get('lecturerCode') || '',
    facultyId: formData.get('facultyId')
      ? Number(formData.get('facultyId'))
      : NaN,
    degreeId: formData.get('degreeId') ? Number(formData.get('degreeId')) : NaN,
    // Student fields
    studentCode: formData.get('studentCode') || '',
    studentClass: formData.get('studentClass') || '',
  };

  // 2. Validate form fields
  const validatedFields = UserFormSchema.safeParse(formDataObj);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const authToken = (await cookies()).get('session')?.value;

    // 3. Create base user first
    const baseUserData = {
      username: data.username,
      email: data.email,
      password: data.password,
      fullname: data.fullname,
      active: data.active,
    };

    const userResponse = await axios.put(
      `${process.env.API_URL}/users/${id}`,
      JSON.stringify(baseUserData),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userResponse.status !== 200) {
      throw new Error('Không thể cập nhật người dùng');
    }

    const updatedUser = userResponse.data;
    const userId = updatedUser.id || updatedUser.user?.id;

    if (!userId) {
      throw new Error('Không tìm thấy ID người dùng trong phản hồi');
    }

    // 4. Create additional profile based on role
    // Assuming roleId 2 is GIANG_VIEN and roleId 3 is SINH_VIEN
    if (
      data.roleId === 2 &&
      data.lecturerCode &&
      data.facultyId &&
      data.degreeId
    ) {
      // Create lecturer profile
      const lecturerData = {
        userId: userId,
        code: data.lecturerCode,
        facultyId: data.facultyId,
        degreeId: data.degreeId,
      };

      await axios.put(
        `${process.env.API_URL}/lecturers/${lecturerId}`,
        JSON.stringify(lecturerData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else if (data.roleId === 3 && data.studentCode && data.studentClass) {
      // Create student profile
      const studentData = {
        userId: userId,
        code: data.studentCode,
        studentClass: data.studentClass,
      };

      await axios.put(
        `${process.env.API_URL}/students/${studentId}`,
        JSON.stringify(studentData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return {
      ...updatedUser,
      success: true,
    };
  } catch (error: any) {
    console.error('Update user error:', error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message:
          error.response.data?.message ||
          'Có lỗi xảy ra khi cập nhật người dùng',
        errors: error.response.data?.errors || {},
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'Không thể kết nối đến server',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'Có lỗi không xác định xảy ra',
      };
    }
  }
}

export async function deleteUser(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(`${process.env.API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Người dùng đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể xóa người dùng' };
    }
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, message: error.message || 'Có lỗi xảy ra' };
  }
}

export async function createFaculty(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = FacultyFormSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.post(
      `${process.env.API_URL}/faculties`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Khoa đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo khoa' };
    }
  } catch (error: any) {
    console.error('Create faculty error:', error);
    return { success: false, message: error.message || 'Có lỗi xảy ra' };
  }
}

export async function updateFaculty(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = FacultyFormSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.put(
      `${process.env.API_URL}/faculties/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Khoa đã được cập nhật thành công' };
    } else {
      return { success: false, message: 'Không thể cập nhật khoa' };
    }
  } catch (error: any) {
    console.error('Update faculty error:', error);
    return { success: false, message: error.message || 'Có lỗi xảy ra' };
  }
}

export async function deleteFaculty(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/faculties/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Khoa đã được xóa thành công' };
    } else {
      return { success: false, message: 'Không thể xóa khoa' };
    }
  } catch (error: any) {
    console.error('Delete faculty error:', error);
    return { success: false, message: error.message || 'Có lỗi xảy ra' };
  }
}

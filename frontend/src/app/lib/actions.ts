'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

import {
  AvailabilityRequestSchema,
  CommitteeRoleFormSchema,
  CreateTimeSlotFormSchema,
  DefensePeriodFormSchema,
  DefenseCommitteeFormSchema,
  DegreeFormSchema,
  ExpertiseFormSchema,
  FacultyFormSchema,
  LoginFormSchema,
  PriorityScheduleFormSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  RoomFormSchema,
  TimeSlotFormSchema,
  User,
  UserFormSchema,
  VerifyResetCodeSchema,
  ThesisFormSchema,
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
        await axios.get(`${process.env.API_URL}/logout`, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
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
    expertiseIds: formData.getAll('expertiseIds').map((id) => Number(id)),
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
        expertiseIds: data.expertiseIds || [],
      };

      const lecturerResponse = await axios.post(
        `${process.env.API_URL}/lecturers`,
        JSON.stringify(lecturerData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (lecturerResponse.status !== 201) {
        axios.delete(`${process.env.API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        throw new Error('Không thể tạo giảng viên');
      }
    } else if (data.roleId === 3 && data.studentCode && data.studentClass) {
      // Create student profile
      const studentData = {
        userId: userId,
        code: data.studentCode,
        studentClass: data.studentClass,
      };

      const studentResponse = await axios.post(
        `${process.env.API_URL}/students`,
        JSON.stringify(studentData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (studentResponse.status !== 201) {
        axios.delete(`${process.env.API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        throw new Error('Không thể tạo sinh viên');
      }
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
        message: error.response.data.message || 'Có lỗi không xác định xảy ra',
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
    expertiseIds: formData.getAll('expertiseIds').map((id) => Number(id)),
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
        expertiseIds: data.expertiseIds || [],
      };

      const lecturerResponse = await axios.put(
        `${process.env.API_URL}/lecturers/${lecturerId}`,
        JSON.stringify(lecturerData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (lecturerResponse.status !== 200) {
        throw new Error('Không thể cập nhật thông tin giảng viên');
      }
    } else if (data.roleId === 3 && data.studentCode && data.studentClass) {
      // Create student profile
      const studentData = {
        userId: userId,
        code: data.studentCode,
        studentClass: data.studentClass,
      };

      const studentResponse = await axios.put(
        `${process.env.API_URL}/students/${studentId}`,
        JSON.stringify(studentData),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (studentResponse.status !== 200) {
        throw new Error('Không thể cập nhật thông tin sinh viên');
      }
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
        message: error.response.data.message || 'Có lỗi không xác định xảy ra',
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
      throw new Error('Không thể xóa người dùng');
    }
  } catch (error: any) {
    console.error('Delete user error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
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
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
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
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
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
      throw new Error('Không thể xóa khoa');
    }
  } catch (error: any) {
    console.error('Delete faculty error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createDegree(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = DegreeFormSchema.safeParse({
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
      `${process.env.API_URL}/degrees`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Học vị đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo học vị' };
    }
  } catch (error: any) {
    console.error('Create degree error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateDegree(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = DegreeFormSchema.safeParse({
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
      `${process.env.API_URL}/degrees/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Học vị đã được cập nhật thành công' };
    } else {
      return { success: false, message: 'Không thể cập nhật học vị' };
    }
  } catch (error: any) {
    console.error('Update degree error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteDegree(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/degrees/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Học vị đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa học vị');
    }
  } catch (error: any) {
    console.error('Delete degree error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createRoom(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = RoomFormSchema.safeParse({
    name: formData.get('name'),
    active: true,
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
      `${process.env.API_URL}/rooms`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Phòng đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo phòng' };
    }
  } catch (error: any) {
    console.error('Create room error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateRoom(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = RoomFormSchema.safeParse({
    name: formData.get('name'),
    active: formData.get('active') === 'true' ? true : false,
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
      `${process.env.API_URL}/rooms/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Phòng đã được cập nhật thành công' };
    } else {
      return { success: false, message: 'Không thể cập nhật phòng' };
    }
  } catch (error: any) {
    console.error('Update room error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteRoom(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(`${process.env.API_URL}/rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Phòng đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa phòng');
    }
  } catch (error: any) {
    console.error('Delete room error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createCommitteeRole(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = CommitteeRoleFormSchema.safeParse({
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
      `${process.env.API_URL}/committee-roles`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        message: 'Vai trò hội đồng đã được tạo thành công',
      };
    } else {
      return { success: false, message: 'Không thể tạo vai trò hội đồng' };
    }
  } catch (error: any) {
    console.error('Create committee role error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateCommitteeRole(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = CommitteeRoleFormSchema.safeParse({
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
      `${process.env.API_URL}/committee-roles/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Vai trò hội đồng đã được cập nhật thành công',
      };
    } else {
      return { success: false, message: 'Không thể cập nhật vai trò hội đồng' };
    }
  } catch (error: any) {
    console.error('Update committee role error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteCommitteeRole(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/committee-roles/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return {
        success: true,
        message: 'Vai trò hội đồng đã được xóa thành công',
      };
    } else {
      throw new Error('Không thể xóa vai trò hội đồng');
    }
  } catch (error: any) {
    console.error('Delete committee role error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createExpertise(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = ExpertiseFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
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
      `${process.env.API_URL}/expertises`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Chuyên môn đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo chuyên môn' };
    }
  } catch (error: any) {
    console.error('Create expertise error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateExpertise(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = ExpertiseFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
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
      `${process.env.API_URL}/expertises/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Chuyên môn đã được cập nhật thành công',
      };
    } else {
      return { success: false, message: 'Không thể cập nhật chuyên môn' };
    }
  } catch (error: any) {
    console.error('Update expertise error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteExpertise(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/expertises/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Chuyên môn đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa chuyên môn');
    }
  } catch (error: any) {
    console.error('Delete expertise error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createDefensePeriod(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = DefensePeriodFormSchema.safeParse({
    name: formData.get('name'),
    start: new Date(formData.get('start') + ''),
    end: new Date(formData.get('end') + ''),
    active: true,
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
      `${process.env.API_URL}/defense-periods`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Đợt bảo vệ đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo đợt bảo vệ' };
    }
  } catch (error: any) {
    console.error('Create defense period error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateDefensePeriod(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = DefensePeriodFormSchema.safeParse({
    name: formData.get('name'),
    start: new Date(formData.get('start') + ''),
    end: new Date(formData.get('end') + ''),
    active: formData.get('active') === 'true' ? true : false,
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
      `${process.env.API_URL}/defense-periods/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Đợt bảo vệ đã được cập nhật thành công',
      };
    } else {
      return { success: false, message: 'Không thể cập nhật đợt bảo vệ' };
    }
  } catch (error: any) {
    console.error('Update defense period error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteDefensePeriod(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/defense-periods/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Đợt bảo vệ đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa đợt bảo vệ');
    }
  } catch (error: any) {
    console.error('Delete defense period error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createTimeSlot(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  if (
    !(
      formData.get('start-morning-phase') && formData.get('end-morning-phase')
    ) &&
    !(
      formData.get('start-afternoon-phase') &&
      formData.get('end-afternoon-phase')
    )
  ) {
    return {
      success: false,
      message: 'Vui lòng chọn ít nhất một ca',
    };
  }

  const validatedFields = CreateTimeSlotFormSchema.safeParse({
    defensePeriodId: Number(formData.get('defensePeriodId') || -1),
    startMorningPhase:
      formData.get('start-morning-phase') && formData.get('end-morning-phase')
        ? formData.get('start-morning-phase')
        : null,
    endMorningPhase:
      formData.get('start-morning-phase') && formData.get('end-morning-phase')
        ? formData.get('end-morning-phase')
        : null,
    startAfternoonPhase:
      formData.get('start-afternoon-phase') &&
      formData.get('end-afternoon-phase')
        ? formData.get('start-afternoon-phase')
        : null,
    endAfternoonPhase:
      formData.get('start-afternoon-phase') &&
      formData.get('end-afternoon-phase')
        ? formData.get('end-afternoon-phase')
        : null,
    timeLength: Number(formData.get('time-length') || -1),
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
      `${process.env.API_URL}/timeslots`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Khung giờ đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo khung giờ' };
    }
  } catch (error: any) {
    console.error('Create time slot error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateTimeSlot(
  id: number | undefined,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = TimeSlotFormSchema.safeParse({
    date: new Date(formData.get('date') + ''),
    start: formData.get('start'),
    end: formData.get('end'),
    defenseCommitteeId: Number(formData.get('defenseCommitteeId')) || null,
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
      `${process.env.API_URL}/timeslots/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Khung giờ đã được cập nhật thành công',
      };
    } else {
      return { success: false, message: 'Không thể cập nhật khung giờ' };
    }
  } catch (error: any) {
    console.error('Update time slot error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteTimeSlot(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/timeslots/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Khung giờ đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa khung giờ');
    }
  } catch (error: any) {
    console.error('Delete time slot error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function requestAvailability(
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  // Extract the deadline from the form data
  const deadline = formData.get('deadline');

  // Extract the defense period ID
  const defensePeriodId = Number(formData.get('defensePeriodId'));

  // Extract the selected faculties from the form data
  // The checkbox values will be in the format 'selectedFaculties'
  const selectedFacultiesEntries = Array.from(formData.entries()).filter(
    ([key]) => key.startsWith('selectedFaculties')
  );

  const selectedFaculties = selectedFacultiesEntries
    .map(([_, value]) => Number(value.toString()))
    .filter((id) => !isNaN(id));

  // Validate the data
  const validatedFields = AvailabilityRequestSchema.safeParse({
    defensePeriodId,
    selectedFaculties,
    deadline: new Date(deadline + ''),
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
      `${process.env.API_URL}/request-availability`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Yêu cầu đã được gửi thành công' };
    } else {
      return { success: false, message: 'Không thể gửi yêu cầu' };
    }
  } catch (error: any) {
    console.error('Request availability error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createPrioritySchedule(
  timeSlotId: number
): Promise<{ success: boolean; message?: string; errors?: any }> {
  const validatedFields = PriorityScheduleFormSchema.safeParse({
    lecturerId: null,
    timeSlotId,
  });

  if (!validatedFields.success) {
    throw new Error('Đầu vào không hợp lệ');
  }

  const data = validatedFields.data;

  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.post(
      `${process.env.API_URL}/priority-schedules`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      // Force a revalidation of the cache
      revalidatePath('/dashboard/priority-schedules');
      return { success: true, message: 'Đăng ký lịch bận thành công' };
    } else {
      throw new Error('Không thể đăng ký lịch bận');
    }
  } catch (error: any) {
    console.error('Create priority schedule error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deletePrioritySchedule(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/priority-schedules/delete?timeSlotId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      // Force a revalidation of the cache
      revalidatePath('/dashboard/priority-schedules');
      return { success: true, message: 'Hủy đăng ký lịch bận thành công' };
    } else {
      throw new Error('Không thể hủy đăng ký lịch bận');
    }
  } catch (error: any) {
    console.error('Delete priority schedule error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createDefenseCommittee(state: any, formData: FormData) {
  if (formData.getAll('timeSlotIds').length == 0) {
    return {
      success: false,
      message: 'Hội đồng phải có ít nhất 1 khung giờ',
    };
  }

  const validatedFields = DefenseCommitteeFormSchema.safeParse({
    name: formData.get('name'),
    roomId: Number(formData.get('roomId')),
    defensePeriodId: Number(formData.get('defensePeriodId')),
    lecturerIds: formData.getAll('lecturerIds').map((id) => Number(id)),
    committeeRoleIds: formData
      .getAll('committeeRoleIds')
      .map((id) => Number(id)),
    timeSlotIds: formData.getAll('timeSlotIds').map((id) => Number(id)),
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
      `${process.env.API_URL}/defense-committees`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Hội đồng đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo hội đồng' };
    }
  } catch (error: any) {
    console.error('Create defense committee error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateDefenseCommittee(
  id: number,
  state: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; errors?: any }> {
  if (formData.getAll('timeSlotIds').length == 0) {
    return {
      success: false,
      message: 'Hội đồng phải có ít nhất 1 khung giờ',
    };
  }

  const validatedFields = DefenseCommitteeFormSchema.safeParse({
    name: formData.get('name'),
    roomId: Number(formData.get('roomId')),
    defensePeriodId: Number(formData.get('defensePeriodId')),
    lecturerIds: formData.getAll('lecturerIds').map((id) => Number(id)),
    committeeRoleIds: formData
      .getAll('committeeRoleIds')
      .map((id) => Number(id)),
    timeSlotIds: formData.getAll('timeSlotIds').map((id) => Number(id)),
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
      `${process.env.API_URL}/defense-committees/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Cập nhật hội đồng thành công' };
    } else {
      return { success: false, message: 'Không thể cập nhật hội đồng' };
    }
  } catch (error: any) {
    console.error('Update defense committee error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteDefenseCommittee(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(
      `${process.env.API_URL}/defense-committees/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      return { success: true, message: 'Hội đồng đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa hội đồng');
    }
  } catch (error: any) {
    console.error('Delete defense committee error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function createThesis(state: any, formData: FormData) {
  const validatedFields = ThesisFormSchema.safeParse({
    title: formData.get('title'),
    studentId: Number(formData.get('studentId')),
    lecturerId: Number(formData.get('lecturerId')),
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
      `${process.env.API_URL}/theses`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Luận văn đã được tạo thành công' };
    } else {
      return { success: false, message: 'Không thể tạo luận văn' };
    }
  } catch (error: any) {
    console.error('Create thesis error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function updateThesis(id: number, state: any, formData: FormData) {
  const validatedFields = ThesisFormSchema.safeParse({
    title: formData.get('title'),
    studentId: Number(formData.get('studentId')),
    lecturerId: Number(formData.get('lecturerId')),
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
      `${process.env.API_URL}/theses/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Luận văn đã được cập nhật thành công' };
    } else {
      return { success: false, message: 'Không thể cập nhật luận văn' };
    }
  } catch (error: any) {
    console.error('Update thesis error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function deleteThesis(id: number) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.delete(`${process.env.API_URL}/theses/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Luận văn đã được xóa thành công' };
    } else {
      throw new Error('Không thể xóa luận văn');
    }
  } catch (error: any) {
    console.error('Delete thesis error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra',
    };
  }
}

export async function scheduling(
  id: number | undefined,
  timeSlotId: number | undefined
) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.put(
      `${process.env.API_URL}/theses/scheduling/${id}`,
      JSON.stringify({ timeSlotId }),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Luận văn đã được xếp lịch thành công' };
    } else {
      return { success: false, message: 'Không thể xếp lịch luận văn' };
    }
  } catch (error: any) {
    console.error('Scheduling error:', error);
    throw new Error(
      error?.response?.data?.message || 'Không thể xếp lịch luận văn'
    );
  }
}

export async function unscheduled(id: number | undefined) {
  try {
    const authToken = (await cookies()).get('session')?.value;

    const response = await axios.put(
      `${process.env.API_URL}/theses/unscheduled/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Luận văn đã được gỡ xếp lịch thành công',
      };
    } else {
      return { success: false, message: 'Không thể gỡ xếp lịch luận văn' };
    }
  } catch (error: any) {
    console.error('Scheduling error:', error);
    throw new Error(
      error?.response?.data?.message || 'Không thể gỡ xếp lịch luận văn'
    );
  }
}

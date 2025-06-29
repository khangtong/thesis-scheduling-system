import { Faculty, User } from './definitions';
import { ITEMS_PER_PAGE } from './definitions';

export async function fetchUsers(
  token: string | undefined,
  query: string = ''
) {
  let users: User[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/users/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users.');
    }

    const data = await response.json();
    users = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return { users, totalPages };
}

export async function fetchUserById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchLecturerByUserId(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/lecturers/user/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lecturer.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lecturer:', error);
    throw new Error('Failed to fetch lecturer.');
  }
}

export async function fetchStudentByUserId(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(`${process.env.API_URL}/students/user/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw new Error('Failed to fetch student.');
  }
}

export async function fetchRoles(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/roles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Failed to fetch roles.');
  }
}

export async function fetchFaculties(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/faculties`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch faculties.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    throw new Error('Failed to fetch faculties.');
  }
}

export async function fetchFacultyById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/faculties/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch faculty.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching faculty:', error);
    throw new Error('Failed to fetch faculty.');
  }
}

export async function fetchFacultiesWithQuery(
  token: string | undefined,
  query: string
) {
  let faculties: Faculty[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/faculties/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch faculties with query.');
    }

    const data = await response.json();
    faculties = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching faculties with query:', error);
    throw new Error('Failed to fetch faculties with query.');
  }

  return { faculties, totalPages };
}

export async function fetchDegrees(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/degrees`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch degrees.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching degrees:', error);
    throw new Error('Failed to fetch degrees.');
  }
}

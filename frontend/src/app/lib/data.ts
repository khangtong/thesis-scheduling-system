import { User } from './definitions';

export async function fetchUsers(token: string | undefined) {
  let users: User[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users.');
    }

    const data = await response.json();
    users = data;
    totalPages = Math.ceil(data.length / 6);
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return { users, totalPages };
}

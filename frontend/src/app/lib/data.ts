import { User } from './definitions';
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

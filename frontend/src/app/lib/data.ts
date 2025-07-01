import {
  Degree,
  Faculty,
  User,
  Room,
  CommitteeRole,
  Expertise,
} from './definitions';
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

export async function fetchDegreesWithQuery(
  token: string | undefined,
  query: string
) {
  let degrees: Degree[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/degrees/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch degrees with query.');
    }

    const data = await response.json();
    degrees = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching degrees with query:', error);
    throw new Error('Failed to fetch degrees with query.');
  }

  return { degrees, totalPages };
}

export async function fetchDegreeById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/degrees/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch degree.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching degree:', error);
    throw new Error('Failed to fetch degree.');
  }
}

export async function fetchRooms(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/rooms`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms.');
  }
}

export async function fetchRoomsWithQuery(
  token: string | undefined,
  query: string
) {
  let rooms: Room[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/rooms/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch rooms with query.');
    }

    const data = await response.json();
    rooms = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching rooms with query:', error);
    throw new Error('Failed to fetch rooms with query.');
  }

  return { rooms, totalPages };
}

export async function fetchRoomById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/rooms/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw new Error('Failed to fetch room.');
  }
}

export async function fetchCommitteeRoles(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/committee-roles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch committee roles.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching committee roles:', error);
    throw new Error('Failed to fetch committee roles.');
  }
}

export async function fetchCommitteeRolesWithQuery(
  token: string | undefined,
  query: string
) {
  let committeeRoles: CommitteeRole[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/committee-roles/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch committee roles with query.');
    }

    const data = await response.json();
    committeeRoles = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching committee roles with query:', error);
    throw new Error('Failed to fetch committee roles with query.');
  }

  return { committeeRoles, totalPages };
}

export async function fetchCommitteeRoleById(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/committee-roles/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch committee role.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching committee role:', error);
    throw new Error('Failed to fetch committee role.');
  }
}

export async function fetchExpertises(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/expertises`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expertises.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expertises:', error);
    throw new Error('Failed to fetch expertises.');
  }
}

export async function fetchExpertisesWithQuery(
  token: string | undefined,
  query: string
) {
  let expertises: Expertise[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/expertises/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch expertises with query.');
    }

    const data = await response.json();
    expertises = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching expertises with query:', error);
    throw new Error('Failed to fetch expertises with query.');
  }

  return { expertises, totalPages };
}

export async function fetchExpertiseById(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(`${process.env.API_URL}/expertises/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expertise.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expertise:', error);
    throw new Error('Failed to fetch expertise.');
  }
}

export async function fetchExpertisesByLecturerId(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/lecturers-expertises/lecturer/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch expertise.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expertise:', error);
    throw new Error('Failed to fetch expertise.');
  }
}

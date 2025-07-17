import {
  Degree,
  Faculty,
  User,
  Room,
  CommitteeRole,
  Expertise,
  DefensePeriod,
} from './definitions';
import { ITEMS_PER_PAGE } from './definitions';

export async function fetchUsers(token: string | undefined) {
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
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export async function searchUsers(token: string | undefined, query: string) {
  try {
    let url = `${process.env.API_URL}/users/search`;
    const params = new URLSearchParams();

    if (query.includes('query=') || query.includes('roleId=')) {
      // Parse the query string
      const queryParams = new URLSearchParams(query);

      // Add each parameter to the URL params if it exists
      if (queryParams.has('query'))
        params.append('query', queryParams.get('query')!);
      if (queryParams.has('roleId'))
        params.append('roleId', queryParams.get('roleId')!);
    } else if (query) {
      // If it's a simple query string, use it as is
      params.append('query', query);
    }

    // Append the parameters to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
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
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    return { data, totalPages };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users.');
  }
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

export async function fetchDefensePeriods(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/defense-periods`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch defense periods.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching defense periods:', error);
    throw new Error('Failed to fetch defense periods.');
  }
}

export async function fetchDefensePeriodById(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/defense-periods/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch defense period.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching defense period:', error);
    throw new Error('Failed to fetch defense period.');
  }
}

export async function fetchDefensePeriodsWithQuery(
  token: string | undefined,
  query: string
) {
  let defensePeriods: DefensePeriod[] = [];
  let totalPages = 1;

  try {
    const response = await fetch(
      `${process.env.API_URL}/defense-periods/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch defense periods with query.');
    }

    const data = await response.json();
    defensePeriods = data;
    totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching defense periods with query:', error);
    throw new Error('Failed to fetch defense periods with query.');
  }

  return { defensePeriods, totalPages };
}

export async function fetchTimeSlots(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/timeslots`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch time slots.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw new Error('Failed to fetch time slots.');
  }
}

export async function fetchTimeSlotById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/timeslots/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch time slot.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching time slot:', error);
    throw new Error('Failed to fetch time slot.');
  }
}

export async function searchTimeSlots(
  token: string | undefined,
  query: string
) {
  try {
    // Parse the query string to extract date, start, and end parameters if present
    let url = `${process.env.API_URL}/timeslots/search`;
    const params = new URLSearchParams();

    // Check if query is a complex query with date, start, and end parameters
    if (
      query.includes('date=') ||
      query.includes('start=') ||
      query.includes('end=')
    ) {
      // Parse the query string
      const queryParams = new URLSearchParams(query);

      // Add each parameter to the URL params if it exists
      if (queryParams.has('date'))
        params.append('date', queryParams.get('date')!);
      if (queryParams.has('start'))
        params.append('start', queryParams.get('start')!);
      if (queryParams.has('end')) params.append('end', queryParams.get('end')!);
    } else if (query) {
      // If it's a simple query string, use it as is
      params.append('query', query);
    }

    // Append the parameters to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch time slots.');
    }

    const data = await response.json();
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    return { data, totalPages };
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw new Error('Failed to fetch time slots.');
  }
}

export async function fetchTimeSlotsByDateRange(
  token: string | undefined,
  startDate: string,
  endDate: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/timeslots/date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch time slots.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw new Error('Failed to fetch time slots.');
  }
}

export async function fetchNotifications(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/notifications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications.');
  }
}

export async function fetchPrioritySchedules(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/priority-schedules`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch priority schedules.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching priority schedules:', error);
    throw new Error('Failed to fetch priority schedules.');
  }
}

export async function fetchDefenseCommittees(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/defense-committees`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch defense committees.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching defense committees:', error);
    throw new Error('Failed to fetch defense committees.');
  }
}

export async function fetchDefenseCommitteeById(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/defense-committees/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch defense committee.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching defense committee:', error);
    throw new Error('Failed to fetch defense committee.');
  }
}

export async function searchDefenseCommittees(
  token: string | undefined,
  query: string
) {
  try {
    let url = `${process.env.API_URL}/defense-committees/search`;
    const params = new URLSearchParams();

    if (
      query.includes('name=') ||
      query.includes('defensePeriodId=') ||
      query.includes('timeSlotId=') ||
      query.includes('roomId=')
    ) {
      // Parse the query string
      const queryParams = new URLSearchParams(query);

      // Add each parameter to the URL params if it exists
      if (queryParams.has('name'))
        params.append('name', queryParams.get('name')!);
      if (queryParams.has('defensePeriodId'))
        params.append('defensePeriodId', queryParams.get('defensePeriodId')!);
      if (queryParams.has('timeSlotId'))
        params.append('timeSlotId', queryParams.get('timeSlotId')!);
      if (queryParams.has('roomId'))
        params.append('roomId', queryParams.get('roomId')!);
    } else if (query) {
      // If it's a simple query string, use it as is
      params.append('query', query);
    }

    // Append the parameters to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch defense committees.');
    }

    const data = await response.json();
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    return { data, totalPages };
  } catch (error) {
    console.error('Error fetching defense committees:', error);
    throw new Error('Failed to fetch defense committees.');
  }
}

export async function fetchCommitteeMembers(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/committee-members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch committee members.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching committee members:', error);
    throw new Error('Failed to fetch committee members.');
  }
}

export async function fetchCommitteeMembersByDefenseCommitteeId(
  token: string | undefined,
  id: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/committee-members/defense-committee/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch committee members.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching committee members:', error);
    throw new Error('Failed to fetch committee members.');
  }
}

export async function fetchTheses(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/theses`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch theses.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching theses:', error);
    throw new Error('Failed to fetch theses.');
  }
}

export async function fetchThesisById(token: string | undefined, id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/theses/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch thesis.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching thesis:', error);
    throw new Error('Failed to fetch thesis.');
  }
}

export async function searchTheses(token: string | undefined, query: string) {
  try {
    let url = `${process.env.API_URL}/theses/search`;
    const params = new URLSearchParams();

    if (
      query.includes('title=') ||
      query.includes('status=') ||
      query.includes('lecturerId=') ||
      query.includes('timeSlotId=')
    ) {
      // Parse the query string
      const queryParams = new URLSearchParams(query);

      // Add each parameter to the URL params if it exists
      if (queryParams.has('title'))
        params.append('title', queryParams.get('title')!);
      if (queryParams.has('status'))
        params.append('status', queryParams.get('status')!);
      if (queryParams.has('lecturerId'))
        params.append('lecturerId', queryParams.get('lecturerId')!);
      if (queryParams.has('timeSlotId'))
        params.append('timeSlotId', queryParams.get('timeSlotId')!);
    } else if (query) {
      // If it's a simple query string, use it as is
      params.append('query', query);
    }

    // Append the parameters to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch theses.');
    }

    const data = await response.json();
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    return { data, totalPages };
  } catch (error) {
    console.error('Error fetching theses:', error);
    throw new Error('Failed to fetch theses.');
  }
}

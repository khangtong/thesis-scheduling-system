import {
  fetchDegrees,
  fetchExpertises,
  fetchExpertisesByLecturerId,
  fetchFaculties,
  fetchLecturerByUserId,
  fetchRoles,
  fetchStudentByUserId,
  fetchUserById,
} from '@/app/lib/data';
import { Degree, Expertise, Faculty, Role, User } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/users/edit-user-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật người dùng',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const roles: Role[] = await fetchRoles(authToken);
  const faculties: Faculty[] = await fetchFaculties(authToken);
  const degrees: Degree[] = await fetchDegrees(authToken);
  const expertises: Expertise[] = await fetchExpertises(authToken);
  const user: User = await fetchUserById(authToken, id);
  let lecturer = null,
    student = null;

  if (user?.role?.id === 2) {
    lecturer = await fetchLecturerByUserId(authToken, user?.id + '');
    const lecturersExpertises = await fetchExpertisesByLecturerId(
      authToken,
      lecturer.id + ''
    );
    lecturer.expertises = lecturersExpertises.map((l: any) => l.expertise);
  }

  if (user?.role?.id === 3) {
    student = await fetchStudentByUserId(authToken, user?.id + '');
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Người dùng', href: '/dashboard/users' },
          {
            label: 'Cập nhật người dùng',
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        user={user}
        roles={roles}
        faculties={faculties}
        degrees={degrees}
        expertises={expertises}
        lecturer={lecturer}
        student={student}
      />
    </main>
  );
}

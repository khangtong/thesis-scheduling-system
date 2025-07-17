import Form from '@/app/ui/theses/edit-thesis-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchUsers,
  fetchLecturerByUserId,
  fetchStudentByUserId,
  fetchThesisById,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Lecturer, Student } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Cập nhật luận văn',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const thesis = await fetchThesisById(authToken, id);
  const users = await fetchUsers(authToken);
  let lecturers: Lecturer[] = [];
  let students: Student[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i]?.active && users[i]?.role?.name === 'GIANG_VIEN') {
      const lecturer = await fetchLecturerByUserId(
        authToken,
        users[i]?.id + ''
      );
      lecturers.push(lecturer);
    }
    if (users[i]?.active && users[i]?.role?.name === 'SINH_VIEN') {
      const student = await fetchStudentByUserId(authToken, users[i]?.id + '');
      students.push(student);
    }
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Luận văn',
            href: '/dashboard/theses',
            active: false,
          },
          {
            label: 'Cập nhật luận văn',
            href: `/dashboard/theses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form thesis={thesis} lecturers={lecturers} students={students} />
    </main>
  );
}

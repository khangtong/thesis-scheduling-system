import Form from '@/app/ui/theses/create-thesis-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';
import {
  fetchLecturerByUserId,
  fetchStudentByUserId,
  fetchTheses,
  fetchUsers,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { Lecturer, Student, Thesis } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Tạo luận văn',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const users = await fetchUsers(authToken);
  const theses: Thesis[] = await fetchTheses(authToken);
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
      // Check if the student already had a thesis
      if (theses.every((thesis) => thesis?.student?.id !== student.id))
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
            label: 'Tạo luận văn',
            href: '/dashboard/theses/create',
            active: true,
          },
        ]}
      />
      <Form lecturers={lecturers} students={students} />
    </main>
  );
}

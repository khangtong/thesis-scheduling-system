import { Metadata } from 'next';
import { getUser } from '../lib/actions';
import { cookies } from 'next/headers';
import {
  fetchExpertisesByLecturerId,
  fetchLecturerByUserId,
  fetchStudentByUserId,
} from '../lib/data';
import Form from '../ui/me/update-me-form';

export const metadata: Metadata = {
  title: 'Thông tin tài khoản',
};

export default async function Page() {
  const user = await getUser();
  const authToken = (await cookies()).get('session')?.value;
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
    <>
      <Form user={user} lecturer={lecturer} student={student} />
    </>
  );
}

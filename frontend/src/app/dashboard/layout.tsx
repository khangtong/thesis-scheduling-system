import SideNav from '../ui/dashboard/sidenav';
import { getUser } from '../lib/actions';
import { User } from '../lib/definitions';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User = await getUser();

  // Redirect to login if no user data
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav user={user} />
      </div>
      <main className="flex-grow p-3 md:overflow-y-auto">{children}</main>
    </div>
  );
}

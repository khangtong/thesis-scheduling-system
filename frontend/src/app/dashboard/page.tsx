import { redirect } from 'next/navigation';

import { getUser } from '@/app/lib/actions';
import Calendar from '../ui/dashboard/calendar';
import SideNav from '../ui/dashboard/sidenav';
import { User } from '../lib/definitions';

export default async function DashboardPage() {
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
      <main className="flex-grow p-3 md:overflow-y-auto">
        <div className="min-h-full bg-gray-100 p-4 rounded-md">
          <Calendar />
        </div>
      </main>
    </div>
  );
}

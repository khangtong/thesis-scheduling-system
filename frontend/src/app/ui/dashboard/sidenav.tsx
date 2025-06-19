import Link from 'next/link';

import NavLinks from './nav-links';
import Logo from '../logo';
import LogoutButton from '../logoutButton';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { User } from '@/app/lib/definitions';

interface SideNavProps {
  user: User;
}

export default function SideNav({ user }: SideNavProps) {
  return (
    <div className="flex h-full flex-col p-3 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="overflow-auto mb-2 flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks role={user?.role} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
      <Link
        href="/settings"
        className="mb-2 cursor-pointer flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <Cog6ToothIcon className="w-6" />
        <div className="hidden md:block">Cài đặt</div>
      </Link>
      <LogoutButton />
    </div>
  );
}

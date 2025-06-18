'use client';

import {
  UsersIcon,
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarDateRangeIcon,
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Người dùng',
    href: '/dashboard/users',
    icon: UsersIcon,
  },
  { name: 'Khoa', href: '/dashboard/faculties', icon: BookOpenIcon },
  { name: 'Học vị', href: '/dashboard/degrees', icon: AcademicCapIcon },
  { name: 'Chuyên môn', href: '/dashboard/expertises', icon: BriefcaseIcon },
  { name: 'Luận văn', href: '/dashboard/theses', icon: DocumentTextIcon },
  {
    name: 'Đợt bảo vệ',
    href: '/dashboard/defense-periods',
    icon: CalendarDateRangeIcon,
  },
  {
    name: 'Buổi bảo vệ',
    href: '/dashboard/defense-sessions',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Khung giờ',
    href: '/dashboard/time-slots',
    icon: ClockIcon,
  },
  {
    name: 'Phòng',
    href: '/dashboard/rooms',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Hội đồng',
    href: '/dashboard/defense-committees',
    icon: UserGroupIcon,
  },
  {
    name: 'Vai trò hội đồng',
    href: '/dashboard/committee-roles',
    icon: TagIcon,
  },
  {
    name: 'Thống kê',
    href: '/dashboard/statistics',
    icon: ChartBarIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

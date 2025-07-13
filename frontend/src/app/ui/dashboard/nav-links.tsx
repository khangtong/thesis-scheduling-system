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
  PencilSquareIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Role } from '@/app/lib/definitions';

interface NavLinksProps {
  role: Role;
}

export default function NavLinks({ role }: NavLinksProps) {
  const pathname = usePathname();

  let links;

  if (role?.name === 'ADMIN')
    links = [
      { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon },
      {
        name: 'Người dùng',
        href: '/dashboard/users',
        icon: UsersIcon,
      },
      {
        name: 'Xếp lịch',
        href: '/dashboard/thesis-schedules',
        icon: RectangleGroupIcon,
      },
      { name: 'Luận văn', href: '/dashboard/theses', icon: DocumentTextIcon },
      {
        name: 'Đợt bảo vệ',
        href: '/dashboard/defense-periods',
        icon: CalendarDateRangeIcon,
      },
      {
        name: 'Khung giờ',
        href: '/dashboard/time-slots',
        icon: ClockIcon,
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
      { name: 'Khoa', href: '/dashboard/faculties', icon: BookOpenIcon },
      { name: 'Học vị', href: '/dashboard/degrees', icon: AcademicCapIcon },
      {
        name: 'Chuyên môn',
        href: '/dashboard/expertises',
        icon: BriefcaseIcon,
      },
      {
        name: 'Phòng',
        href: '/dashboard/rooms',
        icon: BuildingOfficeIcon,
      },
      {
        name: 'Thống kê',
        href: '/dashboard/statistics',
        icon: ChartBarIcon,
      },
    ];
  else if (role?.name === 'GIANG_VIEN')
    links = [
      { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon },
      { name: 'Luận văn', href: '/dashboard/theses', icon: DocumentTextIcon },
      {
        name: 'Hội đồng',
        href: '/dashboard/defense-committees',
        icon: UserGroupIcon,
      },
      {
        name: 'Đăng ký lịch bận',
        href: '/dashboard/priority-schedules',
        icon: PencilSquareIcon,
      },
    ];
  else
    links = [
      { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon },
      { name: 'Luận văn', href: '/dashboard/theses', icon: DocumentTextIcon },
    ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
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

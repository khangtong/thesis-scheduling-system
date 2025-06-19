'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { logout } from '@/app/lib/actions';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const result = await logout();

      if (result.success) {
        toast.success('Đăng xuất thành công!');
        router.push('/login');
        router.refresh(); // Refresh to clear any cached data
      } else {
        toast.error('Có lỗi xảy ra khi đăng xuất');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="cursor-pointer flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Đăng xuất</div>
    </button>
  );
}

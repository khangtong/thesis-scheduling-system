'use client';

import { lexend } from '@/app/ui/fonts';
import { KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '../lib/actions';

export default function ResetPasswordForm() {
  const [state, action, isPending] = useActionState(resetPassword, undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Đang đặt lại mật khẩu...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          if (state?.success) {
            toast.success(state.message);
            // Redirect to login page after successful password reset
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state, router]);

  return (
    <form action={action} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lexend.className} mb-3 text-2xl`}>
          Đặt lại mật khẩu
        </h1>
        <p className="mb-4 text-sm text-gray-600">Nhập mật khẩu mới của bạn.</p>
        <div className="w-full mb-3">
          <input type="hidden" name="token" value={token || ''} />
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="newPassword"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Nhập mật khẩu mới"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.newPassword && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.newPassword}
            </span>
          )}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.confirmPassword && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.confirmPassword}
            </span>
          )}
        </div>
        <Button
          className="mt-4 w-full cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          Đặt lại mật khẩu{' '}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}

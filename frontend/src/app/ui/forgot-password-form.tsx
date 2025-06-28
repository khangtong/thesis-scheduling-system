'use client';

import { lexend } from '@/app/ui/fonts';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '../lib/actions';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(
    requestPasswordReset,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Đang gửi mã xác thực...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          if (state?.success) {
            toast.success(state.message);
            // Redirect to verify code page with email
            router.push(
              `/verify-reset-code?email=${encodeURIComponent(
                state.email || ''
              )}`
            );
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
        <h1 className={`${lexend.className} mb-3 text-2xl`}>Quên mật khẩu</h1>
        <p className="mb-4 text-sm text-gray-600">
          Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật
          khẩu.
        </p>
        <div className="w-full mb-3">
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.email && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.email}
            </span>
          )}
        </div>
        <Button
          className="mt-4 w-full cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          Gửi mã xác thực{' '}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </form>
  );
}

'use client';

import { lexend } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { login } from '../lib/actions';
import Link from 'next/link';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Loading...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          if (state?.success) {
            toast.success(state.message);
            router.push('/dashboard');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state]);

  return (
    <form action={action} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lexend.className} mb-3 text-2xl`}>
          Vui lòng điền đầy đủ thông tin đăng nhập.
        </h1>
        <div className="w-full mb-3">
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="emailOrUsername"
            >
              Tên tài khoản / Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="emailOrUsername"
                type="text"
                name="emailOrUsername"
                placeholder="Nhập tên tài khoản hoặc email của bạn"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.emailOrUsername && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.emailOrUsername}
            </span>
          )}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.password && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.password}
            </span>
          )}
        </div>
        <Link href="/forgot-password" className="text-sm underline">
          Quên mật khẩu?
        </Link>
        <Button
          className="mt-4 w-full cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          Đăng nhập <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}

'use client';

import { lexend } from '@/app/ui/fonts';
import { KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyResetCode } from '../lib/actions';
import Link from 'next/link';

export default function VerifyResetCodeForm() {
  const [state, action, isPending] = useActionState(verifyResetCode, undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Đang xác thực mã...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          if (state?.success) {
            toast.success(state.message);
            // Redirect to reset password page with token
            router.push(
              `/reset-password?token=${encodeURIComponent(
                state.resetToken || ''
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
        <h1 className={`${lexend.className} mb-3 text-2xl`}>Xác thực mã</h1>
        <p className="mb-4 text-sm text-gray-600">
          Chúng tôi đã gửi mã xác thực 6 chữ số đến email:{' '}
          <strong>{email}</strong>
        </p>
        <div className="w-full mb-3">
          <input type="hidden" name="email" value={email || ''} />
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="code"
            >
              Mã xác thực
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 text-center text-lg tracking-widest"
                id="code"
                type="text"
                name="code"
                placeholder="000000"
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.code && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.code}
            </span>
          )}
        </div>
        <Button
          className="mt-4 w-full cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          Xác thực <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="mt-4 text-center space-y-2">
          <Link href="/forgot-password" className="text-sm underline block">
            Gửi lại mã
          </Link>
          <Link href="/login" className="text-sm underline block">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </form>
  );
}

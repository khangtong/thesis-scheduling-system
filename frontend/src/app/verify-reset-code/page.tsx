import Logo from '../ui/logo';
import VerifyResetCodeForm from '../ui/verify-reset-code-form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Xác thực mã đặt lại mật khẩu',
};

export default function VerifyResetCodePage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Logo />
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyResetCodeForm />
        </Suspense>
      </div>
    </main>
  );
}

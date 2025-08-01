import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lexend } from '@/app/ui/fonts';
import Logo from './ui/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-3">
      <div className="md:h-52 flex shrink-0 items-end rounded-lg bg-blue-500 p-4">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lexend.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Hệ thống xếp lịch luận văn tốt nghiệp tự động.</strong> Mời
            bạn đăng nhập để sử dụng hệ thống.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Đăng nhập</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center md:w-3/5">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}

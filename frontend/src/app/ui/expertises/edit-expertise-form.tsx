'use client';

import { Expertise } from '@/app/lib/definitions';
import { Button } from '../button';
import Link from 'next/link';
import { AtSymbolIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateExpertise } from '@/app/lib/actions';

export default function Form({ expertise }: { expertise: Expertise | null }) {
  const updateExpertiseWithId = updateExpertise.bind(null, expertise?.id);
  const [state, action, isPending] = useActionState(
    updateExpertiseWithId,
    undefined
  );
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
            toast.success('Cập nhật chuyên môn thành công!');
            router.push('/dashboard/expertises');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state]);

  return (
    <form action={action} aria-describedby="form-error">
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Tên chuyên môn
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nhập tên chuyên môn"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="name-error"
                defaultValue={expertise?.name || ''}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.name && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.name}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Mô tả chuyên môn
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Nhập mô tả chuyên môn"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="description-error"
                defaultValue={expertise?.description || ''}
                required
              />
              <Bars3BottomLeftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.description && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.description}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/expertises"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật chuyên môn
        </Button>
      </div>
    </form>
  );
}

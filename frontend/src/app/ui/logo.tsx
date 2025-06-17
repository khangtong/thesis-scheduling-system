import { lusitana } from './fonts';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AcademicCapIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[40px]">Thesis Scheduling System</p>
    </div>
  );
}

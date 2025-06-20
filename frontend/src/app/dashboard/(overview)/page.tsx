import Calendar from '@/app/ui/dashboard/calendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  return (
    <div className="min-h-full bg-gray-100 p-4 rounded-md">
      <Calendar />
    </div>
  );
}

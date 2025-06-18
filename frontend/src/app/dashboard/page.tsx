import { Metadata } from 'next';
import { getUser } from '@/app/lib/actions'; // Adjust path as needed
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Component for Admin dashboard
function AdminDashboard({ user }: { user: any }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
      <p className="text-lg">Welcome, {user.username}!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p className="text-gray-600">Manage system users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">System Settings</h3>
          <p className="text-gray-600">Configure system settings</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Reports</h3>
          <p className="text-gray-600">View system reports</p>
        </div>
      </div>
    </div>
  );
}

// Component for Lecturer dashboard
function LecturerDashboard({ user }: { user: any }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold text-green-600">Lecturer Dashboard</h1>
      <p className="text-lg">Welcome back, {user.fullname}!</p>
    </div>
  );
}

// Component for Student dashboard
function StudentDashboard({ user }: { user: any }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold text-purple-600">Student Dashboard</h1>
      <p className="text-lg">Hello, {user.fullname}!</p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getUser();

  // Redirect to login if no user data
  if (!user) {
    redirect('/login');
  }

  // Render different UI based on user role
  const renderDashboard = () => {
    switch (user.role?.name) {
      case 'ADMIN':
        return <AdminDashboard user={user} />;
      case 'GIANG_VIEN':
        return <LecturerDashboard user={user} />;
      case 'SINH_VIEN':
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">{renderDashboard()}</div>
  );
}

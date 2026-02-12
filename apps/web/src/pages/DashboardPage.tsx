import { useAuth } from '@/app/auth-context';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">AI Cycling Trainer</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.firstName.capitalize()} {user?.lastName.capitalize()}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">Your training dashboard will appear here.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Next workout</h3>
            <p className="mt-2 text-gray-500">No workout scheduled</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Training load</h3>
            <p className="mt-2 text-gray-500">No data yet</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active plan</h3>
            <p className="mt-2 text-gray-500">No active plan</p>
          </div>
        </div>
      </main>
    </div>
  );
}

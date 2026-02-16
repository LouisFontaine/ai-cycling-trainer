import { AppLayout } from '@/components/AppLayout';

export function DashboardPage() {
  return (
    <AppLayout>
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
    </AppLayout>
  );
}

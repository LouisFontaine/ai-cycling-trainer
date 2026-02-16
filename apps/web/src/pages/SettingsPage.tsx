import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/AppLayout';
import {
  intervalsIcuService,
  type IntervalsIcuStatus,
} from '@/services/intervals-icu.service';

interface ConnectFormData {
  athleteId: string;
  apiKey: string;
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: status,
    isLoading,
    isError,
  } = useQuery<IntervalsIcuStatus>({
    queryKey: ['intervals-icu-status'],
    queryFn: intervalsIcuService.getConnectionStatus,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConnectFormData>();

  const connectMutation = useMutation({
    mutationFn: (data: ConnectFormData) => intervalsIcuService.connect(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['intervals-icu-status'] });
      setSuccessMessage(`Successfully connected to Intervals.icu as ${data.athleteName}!`);
      setErrorMessage(null);
      reset();
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to connect. Please check your credentials.',
      );
      setSuccessMessage(null);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: intervalsIcuService.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intervals-icu-status'] });
      setSuccessMessage('Disconnected from Intervals.icu.');
      setErrorMessage(null);
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || 'Failed to disconnect.');
      setSuccessMessage(null);
    },
  });

  const onConnect = (data: ConnectFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    connectMutation.mutate(data);
  };

  const onDisconnect = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    disconnectMutation.mutate();
  };

  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      <p className="mt-2 text-gray-600">Manage your account and integrations.</p>

      <div className="mt-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Intervals.icu</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your Intervals.icu account to sync workouts and training data.
              </p>
            </div>
            {status?.connected && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                Connected
              </span>
            )}
          </div>

          {successMessage && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          {isLoading && (
            <p className="mt-4 text-sm text-gray-500">Loading connection status...</p>
          )}

          {isError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Failed to load connection status.
            </div>
          )}

          {status?.connected && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md bg-gray-50 p-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Athlete ID</dt>
                    <dd className="text-sm text-gray-900">{status.athleteId}</dd>
                  </div>
                  {status.athleteName && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Athlete Name</dt>
                      <dd className="text-sm text-gray-900">{status.athleteName}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <button
                type="button"
                onClick={onDisconnect}
                disabled={disconnectMutation.isPending}
                className="inline-flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          )}

          {status && !status.connected && (
            <form onSubmit={handleSubmit(onConnect)} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="athleteId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Athlete ID
                </label>
                <input
                  id="athleteId"
                  type="text"
                  placeholder="i12345"
                  {...register('athleteId', {
                    required: 'Athlete ID is required',
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.athleteId && (
                  <p className="mt-1 text-sm text-red-600">{errors.athleteId.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700"
                >
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  placeholder="Your Intervals.icu API key"
                  {...register('apiKey', {
                    required: 'API Key is required',
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={connectMutation.isPending}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectMutation.isPending ? 'Connecting...' : 'Connect'}
              </button>

              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  To find your Intervals.icu credentials:
                </p>
                <ol className="mt-2 text-sm text-blue-600 list-decimal list-inside space-y-1">
                  <li>
                    Go to <strong>intervals.icu</strong> and log in
                  </li>
                  <li>Click your profile icon in the top-right corner</li>
                  <li>
                    Select <strong>Settings</strong>
                  </li>
                  <li>
                    Scroll down to <strong>Developer Settings</strong>
                  </li>
                  <li>
                    Your <strong>Athlete ID</strong> is shown at the top of the page
                    (starts with &quot;i&quot;)
                  </li>
                  <li>
                    Click <strong>Show API Key</strong> to reveal your API key
                  </li>
                </ol>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

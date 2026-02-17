import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { workoutService, IntervalType, type NextWorkout, type WorkoutInterval } from '@/services/workout.service';

const INTERVAL_TYPE_COLORS: Record<IntervalType, string> = {
  [IntervalType.REST]: 'bg-blue-300',
  [IntervalType.WARMUP]: 'bg-green-400',
  [IntervalType.COOLDOWN]: 'bg-green-400',
  [IntervalType.WORK]: 'bg-orange-500',
};

function getZoneRawColor(percent: number): string {
  if (percent <= 55) return '#93c5fd';
  if (percent <= 75) return '#4ade80';
  if (percent <= 87) return '#facc15';
  if (percent <= 95) return '#fb923c';
  if (percent <= 105) return '#ea580c';
  if (percent <= 120) return '#ef4444';
  return '#9333ea';
}

function getIntervalPower(interval: WorkoutInterval): { left: number; right: number } {
  if (interval.isRamp && interval.powerStartPercent != null && interval.powerEndPercent != null) {
    return { left: interval.powerStartPercent, right: interval.powerEndPercent };
  }
  const p = interval.powerTargetPercent ?? 0;
  return { left: p, right: p };
}

function getMaxPower(intervals: WorkoutInterval[]): number {
  let max = 0;
  for (const interval of intervals) {
    const { left, right } = getIntervalPower(interval);
    if (left > max) max = left;
    if (right > max) max = right;
  }
  return max || 100;
}

function IntervalBar({ intervals }: { intervals: WorkoutInterval[] }) {
  const totalDuration = intervals.reduce((sum, i) => sum + i.durationSeconds, 0);
  if (totalDuration === 0) return null;

  const maxPower = getMaxPower(intervals);

  return (
    <div className="mt-3">
      <div className="flex h-10 w-full items-end overflow-hidden rounded">
        {intervals.map((interval, idx) => {
          const widthPercent = (interval.durationSeconds / totalDuration) * 100;
          const { left, right } = getIntervalPower(interval);

          const leftH = left > 0 ? Math.max((left / maxPower) * 100, 15) : 15;
          const rightH = right > 0 ? Math.max((right / maxPower) * 100, 15) : 15;

          const clipPath = `polygon(0 100%, 0 ${100 - leftH}%, 100% ${100 - rightH}%, 100% 100%)`;

          const leftColor = getZoneRawColor(left || 0);
          const rightColor = getZoneRawColor(right || 0);
          const isRamp = interval.isRamp && left !== right;

          const fallbackClass = INTERVAL_TYPE_COLORS[interval.type];

          const title = interval.isRamp
            ? `${interval.type} - ${Math.round(interval.durationSeconds / 60)}min @ ${interval.powerStartPercent}% → ${interval.powerEndPercent}% FTP`
            : `${interval.type} - ${Math.round(interval.durationSeconds / 60)}min${interval.powerTargetPercent ? ` @ ${interval.powerTargetPercent}% FTP` : ''}`;

          return (
            <div
              key={idx}
              className={`min-w-[2px] h-full ${!isRamp && interval.powerTargetPercent ? '' : !isRamp ? fallbackClass : ''}`}
              style={{
                width: `${widthPercent}%`,
                clipPath,
                ...(isRamp
                  ? { background: `linear-gradient(to right, ${leftColor}, ${rightColor})` }
                  : interval.powerTargetPercent
                    ? { backgroundColor: leftColor }
                    : {}),
              }}
              title={title}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>{Math.round(totalDuration / 60)} min</span>
      </div>
    </div>
  );
}

function formatScheduledDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function WorkoutContent({ workout }: { workout: NextWorkout }) {
  return (
    <>
      <p className="mt-3 text-base font-semibold text-gray-900">{workout.name}</p>
      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span className="capitalize">{formatScheduledDate(workout.scheduledDate)}</span>
        <span>·</span>
        <span>{formatDuration(workout.durationMinutes)}</span>
      </div>
      <div className="mt-1 text-xs text-gray-400">
        {workout.type}
      </div>
      {workout.intervals.length > 0 && <IntervalBar intervals={workout.intervals} />}
    </>
  );
}

export function NextWorkoutCard() {
  const { data: workout, isLoading, isError, error } = useQuery<NextWorkout | null>({
    queryKey: ['next-workout'],
    queryFn: workoutService.getNextWorkout,
    retry: false,
  });

  const isNotConnected =
    isError && (error as any)?.response?.status === 422;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">Next workout</h3>

      {isLoading && (
        <div className="mt-3 space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-full mt-3" />
        </div>
      )}

      {isNotConnected && (
        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Connect your Intervals.icu account to see your next workout.
          </p>
          <Link
            to="/settings"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Go to Settings
          </Link>
        </div>
      )}

      {isError && !isNotConnected && (
        <p className="mt-2 text-sm text-red-500">Failed to load workout.</p>
      )}

      {!isLoading && !isError && workout === null && (
        <p className="mt-2 text-gray-500">No workout scheduled</p>
      )}

      {!isLoading && !isError && workout && <WorkoutContent workout={workout} />}
    </div>
  );
}

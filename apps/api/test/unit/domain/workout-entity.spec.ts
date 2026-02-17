import { WorkoutEntity } from '@domain/entities/workout.entity';
import { IntervalsIcuEvent } from '@domain/types/intervals-icu.types';
import { IntervalType } from '@domain/entities/workout-interval.entity';

describe('WorkoutEntity', () => {
  const baseEvent: IntervalsIcuEvent = {
    id: 1,
    name: 'Sweet Spot Intervals',
    description: '2x20min sweet spot',
    start_date_local: '2026-02-20T08:00:00',
    type: 'Ride',
    category: 'WORKOUT',
    moving_time: 5400,
    workout_doc: {
      steps: [
        { duration: 600, power: { value: 65, units: '%ftp' } },
        { duration: 1200, power: { value: 90, units: '%ftp' } },
        { duration: 300, power: { value: 50, units: '%ftp' } },
      ],
    },
  };

  describe('fromIntervalsIcuEvent()', () => {
    it('should map all fields correctly', () => {
      const workout = WorkoutEntity.fromIntervalsIcuEvent(baseEvent);

      expect(workout.name).toBe('Sweet Spot Intervals');
      expect(workout.description).toBe('2x20min sweet spot');
      expect(workout.scheduledDate).toEqual(new Date('2026-02-20T08:00:00'));
      expect(workout.type).toBe('Ride');
      expect(workout.durationMinutes).toBe(90);
      expect(workout.intervals).toHaveLength(3);
    });

    it('should map intervals with correct types', () => {
      const workout = WorkoutEntity.fromIntervalsIcuEvent(baseEvent);

      expect(workout.intervals[0].type).toBe(IntervalType.WARMUP);
      expect(workout.intervals[1].type).toBe(IntervalType.WORK);
      expect(workout.intervals[2].type).toBe(IntervalType.REST);
    });

    it('should fallback name to "Untitled Workout" when empty', () => {
      const event = { ...baseEvent, name: '' };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.name).toBe('Untitled Workout');
    });

    it('should fallback type to "Ride" when empty', () => {
      const event = { ...baseEvent, type: '' };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.type).toBe('Ride');
    });

    it('should use moving_time for duration when available', () => {
      const event = {
        ...baseEvent,
        moving_time: 3600,
        workout_doc: { duration: 7200 },
      };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.durationMinutes).toBe(60);
    });

    it('should fallback to workout_doc.duration when moving_time is missing', () => {
      const event = {
        ...baseEvent,
        moving_time: undefined,
        workout_doc: { duration: 4500 },
      };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.durationMinutes).toBe(75);
    });

    it('should return 0 duration when both sources are missing', () => {
      const event = {
        ...baseEvent,
        moving_time: undefined,
        workout_doc: undefined,
      };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.durationMinutes).toBe(0);
    });

    it('should return empty intervals when no steps', () => {
      const event = {
        ...baseEvent,
        workout_doc: { steps: undefined },
      };

      const workout = WorkoutEntity.fromIntervalsIcuEvent(event);

      expect(workout.intervals).toEqual([]);
    });
  });
});

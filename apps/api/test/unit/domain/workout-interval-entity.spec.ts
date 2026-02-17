import {
  WorkoutIntervalEntity,
  IntervalType,
} from '@domain/entities/workout-interval.entity';
import { IntervalsIcuWorkoutStep } from '@domain/types/intervals-icu.types';

describe('WorkoutIntervalEntity', () => {
  describe('fromIntervalsIcuStep()', () => {
    it('should map duration correctly', () => {
      const step: IntervalsIcuWorkoutStep = { duration: 300 };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.durationSeconds).toBe(300);
    });

    it('should default duration to 0 when missing', () => {
      const step = {} as IntervalsIcuWorkoutStep;

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.durationSeconds).toBe(0);
    });

    it('should infer REST for step without power', () => {
      const step: IntervalsIcuWorkoutStep = { duration: 120 };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.REST);
      expect(interval.powerTarget).toBeUndefined();
    });

    it('should infer REST for low power (<=55%)', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 120,
        power: { value: 50, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.REST);
      expect(interval.powerTarget?.value).toBe(50);
    });

    it('should infer WARMUP for moderate power (56-75%)', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 300,
        power: { value: 65, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.WARMUP);
    });

    it('should infer WORK for high power (>=88%)', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 1200,
        power: { value: 95, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.WORK);
      expect(interval.powerTarget?.value).toBe(95);
    });

    it('should infer COOLDOWN for mid-range power (76-87%)', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 300,
        power: { value: 80, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.COOLDOWN);
    });

    it('should infer WARMUP for ascending ramp', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 600,
        ramp: true,
        power: { start: 50, end: 75, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.WARMUP);
      expect(interval.powerTarget?.isRamp).toBe(true);
      expect(interval.powerTarget?.start).toBe(50);
      expect(interval.powerTarget?.end).toBe(75);
    });

    it('should infer COOLDOWN for descending ramp', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 600,
        ramp: true,
        power: { start: 75, end: 50, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.type).toBe(IntervalType.COOLDOWN);
      expect(interval.powerTarget?.isRamp).toBe(true);
    });

    it('should create range power target when start and end are provided without ramp', () => {
      const step: IntervalsIcuWorkoutStep = {
        duration: 1200,
        power: { start: 88, end: 94, units: '%ftp' },
      };

      const interval = WorkoutIntervalEntity.fromIntervalsIcuStep(step);

      expect(interval.powerTarget?.value).toBe(91);
      expect(interval.powerTarget?.isRamp).toBe(false);
    });
  });
});

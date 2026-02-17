import { PowerTarget } from '../value-objects/power-target.vo';
import { IntervalsIcuWorkoutStep } from '@domain/types/intervals-icu.types';

export enum IntervalType {
  WARMUP = 'WARMUP',
  WORK = 'WORK',
  REST = 'REST',
  COOLDOWN = 'COOLDOWN',
}

export class WorkoutIntervalEntity {
  constructor(
    public readonly durationSeconds: number,
    public readonly type: IntervalType,
    public readonly powerTarget?: PowerTarget,
    public readonly description?: string,
  ) {}

  static fromIntervalsIcuStep(step: IntervalsIcuWorkoutStep): WorkoutIntervalEntity {
    const powerTarget = this.buildPowerTarget(step);
    const type = this.inferType(powerTarget);

    return new WorkoutIntervalEntity(step.duration ?? 0, type, powerTarget);
  }

  private static buildPowerTarget(step: IntervalsIcuWorkoutStep): PowerTarget | undefined {
    if (!step.power) return undefined;

    if (step.ramp && step.power.start !== undefined && step.power.end !== undefined) {
      return PowerTarget.ramp(step.power.start, step.power.end);
    }

    if (step.power.start !== undefined && step.power.end !== undefined) {
      return PowerTarget.range(step.power.start, step.power.end);
    }

    if (step.power.value !== undefined) {
      return PowerTarget.fixed(step.power.value);
    }

    return undefined;
  }

  private static inferType(powerTarget?: PowerTarget): IntervalType {
    if (powerTarget?.isRamp) {
      return powerTarget.isAscending ? IntervalType.WARMUP : IntervalType.COOLDOWN;
    }

    const power = powerTarget?.value ?? 0;
    if (power <= 55) return IntervalType.REST;
    if (power <= 75) return IntervalType.WARMUP;
    if (power >= 88) return IntervalType.WORK;
    return IntervalType.COOLDOWN;
  }
}

import { IntervalsIcuEvent } from '@domain/types/intervals-icu.types';
import { WorkoutIntervalEntity } from './workout-interval.entity';

export class WorkoutEntity {
  constructor(
    public readonly name: string,
    public readonly scheduledDate: Date,
    public readonly type: string,
    public readonly durationMinutes: number,
    public readonly intervals: WorkoutIntervalEntity[],
    public readonly description?: string,
  ) {}

  static fromIntervalsIcuEvent(event: IntervalsIcuEvent): WorkoutEntity {
    const durationMinutes = event.moving_time
      ? Math.round(event.moving_time / 60)
      : event.workout_doc?.duration
        ? Math.round(event.workout_doc.duration / 60)
        : 0;

    const intervals = (event.workout_doc?.steps ?? []).map((step) =>
      WorkoutIntervalEntity.fromIntervalsIcuStep(step),
    );

    return new WorkoutEntity(
      event.name || 'Untitled Workout',
      new Date(event.start_date_local),
      event.type || 'Ride',
      durationMinutes,
      intervals,
      event.description,
    );
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { WorkoutEntity } from '@domain/entities/workout.entity';
import { WorkoutIntervalEntity, IntervalType } from '@domain/entities/workout-interval.entity';

export class WorkoutIntervalDto {
  @ApiProperty({ example: 300, description: 'Duration in seconds' })
  durationSeconds: number;

  @ApiProperty({
    example: 'WORK',
    description: 'Interval type',
    enum: IntervalType,
  })
  type: IntervalType;

  @ApiProperty({ example: 95, description: 'Target power as % of FTP', required: false })
  powerTargetPercent?: number;

  @ApiProperty({ example: 50, description: 'Ramp start power as % of FTP', required: false })
  powerStartPercent?: number;

  @ApiProperty({ example: 90, description: 'Ramp end power as % of FTP', required: false })
  powerEndPercent?: number;

  @ApiProperty({ example: true, description: 'Whether this interval is a ramp', required: false })
  isRamp?: boolean;

  static fromEntity(interval: WorkoutIntervalEntity): WorkoutIntervalDto {
    const dto = new WorkoutIntervalDto();
    dto.durationSeconds = interval.durationSeconds;
    dto.type = interval.type;
    dto.powerTargetPercent = interval.powerTarget?.value;
    dto.powerStartPercent = interval.powerTarget?.start;
    dto.powerEndPercent = interval.powerTarget?.end;
    dto.isRamp = interval.powerTarget?.isRamp || undefined;
    return dto;
  }
}

export class NextWorkoutResponseDto {
  @ApiProperty({ example: 'Sweet Spot Intervals' })
  name: string;

  @ApiProperty({ example: '2x20min sweet spot with 5min rest', required: false })
  description?: string;

  @ApiProperty({ example: '2026-02-18T00:00:00' })
  scheduledDate: string;

  @ApiProperty({ example: 'Ride' })
  type: string;

  @ApiProperty({ example: 75 })
  durationMinutes: number;

  @ApiProperty({ type: [WorkoutIntervalDto] })
  intervals: WorkoutIntervalDto[];

  static fromEntity(workout: WorkoutEntity): NextWorkoutResponseDto {
    const dto = new NextWorkoutResponseDto();
    dto.name = workout.name;
    dto.description = workout.description;
    dto.scheduledDate = workout.scheduledDate.toISOString();
    dto.type = workout.type;
    dto.durationMinutes = workout.durationMinutes;
    dto.intervals = workout.intervals.map(WorkoutIntervalDto.fromEntity);
    return dto;
  }
}

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetNextWorkoutUseCase } from '@application/use-cases/get-next-workout.use-case';
import { NextWorkoutResponseDto } from '../dtos/workout.dto';

@ApiTags('workouts')
@Controller('workout')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WorkoutController {
  constructor(private readonly getNextWorkoutUseCase: GetNextWorkoutUseCase) {}

  @Get('next')
  @ApiOperation({ summary: 'Get next planned workout from Intervals.icu' })
  @ApiResponse({ status: 200, type: NextWorkoutResponseDto, description: 'Next workout or null' })
  @ApiResponse({ status: 422, description: 'Intervals.icu not connected' })
  async getNextWorkout(@Request() req): Promise<NextWorkoutResponseDto | null> {
    const workout = await this.getNextWorkoutUseCase.execute({ userId: req.user.id });
    if (!workout) return null;
    return NextWorkoutResponseDto.fromEntity(workout);
  }
}

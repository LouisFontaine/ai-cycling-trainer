import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectIntervalsIcuRequestDto {
  @ApiProperty({ example: 'i12345', description: 'Your Intervals.icu athlete ID' })
  @IsString()
  @IsNotEmpty()
  athleteId: string;

  @ApiProperty({ example: 'abc123...', description: 'Your Intervals.icu API key' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

export class ConnectIntervalsIcuResponseDto {
  @ApiProperty({ example: 'John Doe' })
  athleteName: string;
}

export class IntervalsIcuStatusResponseDto {
  @ApiProperty({ example: true })
  connected: boolean;

  @ApiProperty({ example: 'i12345', required: false })
  athleteId?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  athleteName?: string;
}

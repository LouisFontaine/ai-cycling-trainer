import {
  Controller,
  Put,
  Delete,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConnectIntervalsIcuUseCase } from '@application/use-cases/connect-intervals-icu.use-case';
import { DisconnectIntervalsIcuUseCase } from '@application/use-cases/disconnect-intervals-icu.use-case';
import { GetIntervalsIcuStatusUseCase } from '@application/use-cases/get-intervals-icu-status.use-case';
import {
  ConnectIntervalsIcuRequestDto,
  ConnectIntervalsIcuResponseDto,
  IntervalsIcuStatusResponseDto,
} from '../dtos/intervals-icu.dto';

@ApiTags('intervals-icu')
@Controller('users/me')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly connectUseCase: ConnectIntervalsIcuUseCase,
    private readonly disconnectUseCase: DisconnectIntervalsIcuUseCase,
    private readonly getStatusUseCase: GetIntervalsIcuStatusUseCase,
  ) {}

  @Put('intervals-icu')
  @ApiOperation({ summary: 'Connect Intervals.icu account' })
  @ApiResponse({ status: 200, type: ConnectIntervalsIcuResponseDto })
  @ApiResponse({ status: 422, description: 'Invalid Intervals.icu credentials' })
  @HttpCode(HttpStatus.OK)
  async connectIntervalsIcu(
    @Request() req,
    @Body() dto: ConnectIntervalsIcuRequestDto,
  ): Promise<ConnectIntervalsIcuResponseDto> {
    return this.connectUseCase.execute({
      userId: req.user.id,
      athleteId: dto.athleteId,
      apiKey: dto.apiKey,
    });
  }

  @Delete('intervals-icu')
  @ApiOperation({ summary: 'Disconnect Intervals.icu account' })
  @ApiResponse({ status: 204, description: 'Successfully disconnected' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconnectIntervalsIcu(@Request() req): Promise<void> {
    await this.disconnectUseCase.execute({ userId: req.user.id });
  }

  @Get('intervals-icu/status')
  @ApiOperation({ summary: 'Get Intervals.icu connection status' })
  @ApiResponse({ status: 200, type: IntervalsIcuStatusResponseDto })
  async getIntervalsIcuStatus(@Request() req): Promise<IntervalsIcuStatusResponseDto> {
    return this.getStatusUseCase.execute({ userId: req.user.id });
  }
}

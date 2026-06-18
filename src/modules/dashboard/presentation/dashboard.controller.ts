import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { AuthUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { DashboardQueryDto } from '../application/dtos/dashboard-query.dto';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';
import { DashboardResponseDto } from './dashboard-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  @ApiOperation({ summary: 'Resumo financeiro do usuário autenticado' })
  @ApiOkResponse({ type: DashboardResponseDto })
  @Get()
  get(@Query() query: DashboardQueryDto, @CurrentUser() user: AuthUser) {
    return this.getDashboard.execute(query, user.id);
  }
}
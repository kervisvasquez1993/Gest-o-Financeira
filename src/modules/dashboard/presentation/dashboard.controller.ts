import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { AuthUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { DashboardQueryDto } from '../application/dtos/dashboard-query.dto';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  @Get()
  get(@Query() query: DashboardQueryDto, @CurrentUser() user: AuthUser) {
    return this.getDashboard.execute(query, user.id);
  }
}
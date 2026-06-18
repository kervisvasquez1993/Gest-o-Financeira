import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({ example: '2026-06-01', description: 'Formato YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-30', description: 'Formato YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
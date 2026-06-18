import { ApiProperty } from '@nestjs/swagger';

class TopCategoryDto {
  @ApiProperty({ example: '943a179c-d2f5-4020-a677-ff68067ace6b', format: 'uuid' })
  categoryId!: string;

  @ApiProperty({ example: 'Fornecedor' })
  categoryName!: string;

  @ApiProperty({ example: 150.5 })
  total!: number;
}

class PeriodoDto {
  @ApiProperty({ example: '2026-06-01', nullable: true })
  startDate!: string | null;

  @ApiProperty({ example: '2026-06-30', nullable: true })
  endDate!: string | null;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 2259.6 })
  saldoAtual!: number;

  @ApiProperty({ example: 2500 })
  totalEntradas!: number;

  @ApiProperty({ example: 240.4 })
  totalSaidas!: number;

  @ApiProperty({ type: [TopCategoryDto] })
  topCategoriasSaidas!: TopCategoryDto[];

  @ApiProperty({ type: PeriodoDto })
  periodo!: PeriodoDto;
}
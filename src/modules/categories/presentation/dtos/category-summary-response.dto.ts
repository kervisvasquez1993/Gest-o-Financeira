import { ApiProperty } from '@nestjs/swagger';

export class CategorySummaryResponseDto {
  @ApiProperty({ example: '943a179c-d2f5-4020-a677-ff68067ace6b', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Fornecedor' })
  name!: string;

  @ApiProperty({ example: 'Pagamentos a fornecedores', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 5 })
  transactionsCount!: number;

  @ApiProperty({ example: 0 })
  totalEntradas!: number;

  @ApiProperty({ example: 240.4 })
  totalSaidas!: number;

  @ApiProperty({ example: '2026-06-17T02:10:20.345Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-17T02:10:20.345Z' })
  updatedAt!: Date;
}
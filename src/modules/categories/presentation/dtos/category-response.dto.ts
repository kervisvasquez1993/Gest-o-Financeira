import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: '943a179c-d2f5-4020-a677-ff68067ace6b', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Fornecedor' })
  name!: string;

  @ApiProperty({ example: 'Pagamentos a fornecedores', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 'e0c7c413-f2df-4518-83fb-6517c5fd73f8', format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: '2026-06-17T02:10:20.345Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-17T02:10:20.345Z' })
  updatedAt!: Date;
}
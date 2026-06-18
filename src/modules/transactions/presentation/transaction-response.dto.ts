import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../domain/enums/transaction-type.enum';
import { CategoryResponseDto } from 'src/modules/categories/presentation/dtos/category-response.dto';


export class TransactionResponseDto {
  @ApiProperty({ example: 'e758d3f5-5ebe-43d8-9ba5-0510380a3816', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Pagamento a fornecedor' })
  description!: string;

  @ApiProperty({ example: 150.5 })
  amount!: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.SAIDA })
  type!: TransactionType;

  @ApiProperty({ example: '2026-06-16' })
  date!: string;

  @ApiProperty({ example: '943a179c-d2f5-4020-a677-ff68067ace6b', format: 'uuid' })
  categoryId!: string;

  @ApiProperty({ type: CategoryResponseDto })
  category!: CategoryResponseDto;

  @ApiProperty({ example: 'e0c7c413-f2df-4518-83fb-6517c5fd73f8', format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: '2026-06-17T02:42:34.745Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-17T02:42:34.745Z' })
  updatedAt!: Date;
}
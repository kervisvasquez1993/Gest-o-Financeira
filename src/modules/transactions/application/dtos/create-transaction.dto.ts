import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MaxLength,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateTransactionDto {
  @ApiProperty({ example: 'Pagamento a fornecedor', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @ApiProperty({ example: 150.5, description: 'Valor positivo, máx. 2 casas decimais' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.SAIDA })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({ example: '2026-06-16', description: 'Formato YYYY-MM-DD' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: '943a179c-d2f5-4020-a677-ff68067ace6b', format: 'uuid' })
  @IsUUID()
  categoryId!: string;
}
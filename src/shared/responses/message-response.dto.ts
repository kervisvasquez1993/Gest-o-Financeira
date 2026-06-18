import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: 'Categoría eliminada exitosamente.' })
  message!: string;
}
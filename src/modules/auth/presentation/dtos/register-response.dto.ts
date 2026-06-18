
import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'e0c7c413-f2df-4518-83fb-6517c5fd73f8', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Kervis' })
  name!: string;

  @ApiProperty({ example: 'kervis@test.com' })
  email!: string;
}
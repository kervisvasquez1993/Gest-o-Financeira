
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'e0c7c413-f2df-4518-83fb-6517c5fd73f8', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Kervis' })
  name!: string;

  @ApiProperty({ example: 'kervis@test.com' })
  email!: string;

  @ApiProperty({ example: '2026-06-17T02:10:20.345Z' })
  createdAt!: Date;
}
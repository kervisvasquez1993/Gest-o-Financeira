
import { ApiProperty } from '@nestjs/swagger';

class LoginUserDto {
  @ApiProperty({ example: 'e0c7c413-f2df-4518-83fb-6517c5fd73f8', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Kervis' })
  name!: string;

  @ApiProperty({ example: 'kervis@test.com' })
  email!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: LoginUserDto })
  user!: LoginUserDto;
}
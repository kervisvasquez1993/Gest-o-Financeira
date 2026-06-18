import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UserResponseDto } from './dtos/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly getUserById: GetUserByIdUseCase) {}

  @ApiOperation({ summary: 'Retornar o perfil do usuário autenticado' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const found = await this.getUserById.execute(user.id);
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      createdAt: found.createdAt,
    };
  }
}
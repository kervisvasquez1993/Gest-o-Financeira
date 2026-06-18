import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { AuthUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { UpdateCategoryDto } from '../application/dtos/update-category.dto';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../application/use-cases/delete-category.use-case';
import { GetAllCategoriesUseCase } from '../application/use-cases/get-all-categories.use-case';
import { GetCategoryByIdUseCase } from '../application/use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { GetCategoriesSummaryUseCase } from '../application/use-cases/get-categories-summary.use-case';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CategorySummaryResponseDto } from './dtos/category-summary-response.dto';
import { MessageResponseDto } from 'src/shared/responses/message-response.dto';

@ApiTags('Categories')
@ApiCreatedResponse({ type: CategoryResponseDto })
@ApiOkResponse({ type: [CategoryResponseDto] })
@ApiOkResponse({ type: [CategorySummaryResponseDto] })
@ApiOkResponse({ type: CategoryResponseDto })
@ApiOkResponse({ type: CategoryResponseDto })
@ApiOkResponse({ type: MessageResponseDto })
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly deleteCategory: DeleteCategoryUseCase,
    private readonly getAllCategories: GetAllCategoriesUseCase,
    private readonly getCategoryById: GetCategoryByIdUseCase,
    private readonly getCategoriesSummary: GetCategoriesSummaryUseCase,
  ) {}

  @ApiOperation({ summary: 'Criar uma categoria' })
  @Post()
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.createCategory.execute(dto, user.id);
  }

  @ApiOperation({ summary: 'Listar as categorias do usuário' })
  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.getAllCategories.execute(user.id);
  }

  @ApiOperation({ summary: 'Resumo das categorias com contagem e totais' })
  @Get('summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.getCategoriesSummary.execute(user.id);
  }

  @ApiOperation({ summary: 'Buscar uma categoria por ID' })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.getCategoryById.execute(id, user.id);
  }

  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updateCategory.execute(id, dto, user.id);
  }

  @ApiOperation({ summary: 'Excluir uma categoria' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.deleteCategory.execute(id, user.id);
  }
}

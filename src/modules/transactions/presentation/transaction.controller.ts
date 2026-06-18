import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { AuthUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CreateTransactionDto } from '../application/dtos/create-transaction.dto';
import { FilterTransactionsDto } from '../application/dtos/filter-transactions.dto';
import { UpdateTransactionDto } from '../application/dtos/update-transaction.dto';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../application/use-cases/delete-transaction.use-case';
import { GetTransactionByIdUseCase } from '../application/use-cases/get-transaction-by-id.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { UpdateTransactionUseCase } from '../application/use-cases/update-transaction.use-case';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly listTransactions: ListTransactionsUseCase,
    private readonly getTransactionById: GetTransactionByIdUseCase,
    private readonly updateTransaction: UpdateTransactionUseCase,
    private readonly deleteTransaction: DeleteTransactionUseCase,
  ) {}

  @ApiOperation({ summary: 'Criar uma transação' })
  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.createTransaction.execute(dto, user.id);
  }

  @ApiOperation({ summary: 'Listar transações com paginação e filtros' })
  @Get()
  findAll(@Query() filters: FilterTransactionsDto, @CurrentUser() user: AuthUser) {
    return this.listTransactions.execute(filters, user.id);
  }

  @ApiOperation({ summary: 'Buscar uma transação por ID' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.getTransactionById.execute(id, user.id);
  }

  @ApiOperation({ summary: 'Atualizar uma transação' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updateTransaction.execute(id, dto, user.id);
  }

  @ApiOperation({ summary: 'Excluir uma transação' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.deleteTransaction.execute(id, user.id);
  }
}
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../shared/database/data-source';

type TransactionType = 'entrada' | 'saida';

interface UserSeed {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface CategorySeed {
  id: string;
  name: string;
  description: string | null;
  userId: string;
}

interface TransactionSeed {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  userId: string;
}

function randomBetween(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function randomDateLast3Months(): string {
  const today = new Date();

  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  const timestamp =
    start.getTime() +
    Math.random() * (today.getTime() - start.getTime());

  return new Date(timestamp).toISOString().split('T')[0];
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function run(): Promise<void> {
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    console.log('🧹 Limpando dados existentes...');

    // Respeta FKs
    await queryRunner.query(`DELETE FROM transactions`);
    await queryRunner.query(`DELETE FROM categories`);
    await queryRunner.query(`DELETE FROM users`);

    const passwordHash = await bcrypt.hash('123456', 10);

    const users: UserSeed[] = [
      {
        id: randomUUID(),
        name: 'João Silva',
        email: 'joao@example.com',
        passwordHash,
      },
      {
        id: randomUUID(),
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        passwordHash,
      },
    ];

    console.log('👤 Criando usuários...');

    for (const user of users) {
      await queryRunner.query(
        `
        INSERT INTO users (
          id,
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3, $4)
      `,
        [user.id, user.name, user.email, user.passwordHash],
      );
    }

    const categories: CategorySeed[] = [];

    const user1Categories = [
      {
        name: 'Alimentação',
        description: 'Gastos com alimentação',
      },
      {
        name: 'Transporte',
        description: 'Combustível e deslocamento',
      },
      {
        name: 'Fornecedor',
        description: 'Pagamentos a fornecedores',
      },
      {
        name: 'Receita de Cliente',
        description: 'Recebimentos de clientes',
      },
      {
        name: 'Reembolso',
        description: 'Valores reembolsados',
      },
    ];

    const user2Categories = [
      {
        name: 'Mercado',
        description: 'Compras de supermercado',
      },
      {
        name: 'Logística',
        description: 'Custos operacionais',
      },
      {
        name: 'Serviços',
        description: 'Prestação de serviços',
      },
      {
        name: 'Vendas',
        description: 'Receitas de vendas',
      },
      {
        name: 'Investimentos',
        description: 'Aplicações e rendimentos',
      },
    ];

    for (const category of user1Categories) {
      categories.push({
        id: randomUUID(),
        name: category.name,
        description: category.description,
        userId: users[0].id,
      });
    }

    for (const category of user2Categories) {
      categories.push({
        id: randomUUID(),
        name: category.name,
        description: category.description,
        userId: users[1].id,
      });
    }

    console.log('📂 Criando categorias...');

    for (const category of categories) {
      await queryRunner.query(
        `
        INSERT INTO categories (
          id,
          name,
          description,
          user_id
        )
        VALUES ($1, $2, $3, $4)
      `,
        [
          category.id,
          category.name,
          category.description,
          category.userId,
        ],
      );
    }

    const expenseDescriptions = [
      'Pagamento de fornecedor',
      'Compra de materiais',
      'Abastecimento',
      'Almoço de equipe',
      'Compra de insumos',
      'Despesa operacional',
      'Manutenção',
      'Pagamento de frete',
      'Conta de internet',
      'Compra de equipamentos',
    ] as const;

    const incomeDescriptions = [
      'Pagamento de cliente',
      'Venda concluída',
      'Recebimento PIX',
      'Fatura recebida',
      'Receita de serviço',
      'Projeto entregue',
      'Reembolso recebido',
      'Comissão recebida',
      'Pagamento recorrente',
      'Rendimento financeiro',
    ] as const;

    const transactions: TransactionSeed[] = [];

    for (const user of users) {
      const userCategories = categories.filter(
        (category) => category.userId === user.id,
      );

      for (let i = 0; i < 25; i++) {
        const type: TransactionType =
          Math.random() > 0.45 ? 'saida' : 'entrada';

        const category = pickRandom(userCategories);

        const description =
          type === 'entrada'
            ? pickRandom(incomeDescriptions)
            : pickRandom(expenseDescriptions);

        const amount =
          type === 'entrada'
            ? randomBetween(200, 5000)
            : randomBetween(30, 2500);

        transactions.push({
          id: randomUUID(),
          description,
          amount,
          type,
          date: randomDateLast3Months(),
          categoryId: category.id,
          userId: user.id,
        });
      }
    }

    console.log('💰 Criando transações...');

    for (const transaction of transactions) {
      await queryRunner.query(
        `
        INSERT INTO transactions (
          id,
          description,
          amount,
          type,
          date,
          category_id,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          transaction.id,
          transaction.description,
          transaction.amount,
          transaction.type,
          transaction.date,
          transaction.categoryId,
          transaction.userId,
        ],
      );
    }

    await queryRunner.commitTransaction();

    console.log('✅ Seed executado com sucesso');
    console.log(`👤 Usuários: ${users.length}`);
    console.log(`📂 Categorias: ${categories.length}`);
    console.log(`💰 Transações: ${transactions.length}`);
  } catch (error) {
    await queryRunner.rollbackTransaction();

    console.error('❌ Erro ao executar seed');
    console.error(error);

    process.exitCode = 1;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void run();
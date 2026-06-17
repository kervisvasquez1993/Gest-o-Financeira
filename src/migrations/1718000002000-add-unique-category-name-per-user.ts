import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddUniqueCategoryNamePerUser1718000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'categories',
      new TableIndex({
        name: 'UQ_categories_user_id_name',
        columnNames: ['user_id', 'name'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('categories', 'UQ_categories_user_id_name');
  }
}
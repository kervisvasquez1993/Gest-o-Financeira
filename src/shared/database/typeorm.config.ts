import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from '../../config/envs';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: envs.db.host,
  port: envs.db.port,
  username: envs.db.username,
  password: envs.db.password,
  database: envs.db.name,
  autoLoadEntities: true,
  synchronize: false,
});
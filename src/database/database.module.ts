import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmConfigService } from './typeorm.service';

@Module({
  providers: [DatabaseService, TypeOrmConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
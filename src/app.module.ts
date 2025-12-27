import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { 
  AdminModule, 
  LandingModule, 
  AuthModule,
  MobileModule 
} from '@modules';
import { TypeOrmConfigService } from '@database';
import { configOptions } from '@config'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    DatabaseModule,
    AdminModule,
    LandingModule,
    AuthModule,
    MobileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
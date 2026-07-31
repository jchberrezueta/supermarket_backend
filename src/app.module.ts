import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { configOptions } from '@config';

import { TypeOrmConfigService } from '@database';

import {
  AdminModule,
  AuthModule,
  IntegrationModule,
  LandingModule,
  MobileModule,
} from '@modules';

import { AppController } from './app.controller';

import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    AdminModule,
    LandingModule,
    AuthModule,
    MobileModule,
    IntegrationModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

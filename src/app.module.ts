import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule, LandingModule, AuthModule } from '@modules';
import { configOptions } from '@config/config_options'

import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    AdminModule,
    LandingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

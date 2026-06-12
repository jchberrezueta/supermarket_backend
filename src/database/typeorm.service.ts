import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'postgres'>('db.type'),
      host: this.configService.get<string>('db.hostname'),
      port: Number(this.configService.get<number>('db.port')),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.dbname'),

      /**
       * IMPORTANTE:
       * Permite que TypeORM registre las entidades importadas con TypeOrmModule.forFeature().
       */
      autoLoadEntities: true,

      /**
       * MUY IMPORTANTE:
       * Nunca activar en este proyecto, porque podría modificar la BD real.
       */
      synchronize: false,

      /**
       * En desarrollo puedes poner true si quieres ver consultas.
       * Para trabajar limpio, lo dejamos false.
       */
      logging: false,

      extra: {
        max: 20,
      },
    };
  }
}

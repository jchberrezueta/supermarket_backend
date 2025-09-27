import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{

    constructor(private readonly configService: ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: this.configService.get('db.type'),
            host: this.configService.get('db.hostname'),
            port: this.configService.get('db.port'),
            username: this.configService.get('db.username'),
            password: this.configService.get('db.password'),
            database: this.configService.get('db.dbname'),
            loggin: false,
            maxConnections: 100,
            autoLoadEntities: false
        } as TypeOrmModuleOptions;
    }
}
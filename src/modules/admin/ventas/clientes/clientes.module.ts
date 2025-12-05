import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: []
})
export class ClientesModule {}
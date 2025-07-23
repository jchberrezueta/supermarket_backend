import { Module } from '@nestjs/common';
import { accesosController } from './accesos.controller';
import { AccesosUsuariosService } from './accesos.service';
import { DatabaseModule } from '@database';


@Module({
    imports: [DatabaseModule],
    controllers: [accesosController],
    providers: [AccesosUsuariosService],
    exports: [AccesosUsuariosService]
})
export class accesosModule {}
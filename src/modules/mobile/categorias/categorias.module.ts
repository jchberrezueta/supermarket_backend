import { Module } from '@nestjs/common';

import { MobileCategoriasController } from './categorias.controller';

import { MobileCategoriasService } from './categorias.service';

@Module({
  controllers: [MobileCategoriasController],

  providers: [MobileCategoriasService],

  exports: [MobileCategoriasService],
})
export class MobileCategoriasModule {}

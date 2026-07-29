import { Module } from '@nestjs/common';

import { MobileProductosController } from './productos.controller';

import { MobileProductosService } from './productos.service';

@Module({
  controllers: [MobileProductosController],

  providers: [MobileProductosService],

  exports: [MobileProductosService],
})
export class MobileProductosModule {}

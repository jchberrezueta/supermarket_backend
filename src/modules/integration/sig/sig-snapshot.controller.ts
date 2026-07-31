import { Controller, Get, UseGuards } from '@nestjs/common';

import { SigIntegrationKeyGuard } from './sig-integration-key.guard';

import { SigSnapshotService } from './sig-snapshot.service';

@UseGuards(SigIntegrationKeyGuard)
@Controller('integracion/sig')
export class SigSnapshotController {
  constructor(private readonly snapshotService: SigSnapshotService) {}

  @Get('snapshot')
  async getSnapshot() {
    /*
     * Se devuelve el contrato directamente,
     * sin el formato legacy del ERP.
     *
     * Go necesita versionContrato, fuente y
     * las entidades en la raíz del JSON.
     */
    return this.snapshotService.generate();
  }
}

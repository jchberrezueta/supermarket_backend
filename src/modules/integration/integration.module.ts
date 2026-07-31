import { Module } from '@nestjs/common';

import { SigIntegrationKeyGuard } from './sig/sig-integration-key.guard';

import { SigSnapshotController } from './sig/sig-snapshot.controller';

import { SigSnapshotMapper } from './sig/sig-snapshot.mapper';

import { SigSnapshotRepository } from './sig/sig-snapshot.repository';

import { SigSnapshotService } from './sig/sig-snapshot.service';

@Module({
  controllers: [SigSnapshotController],

  providers: [
    SigIntegrationKeyGuard,
    SigSnapshotRepository,
    SigSnapshotMapper,
    SigSnapshotService,
  ],
})
export class IntegrationModule {}

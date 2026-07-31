import { Injectable } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { SigSnapshotV1 } from './sig-snapshot.interface';

import { SigSnapshotMapper } from './sig-snapshot.mapper';

import { SigSnapshotRepository } from './sig-snapshot.repository';

@Injectable()
export class SigSnapshotService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly snapshotRepository: SigSnapshotRepository,

    private readonly snapshotMapper: SigSnapshotMapper,
  ) {}

  async generate(): Promise<SigSnapshotV1> {
    return this.dataSource.transaction(
      'REPEATABLE READ',

      async (manager) => {
        const source = await this.snapshotRepository.load(manager);

        return this.snapshotMapper.toSnapshot(source);
      },
    );
  }
}

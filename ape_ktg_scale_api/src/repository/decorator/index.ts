import { Inject } from '@nestjs/common';
import type { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral } from 'typeorm';
import { ENTITY_METADATA_KEY } from '../config/constants';
import { Repository } from '../config/types';
import { getDefRepositoryToken } from '../config/utils';

export function DefEntityRepository(target: EntityTarget<ObjectLiteral>) {
  return function (constructor: { new (...args: any[]): any }) {
    Reflect.defineMetadata(ENTITY_METADATA_KEY, target, constructor);
  };
}

export function InjectRepo(
  repository: Repository,
  dataSource: string | DataSource | DataSourceOptions = 'default',
) {
  return Inject(getDefRepositoryToken(repository, dataSource));
}

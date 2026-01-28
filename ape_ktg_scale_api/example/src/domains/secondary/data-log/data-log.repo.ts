import { DataLog } from './data-log.entity';
import { DefEntityRepository } from 'nestjs-typeorm3-kit';
import { BaseRepo } from '../../base.repo';

@DefEntityRepository(DataLog)
export class DataLogRepo extends BaseRepo<DataLog> {}

import { Example } from './example.entity';
import { DefEntityRepository } from 'nestjs-typeorm3-kit';
import { BaseRepo } from '../../base.repo';

@DefEntityRepository(Example)
export class ExampleRepo extends BaseRepo<Example> {}

import { Photo } from './photo.entity';
import { DefEntityRepository } from 'nestjs-typeorm3-kit';
import { BaseRepo } from '../../base.repo';

@DefEntityRepository(Photo)
export class PhotoRepo extends BaseRepo<Photo> {}

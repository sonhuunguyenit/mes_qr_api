import { Book } from './book.entity';
import { DefEntityRepository } from 'nestjs-typeorm3-kit';
import { BaseRepo } from '../../base.repo';

@DefEntityRepository(Book)
export class BookRepo extends BaseRepo<Book> {}

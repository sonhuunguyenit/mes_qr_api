import { Injectable } from '@nestjs/common';
import { ListDemoReq } from './dto';
import { DefTransaction, InjectRepo } from 'nestjs-typeorm3-kit';
import { PhotoRepo } from '~/domains/primary/photo/photo.repo';
import { BookRepo } from '~/domains/primary/book/book.repo';
import { DataLogRepo } from '~/domains/secondary/data-log/data-log.repo';
import { SECONDARY_CONNECTION } from '~/common/constants';
import { ExampleRepo } from '~/domains/secondary/example/example.repo';

@Injectable()
export class DemoService {
  constructor(
    readonly photoRepo: PhotoRepo,
    readonly bookRepo: BookRepo,

    @InjectRepo(ExampleRepo, SECONDARY_CONNECTION)
    readonly exampleRepo: ExampleRepo,

    @InjectRepo(DataLogRepo, SECONDARY_CONNECTION)
    readonly dataLogRepo: DataLogRepo,
  ) {}

  async getData(params: ListDemoReq) {
    return this.bookRepo.find(params);
  }

  @DefTransaction({ connectionName: SECONDARY_CONNECTION })
  create(body: any) {
    return this.exampleRepo.save(body);
  }
}

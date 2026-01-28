import { Injectable } from "@nestjs/common";
import { ListDemoReq } from "./dto";
import { DefTransaction, InjectRepo } from "../../../../../src";
import { PhotoRepo } from "../../../domains/primary/photo/photo.repo";
import { BookRepo } from "../../../domains/primary/book/book.repo";
import { DataLogRepo } from "../../../domains/secondary/data-log/data-log.repo";
import { SECONDARY_CONNECTION } from "../../../common/constants";

@Injectable()
export class DemoService {
  constructor(
    readonly photoRepo: PhotoRepo,
    readonly bookRepo: BookRepo,

    @InjectRepo(BookRepo, SECONDARY_CONNECTION)
    readonly exampleRepo: BookRepo,

    @InjectRepo(DataLogRepo, SECONDARY_CONNECTION)
    readonly dataLogRepo: DataLogRepo
  ) {}

  async getData(params: ListDemoReq) {
    return this.bookRepo.find(params);
  }

  @DefTransaction()
  create(body: any) {
    return this.exampleRepo.save(body);
  }
}

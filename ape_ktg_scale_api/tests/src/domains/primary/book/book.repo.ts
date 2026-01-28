import { Book } from "./book.entity";
import { DefEntityRepository } from "../../../../../src";
import { BaseRepo } from "../../base.repo";

@DefEntityRepository(Book)
export class BookRepo extends BaseRepo<Book> {}

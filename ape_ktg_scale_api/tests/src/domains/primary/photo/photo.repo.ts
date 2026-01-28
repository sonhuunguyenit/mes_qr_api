import { Photo } from "./photo.entity";
import { DefEntityRepository } from "../../../../../src";
import { BaseRepo } from "../../base.repo";

@DefEntityRepository(Photo)
export class PhotoRepo extends BaseRepo<Photo> {}

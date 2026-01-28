import { Example } from "./example.entity";
import { DefEntityRepository } from "../../../../../src";
import { BaseRepo } from "../../base.repo";

@DefEntityRepository(Example)
export class ExampleRepo extends BaseRepo<Example> {}

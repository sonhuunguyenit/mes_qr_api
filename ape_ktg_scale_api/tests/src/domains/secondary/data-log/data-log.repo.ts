import { DataLog } from "./data-log.entity";
import { DefEntityRepository } from "../../../../../src";
import { BaseRepo } from "../../base.repo";

@DefEntityRepository(DataLog)
export class DataLogRepo extends BaseRepo<DataLog> {}

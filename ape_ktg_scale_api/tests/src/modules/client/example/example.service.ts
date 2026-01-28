import { Injectable } from "@nestjs/common";
import { DefTransaction } from "../../../../../src";
import { ListExampleReq } from "./dto";

@Injectable()
export class ExampleService {
  @DefTransaction()
  async getData(params: ListExampleReq) {
    return { moduleName: "Example", data: params };
  }
}

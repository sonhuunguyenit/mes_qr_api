import { Injectable } from "@nestjs/common";

import { ListDemoReq } from "./dto";
import { DefTransaction } from "../../../../../src";

@Injectable()
export class DemoService {
  @DefTransaction()
  async getData(params: ListDemoReq) {
    return { moduleName: "Demo", data: params };
  }
}

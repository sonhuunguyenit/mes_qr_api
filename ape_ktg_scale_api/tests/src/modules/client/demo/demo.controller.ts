import { Body, Query } from "@nestjs/common";
import { DemoService } from "./demo.service";
import { ListDemoReq } from "./dto";
import { DefController, DefGet, DefPost } from "../../../../../src";

@DefController("demo")
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @DefGet("list")
  getData(@Query() params: ListDemoReq) {
    return this.demoService.getData(params);
  }

  @DefPost("list")
  create(@Body() body: any) {
    return this.demoService.create(body);
  }
}

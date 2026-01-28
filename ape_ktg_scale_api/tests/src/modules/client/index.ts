import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DemoService } from "./demo/demo.service";
import { ExampleService } from "./example/example.service";
import { ExampleController } from "./example/example.controller";
import { DemoController } from "./demo/demo.controller";
import { REFIX_MODULE } from "../config-module";
import { ChildModule } from "../../../../src";

@ChildModule({
  prefix: REFIX_MODULE.client,
  providers: [DemoService, ExampleService],
  controllers: [ExampleController, DemoController],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}

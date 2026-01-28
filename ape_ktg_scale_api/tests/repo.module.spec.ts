import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";

import { AppModule } from "./src/app.module";
import { DemoService } from "./src/modules/client/demo/demo.service";

describe("DefRepositoryModule", () => {
  let demoService: DemoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    demoService = module.get<DemoService>(DemoService);
  });

  it("Inject default connect", async () => {
    expect(demoService.bookRepo).toBeInstanceOf(Repository);
    expect(await demoService.getData({})).toEqual(expect.arrayContaining([]));
  });

  it("Inject specific connection", async () => {
    expect(demoService.exampleRepo).toBeInstanceOf(Repository);
    expect(await demoService.create({})).toEqual(expect.objectContaining({}));
  });
});

import { DefController, DefGet } from 'nestjs-typeorm3-kit';
import { Query } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ListDemoReq } from './dto';

@DefController('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @DefGet('list')
  getData(@Query() params: ListDemoReq) {
    return this.demoService.getData(params);
  }
}

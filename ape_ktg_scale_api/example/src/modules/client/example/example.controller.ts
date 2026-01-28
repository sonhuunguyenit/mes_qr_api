import { Query } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ListExampleReq } from './dto';
import { DefController, DefGet } from 'nestjs-typeorm3-kit';
@DefController('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @DefGet('')
  getData(@Query() params: ListExampleReq) {
    return this.exampleService.getData(params);
  }
}

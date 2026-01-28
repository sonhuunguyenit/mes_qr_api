import { DefController, DefGet } from 'nestjs-typeorm3-kit';
import { Query } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ListExampleReq } from './dto';

@DefController('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @DefGet('')
  getData(@Query() params: ListExampleReq) {
    return this.exampleService.getData(params);
  }
}

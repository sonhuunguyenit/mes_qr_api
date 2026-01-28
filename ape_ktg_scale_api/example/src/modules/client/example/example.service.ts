import { Injectable } from '@nestjs/common';
import { DefTransaction } from 'nestjs-typeorm3-kit';
import { ListExampleReq } from './dto';

@Injectable()
export class ExampleService {
  @DefTransaction()
  async getData(params: ListExampleReq) {
    return { moduleName: 'Example', data: params };
  }
}

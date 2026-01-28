import { Injectable } from '@nestjs/common';

import { ListDemoReq } from './dto';
import { DefTransaction } from 'nestjs-typeorm3-kit';

@Injectable()
export class DemoService {
  @DefTransaction()
  async getData(params: ListDemoReq) {
    return { moduleName: 'Demo', data: params };
  }
}

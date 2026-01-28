import { Module } from '@nestjs/common';
import { databases } from './databases';
import * as allModules from './modules';

const modules = Object.values(allModules);
@Module({
  imports: [...databases, ...modules],
})
export class AppModule {}

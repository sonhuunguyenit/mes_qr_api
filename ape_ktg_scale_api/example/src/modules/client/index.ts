import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DemoService } from './demo/demo.service';
import { ExampleService } from './example/example.service';
import { ExampleController } from './example/example.controller';
import { DemoController } from './demo/demo.controller';
import { REFIX_MODULE } from '../config-module';
import { ChildModule } from 'nestjs-typeorm3-kit';
import { PrimaryRepoModule } from '~/domains/primary/primary-repo.module';
import { SecondaryRepoModule } from '~/domains/secondary/secondary-repo.module';

@ChildModule({
  prefix: REFIX_MODULE.client,
  imports: [PrimaryRepoModule, SecondaryRepoModule],
  providers: [DemoService, ExampleService],
  controllers: [ExampleController, DemoController],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}

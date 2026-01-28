import { Module } from '@nestjs/common';
import { join } from 'path';

import { PRIMARY_CONNECTION } from '~/common/constants';
import { DefRepositoryModule } from 'nestjs-typeorm3-kit';
@Module({
  imports: [
    DefRepositoryModule.forRootAsync({
      useFactory: () => ({
        globPattern: join(__dirname, './**/*.repo.{ts,js}'),
        dataSource: PRIMARY_CONNECTION,
      }),
    }),
  ],
  exports: [DefRepositoryModule],
})
export class PrimaryRepoModule {}

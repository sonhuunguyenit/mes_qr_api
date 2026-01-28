import { Module } from "@nestjs/common";
import { join } from "path";
import { DefRepositoryModule } from "../../../../src";
import { SECONDARY_CONNECTION } from "../../common/constants";
@Module({
  imports: [
    DefRepositoryModule.forRootAsync({
      useFactory: () => ({
        globPattern: join(__dirname, "../**/*.repo.{ts,js}"),
        dataSource: SECONDARY_CONNECTION,
      }),
    }),
  ],
  exports: [DefRepositoryModule],
})
export class SecondaryRepoModule {}

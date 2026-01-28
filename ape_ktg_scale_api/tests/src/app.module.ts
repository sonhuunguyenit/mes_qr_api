import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

import { PRIMARY_CONNECTION, SECONDARY_CONNECTION } from "./common/constants";
import * as allModules from "./modules";

const modules = Object.values(allModules);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: PRIMARY_CONNECTION, // primary connection
      type: "postgres",
      host: "0.0.0.0",
      port: 5134,
      username: "root",
      password: "root",
      database: "test",
      entities: [join(__dirname, "./**/*.entity.{ts,js}")],
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    TypeOrmModule.forRoot({
      name: SECONDARY_CONNECTION, // secondary connection
      type: "postgres",
      host: "0.0.0.0",
      port: 5134,
      username: "root",
      password: "root",
      database: "test",
      entities: [join(__dirname, "./**/*.entity.{ts,js}")],
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    ...modules,
  ],
})
export class AppModule {}

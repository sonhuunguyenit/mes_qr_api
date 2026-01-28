import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { setupTransactionContext } from 'nestjs-typeorm3-kit';
import { INestApplication } from '@nestjs/common';

const configSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('SWAGGER_TITLE')
    .setDescription('SWAGGER_DESCRIPTION')
    .setVersion('SWAGGER_VERSION')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app as any, options, {
    // extraModels: [PageResponse]
  });

  // Creating all the swagger schemas based on the class-validator decorators
  const metadatas = (getFromContainer(MetadataStorage) as any)
    .validationMetadatas;
  const targetSchemas = document.components.schemas || {};
  const schemasBinding = validationMetadatasToSchemas(metadatas) || {};

  Object.keys(schemasBinding).forEach((key) => {
    const value = schemasBinding[key] as SchemasObject;
    if (!targetSchemas[key]) {
      Object.assign(targetSchemas, { key: value });
    } else {
      const targetValue = targetSchemas[key] as SchemasObject;

      Object.assign(targetValue.properties, value.properties);
      targetValue.required = value.required;
      Object.assign(targetSchemas, { key: targetValue });
    }
  });
  document.components.schemas = Object.assign({}, targetSchemas);
  SwaggerModule.setup('swagger', app as any, document);
};

async function bootstrap() {
  setupTransactionContext();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors({ origin: '*' });
  configSwagger(app);
  await app.listen(port);
  console.log(
    `Server start on port ${port}. Open http://localhost:${port} to see results`,
  );
  console.log(`API DOCUMENT Open http://localhost:${port}/swagger`);
  console.log(`API DOCUMENT JSON Open http://localhost:${port}/swagger-json`);
  console.log('TIMEZONE: ', process.env.TZ);
}
bootstrap();

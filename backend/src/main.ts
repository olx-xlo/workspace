/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { StockModule } from './stock/stock.module';

async function bootstrap() {
  const app = await NestFactory.create(StockModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Stock backend is running on: http://localhost:${port}/${globalPrefix}`
  );

  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
    methods: 'GET',
  });
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Handle CORS.
  app.enableCors();

  // Handle validation pipeline for payload.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Give prefix for API endpoints.
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);
}
bootstrap();

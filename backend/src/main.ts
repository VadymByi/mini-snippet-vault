import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  console.log('🚀 Starting server...');
  const port = Number(process.env.PORT);
  console.log('✅ Server started');

  await app.listen(port, '0.0.0.0');
}
bootstrap();

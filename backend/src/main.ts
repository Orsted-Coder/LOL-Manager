import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS để frontend Next.js (port 3000) có thể gọi API backend (port 3001)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Dùng ValidationPipe để tự động validate DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Đặt tiền tố /api cho tất cả các route
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 LOL Manager Backend đang chạy tại: http://localhost:${port}/api`);
}
bootstrap();

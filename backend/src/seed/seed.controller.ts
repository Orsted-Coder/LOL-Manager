import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // POST /api/seed - Gọi endpoint này để khởi tạo dữ liệu mẫu
  @Post()
  seed() {
    return this.seedService.seed();
  }
}

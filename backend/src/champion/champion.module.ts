import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from './champion.entity';
import { ChampionService } from './champion.service';
import { ChampionController } from './champion.controller';

@Module({
  // Đăng ký entity Champion để TypeORM tạo bảng trong database
  imports: [TypeOrmModule.forFeature([Champion])],
  controllers: [ChampionController],
  providers: [ChampionService],
  // Export service để SeedModule có thể dùng
  exports: [ChampionService],
})
export class ChampionModule {}

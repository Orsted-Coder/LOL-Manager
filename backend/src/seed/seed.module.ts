import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from '../champion/champion.entity';
import { Player } from '../player/player.entity';
import { Item } from '../item/item.entity';
import { Team } from '../team/team.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    // Đăng ký tất cả entity cần thiết cho seed
    TypeOrmModule.forFeature([Champion, Player, Item, Team]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ChampionModule } from './champion/champion.module';
import { PlayerModule } from './player/player.module';
import { ItemModule } from './item/item.module';
import { TeamModule } from './team/team.module';
import { SeedModule } from './seed/seed.module';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [
    // Tải biến môi trường từ file .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Cache toàn cục: Redis nếu có REDIS_HOST, ngược lại dùng in-memory
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const ttl = 5 * 60 * 1000; // 5 phút (milliseconds)
        const redisHost = process.env.REDIS_HOST;
        if (redisHost) {
          const { redisStore } = await import('cache-manager-redis-yet');
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            ttl,
          });
          return { store, ttl };
        }
        // Fallback: in-memory cache
        return { ttl };
      },
    }),

    // Kết nối PostgreSQL qua TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'lol_manager',
      // Tự động tạo/cập nhật bảng dựa theo entity (chỉ dùng trong dev)
      synchronize: true,
      // Tự động tìm và load tất cả entity từ thư mục src
      autoLoadEntities: true,
      logging: false,
    }),

    // Các module tính năng
    ChampionModule,
    PlayerModule,
    ItemModule,
    TeamModule,
    SeedModule,
    MatchModule,
    TournamentModule,
    TransferModule,
  ],
})
export class AppModule {}

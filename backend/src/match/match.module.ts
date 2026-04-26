import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Team } from '../team/team.entity';
import { Player } from '../player/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team, Player])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}

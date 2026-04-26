import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './tournament.entity';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { Team } from '../team/team.entity';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Team]), MatchModule],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferOffer } from './transfer-offer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransferOffer, Player, Team])],
  providers: [TransferService],
  controllers: [TransferController],
  exports: [TransferService],
})
export class TransferModule {}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';
import { Player } from '../player/player.entity';

export type OfferStatus = 'pending' | 'accepted' | 'rejected';

@Entity('transfer_offers')
export class TransferOffer {
  @PrimaryGeneratedColumn()
  id: number;

  // Đội đề nghị mua
  @ManyToOne(() => Team, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'from_team_id' })
  fromTeam: Team;

  @Column({ name: 'from_team_id' })
  fromTeamId: number;

  // Đội đang sở hữu tuyển thủ (null nếu tuyển thủ tự do)
  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'to_team_id' })
  toTeam: Team | null;

  @Column({ name: 'to_team_id', nullable: true })
  toTeamId: number | null;

  // Tuyển thủ được đề nghị mua
  @ManyToOne(() => Player, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'player_id' })
  playerId: number;

  // Phí chuyển nhượng đề nghị (USD)
  @Column({ type: 'int' })
  amount: number;

  // Trạng thái: chờ / chấp nhận / từ chối
  @Column({ type: 'varchar', default: 'pending' })
  status: OfferStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

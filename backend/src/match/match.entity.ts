import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';

export type MatchFormat = 'bo1' | 'bo3' | 'bo5';

// Một sự kiện trong trận đấu (kill, dragon, baron, ...)
export interface MatchEvent {
  time: number; // phút
  type: 'FIRST_BLOOD' | 'DRAGON' | 'BARON' | 'TOWER' | 'INHIBITOR' | 'NEXUS' | 'KILL';
  teamSide: 1 | 2; // đội nào thực hiện
  playerName?: string; // tuyển thủ thực hiện (nếu có)
  description: string; // mô tả sự kiện
}

// Log chi tiết một ván đấu
export interface GameLog {
  gameNumber: number;
  winningSide: 1 | 2;
  duration: number; // phút
  team1Kills: number;
  team2Kills: number;
  team1PowerScore: number;
  team2PowerScore: number;
  events: MatchEvent[];
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, { nullable: false, eager: true })
  @JoinColumn({ name: 'team1_id' })
  team1: Team;

  @Column({ name: 'team1_id' })
  team1Id: number;

  @ManyToOne(() => Team, { nullable: false, eager: true })
  @JoinColumn({ name: 'team2_id' })
  team2: Team;

  @Column({ name: 'team2_id' })
  team2Id: number;

  @ManyToOne(() => Team, { nullable: true, eager: true })
  @JoinColumn({ name: 'winner_id' })
  winner: Team;

  @Column({ name: 'winner_id', nullable: true })
  winnerId: number;

  // Định dạng trận: Bo1, Bo3, Bo5
  @Column({ type: 'varchar', default: 'bo1' })
  format: MatchFormat;

  // Số ván thắng của mỗi đội
  @Column({ name: 'team1_score', type: 'int', default: 0 })
  team1Score: number;

  @Column({ name: 'team2_score', type: 'int', default: 0 })
  team2Score: number;

  // Điểm sức mạnh tổng hợp
  @Column({ name: 'team1_power', type: 'float', default: 0 })
  team1Power: number;

  @Column({ name: 'team2_power', type: 'float', default: 0 })
  team2Power: number;

  // Log chi tiết từng ván đấu (lưu dạng JSON)
  @Column({ name: 'match_log', type: 'jsonb', default: [] })
  matchLog: GameLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

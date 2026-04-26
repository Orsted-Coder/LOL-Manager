import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';
import { MatchFormat } from '../match/match.entity';

export type TournamentStatus = 'pending' | 'ongoing' | 'completed';

// Một trận đấu trong lịch thi đấu giải
export interface TournamentMatch {
  round: number;
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  matchId?: number;       // ID trận đấu đã mô phỏng (nếu đã thi đấu)
  winnerId?: number;
  winnerName?: string;
  team1Score?: number;
  team2Score?: number;
  status: 'pending' | 'completed';
}

// Thứ hạng của từng đội trong giải
export interface TournamentStanding {
  teamId: number;
  teamName: string;
  primaryColor: string;
  secondaryColor: string;
  wins: number;
  losses: number;
  points: number;        // 3 điểm mỗi chiến thắng (theo chuẩn Esports)
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  // Tên giải đấu
  @Column({ length: 150 })
  name: string;

  // Trạng thái giải: chưa bắt đầu / đang diễn ra / đã kết thúc
  @Column({ type: 'varchar', default: 'pending' })
  status: TournamentStatus;

  // Định dạng trận đấu trong giải (Bo1 / Bo3 / Bo5)
  @Column({ name: 'match_format', type: 'varchar', default: 'bo1' })
  matchFormat: MatchFormat;

  // Các đội tham gia giải (many-to-many)
  @ManyToMany(() => Team, { eager: true })
  @JoinTable({
    name: 'tournament_teams',
    joinColumn: { name: 'tournament_id' },
    inverseJoinColumn: { name: 'team_id' },
  })
  teams: Team[];

  // Lịch thi đấu: mảng các cặp đấu theo vòng round-robin
  @Column({ type: 'jsonb', default: [] })
  schedule: TournamentMatch[];

  // Bảng xếp hạng hiện tại
  @Column({ type: 'jsonb', default: [] })
  standings: TournamentStanding[];

  // Đội vô địch (nếu đã kết thúc)
  @Column({ name: 'winner_id', nullable: true })
  winnerId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

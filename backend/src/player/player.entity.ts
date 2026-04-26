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

// Vị trí thi đấu của tuyển thủ
export enum PlayerRole {
  TOP = 'TopLane',
  JUNGLE = 'Jungle',
  MID = 'MidLane',
  ADC = 'ADC',
  SUPPORT = 'Support',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  // Tên tuyển thủ - có thể tùy chỉnh để tránh bản quyền
  @Column({ length: 100 })
  name: string;

  // Ảnh đại diện - có thể tùy chỉnh
  @Column({ nullable: true })
  imageUrl: string;

  // Tuổi tuyển thủ
  @Column({ type: 'int', default: 20 })
  age: number;

  // Quốc tịch
  @Column({ length: 50, default: 'Vietnam' })
  nationality: string;

  // Vị trí chính
  @Column({ name: 'main_role', type: 'enum', enum: PlayerRole })
  mainRole: PlayerRole;

  // Chỉ số tổng thể (1-100)
  @Column({ type: 'int', default: 60 })
  ovr: number;

  // Tiềm năng tối đa (1-100)
  @Column({ type: 'int', default: 70 })
  potential: number;

  // ===== KỸ NĂNG KỸ THUẬT (1-20) =====

  @Column({ type: 'int', default: 10 })
  mechanics: number;

  @Column({ type: 'int', default: 10 })
  laning: number;

  @Column({ type: 'int', default: 10 })
  farming: number;

  @Column({ type: 'int', default: 10 })
  teamfighting: number;

  @Column({ type: 'int', default: 10 })
  versatility: number;

  // Đặc biệt quan trọng cho ADC: di chuyển giữa đòn đánh, né chiêu
  @Column({ type: 'int', default: 10 })
  kiting: number;

  // Quan trọng cho Rừng: tranh cướp mục tiêu lớn
  @Column({ type: 'int', default: 10 })
  smite: number;

  // Kiểm soát tầm nhìn bản đồ
  @Column({ name: 'vision_control', type: 'int', default: 10 })
  visionControl: number;

  // ===== KHẢ NĂNG TƯ DUY & TINH THẦN (1-20) =====

  @Column({ name: 'map_awareness', type: 'int', default: 10 })
  mapAwareness: number;

  @Column({ type: 'int', default: 10 })
  positioning: number;

  @Column({ name: 'decision_making', type: 'int', default: 10 })
  decisionMaking: number;

  // Khả năng dẫn dắt đội
  @Column({ type: 'int', default: 10 })
  shotcalling: number;

  // Tính hung hăng, chủ động giao tranh
  @Column({ type: 'int', default: 10 })
  aggression: number;

  // Bình tĩnh khi bị dẫn trước
  @Column({ type: 'int', default: 10 })
  composure: number;

  // Đọc vị rừng địch
  @Column({ type: 'int', default: 10 })
  anticipation: number;

  // Dám mở giao tranh tạo đột biến
  @Column({ type: 'int', default: 10 })
  bravery: number;

  // Tần suất bỏ đường đi hỗ trợ
  @Column({ type: 'int', default: 10 })
  roaming: number;

  // ===== THỂ CHẤT & CHỈ SỐ ẨN (1-20) =====

  @Column({ name: 'reaction_time', type: 'int', default: 10 })
  reactionTime: number;

  // Actions per minute - giới hạn trần của Mechanics
  @Column({ type: 'int', default: 10 })
  apm: number;

  // Thể lực cho Bo5
  @Column({ type: 'int', default: 10 })
  stamina: number;

  @Column({ name: 'natural_fitness', type: 'int', default: 10 })
  naturalFitness: number;

  // Độ ổn định phong độ
  @Column({ type: 'int', default: 10 })
  consistency: number;

  // Buff trong trận lớn
  @Column({ name: 'important_matches', type: 'int', default: 10 })
  importantMatches: number;

  // Dễ chấn thương
  @Column({ name: 'injury_proneness', type: 'int', default: 5 })
  injuryProneness: number;

  // Thích nghi meta/đội mới nhanh
  @Column({ type: 'int', default: 10 })
  adaptability: number;

  // Thái độ chuyên nghiệp
  @Column({ type: 'int', default: 10 })
  professionalism: number;

  // Độ trung thành với đội
  @Column({ type: 'int', default: 10 })
  loyalty: number;

  // Lương hàng năm (USD)
  @Column({ type: 'int', default: 60000 })
  salary: number;

  // ===== PHASE 4: TRANSFER MARKET =====

  // Có đang được rao bán trên thị trường không
  @Column({ name: 'is_transfer_listed', type: 'boolean', default: false })
  isTransferListed: boolean;

  // Phí chuyển nhượng yêu cầu (USD)
  @Column({ name: 'transfer_fee', type: 'int', default: 0 })
  transferFee: number;

  // Mùa giải hết hạn hợp đồng (0 = tự do)
  @Column({ name: 'contract_end_season', type: 'int', default: 2 })
  contractEndSeason: number;

  // Quan hệ nhiều-một với Team (nhiều tuyển thủ thuộc một đội)
  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'team_id', nullable: true })
  teamId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

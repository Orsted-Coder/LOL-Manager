import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Các khu vực thi đấu Esports
export enum Region {
  LCK = 'LCK',    // Hàn Quốc
  LPL = 'LPL',    // Trung Quốc
  LEC = 'LEC',    // Châu Âu
  LCS = 'LCS',    // Bắc Mỹ
  LCP = 'LCP',    // Thái Bình Dương (VCS, PCS, ...)
  VCS = 'VCS',    // Việt Nam
  CBLOL = 'CBLOL', // Brazil
}

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  // Tên đội - có thể tùy chỉnh để tránh bản quyền
  @Column({ length: 100 })
  name: string;

  // Logo đội - có thể tùy chỉnh
  @Column({ nullable: true })
  imageUrl: string;

  // Khu vực thi đấu
  @Column({ type: 'enum', enum: Region, default: Region.VCS })
  region: Region;

  // Ngân sách hoạt động (USD)
  @Column({ type: 'bigint', default: 1000000 })
  budget: number;

  // Danh tiếng (1-100): ảnh hưởng đến khả năng mua sao và doanh thu
  @Column({ type: 'int', default: 50 })
  reputation: number;

  // Cấp phòng tập (1-5): tăng tốc độ phát triển của tuyển thủ trẻ
  @Column({ name: 'training_room_level', type: 'int', default: 1 })
  trainingRoomLevel: number;

  // Cấp học viện (1-5): tỉ lệ sinh ra tài năng trẻ
  @Column({ name: 'academy_level', type: 'int', default: 1 })
  academyLevel: number;

  // Tổng quỹ lương đang chi (tính từ contracts)
  @Column({ name: 'total_salary', type: 'bigint', default: 0 })
  totalSalary: number;

  // Màu chủ đạo của đội (dùng cho UI)
  @Column({ name: 'primary_color', nullable: true, default: '#1a1a2e' })
  primaryColor: string;

  @Column({ name: 'secondary_color', nullable: true, default: '#e94560' })
  secondaryColor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

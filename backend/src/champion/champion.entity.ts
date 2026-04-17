import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Enum loại sát thương của tướng
export enum DamageType {
  PHYSICAL = 'Physical',
  MAGIC = 'Magic',
  MIXED = 'Mixed',
}

// Enum các vai trò trong game
export enum ChampionRole {
  TOP = 'TopLane',
  JUNGLE = 'Jungle',
  MID = 'MidLane',
  ADC = 'ADC',
  SUPPORT = 'Support',
}

// Enum các tag chiến thuật (dùng để ghép đội hình)
export enum SynergyTag {
  DIVE = 'Dive',
  POKE = 'Poke',
  PROTECT = 'Protect',
  PICK = 'Pick',
  TEAMFIGHT = 'Teamfight',
}

@Entity('champions')
export class Champion {
  @PrimaryGeneratedColumn()
  id: number;

  // Tên tướng - có thể tùy chỉnh để tránh bản quyền
  @Column({ length: 100 })
  name: string;

  // Đường dẫn ảnh - có thể tùy chỉnh
  @Column({ nullable: true })
  imageUrl: string;

  // ===== NHÓM 1: Chỉ số cơ bản & tăng trưởng =====

  // Máu
  @Column({ type: 'float', default: 500 })
  hp: number;

  @Column({ name: 'hp_per_level', type: 'float', default: 85 })
  hpPerLevel: number;

  // Mana/Năng lượng
  @Column({ type: 'float', default: 300 })
  mp: number;

  @Column({ name: 'mp_per_level', type: 'float', default: 40 })
  mpPerLevel: number;

  // Giáp
  @Column({ type: 'float', default: 28 })
  armor: number;

  @Column({ name: 'armor_per_level', type: 'float', default: 4 })
  armorPerLevel: number;

  // Kháng phép
  @Column({ name: 'spell_block', type: 'float', default: 30 })
  spellBlock: number;

  @Column({ name: 'mr_per_level', type: 'float', default: 1.3 })
  mrPerLevel: number;

  // Sát thương vật lý
  @Column({ name: 'attack_damage', type: 'float', default: 55 })
  attackDamage: number;

  @Column({ name: 'ad_per_level', type: 'float', default: 3 })
  adPerLevel: number;

  // Tốc độ đánh (đòn/giây)
  @Column({ name: 'attack_speed', type: 'float', default: 0.65 })
  attackSpeed: number;

  @Column({ name: 'as_per_level', type: 'float', default: 2 })
  asPerLevel: number;

  // Tầm đánh (125 = cận chiến, 500+ = tầm xa)
  @Column({ name: 'attack_range', type: 'float', default: 175 })
  attackRange: number;

  // Tốc độ di chuyển
  @Column({ name: 'move_speed', type: 'float', default: 340 })
  moveSpeed: number;

  // Hồi máu/giây
  @Column({ name: 'hp_regen', type: 'float', default: 6 })
  hpRegen: number;

  // Hồi mana/giây
  @Column({ name: 'mp_regen', type: 'float', default: 8 })
  mpRegen: number;

  // ===== NHÓM 2: Chỉ số kỹ năng & thuộc tính =====

  @Column({
    name: 'damage_type',
    type: 'enum',
    enum: DamageType,
    default: DamageType.PHYSICAL,
  })
  damageType: DamageType;

  // Khả năng dồn sát thương trong 2-3 giây
  @Column({ name: 'burst_potential', type: 'int', default: 5 })
  burstPotential: number;

  // Sát thương duy trì theo thời gian
  @Column({ name: 'dps_potential', type: 'int', default: 5 })
  dpsPotential: number;

  // Khả năng dọn lính nhanh
  @Column({ name: 'waveclear_score', type: 'int', default: 5 })
  waveclearScore: number;

  // Khống chế cứng (choáng, trói, hất tung)
  @Column({ name: 'hard_cc', type: 'int', default: 0 })
  hardCC: number;

  // Khống chế mềm (làm chậm, câm lặng)
  @Column({ name: 'soft_cc', type: 'int', default: 0 })
  softCC: number;

  // Khả năng hồi máu/tạo khiên
  @Column({ name: 'heal_shield_power', type: 'int', default: 0 })
  healShieldPower: number;

  // Tần suất xả chiêu (càng cao = chiêu hồi càng nhanh)
  @Column({ name: 'cooldown_ratio', type: 'int', default: 10 })
  cooldownRatio: number;

  // ===== NHÓM 3: Chỉ số vai trò (1-10, tổng hợp) =====

  // Sát thương đầu ra (0-10)
  @Column({ type: 'float', default: 5 })
  damage: number;

  // Khả năng chống chịu (0-10)
  @Column({ type: 'float', default: 5 })
  durability: number;

  // Khống chế teamfight (0-10)
  @Column({ name: 'crowd_control', type: 'float', default: 5 })
  crowdControl: number;

  // Độ cơ động (0-10)
  @Column({ type: 'float', default: 5 })
  mobility: number;

  // Hỗ trợ gián tiếp (0-10)
  @Column({ type: 'float', default: 5 })
  utility: number;

  // Độ khó chơi (1-10)
  @Column({ type: 'int', default: 5 })
  difficulty: number;

  // ===== NHÓM 4: Vai trò & tag =====

  // Danh sách vai trò tướng có thể chơi
  @Column({
    type: 'simple-array',
    default: ChampionRole.MID,
  })
  roles: string[];

  // Tag chiến thuật để ghép đội hình
  @Column({
    name: 'synergy_tags',
    type: 'simple-array',
    nullable: true,
  })
  synergyTags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

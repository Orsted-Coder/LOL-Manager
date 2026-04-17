import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Phân loại tag của trang bị
export enum ItemTag {
  OFFENSE = 'Offense',
  DEFENSE = 'Defense',
  UTILITY = 'Utility',
  JUNGLE = 'Jungle',
  BOOTS = 'Boots',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  // Tên trang bị - có thể tùy chỉnh để tránh bản quyền
  @Column({ length: 100 })
  name: string;

  // Ảnh trang bị
  @Column({ nullable: true })
  imageUrl: string;

  // Giá chuẩn hóa (mặc định 3500 vàng)
  @Column({ type: 'int', default: 3500 })
  price: number;

  // Tags phân loại
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  // ===== CHỈ SỐ CỘNG THÊM =====

  @Column({ type: 'int', default: 0 })
  ad: number;      // Sát thương vật lý

  @Column({ type: 'int', default: 0 })
  ap: number;      // Sức mạnh phép thuật

  @Column({ type: 'int', default: 0 })
  armor: number;   // Giáp

  @Column({ type: 'int', default: 0 })
  mr: number;      // Kháng phép

  @Column({ type: 'int', default: 0 })
  hp: number;      // Máu

  @Column({ type: 'int', default: 0 })
  mana: number;    // Mana

  @Column({ type: 'float', default: 0 })
  attackSpeed: number; // Tốc độ đánh (%)

  @Column({ type: 'float', default: 0 })
  critChance: number;  // Tỉ lệ chí mạng (%)

  @Column({ type: 'int', default: 0 })
  haste: number;   // Giảm hồi chiêu (Ability Haste)

  // Hiệu ứng đặc biệt (mô tả bằng text)
  @Column({ type: 'text', nullable: true })
  rule: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

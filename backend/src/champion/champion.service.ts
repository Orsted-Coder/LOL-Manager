import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Champion } from './champion.entity';
import { CreateChampionDto, UpdateChampionDto } from './champion.dto';

@Injectable()
export class ChampionService {
  constructor(
    // Inject repository TypeORM để thao tác với bảng champions
    @InjectRepository(Champion)
    private readonly championRepo: Repository<Champion>,
  ) {}

  // Lấy tất cả tướng
  async findAll(): Promise<Champion[]> {
    return this.championRepo.find({ order: { name: 'ASC' } });
  }

  // Lấy 1 tướng theo id
  async findOne(id: number): Promise<Champion> {
    const champion = await this.championRepo.findOne({ where: { id } });
    if (!champion) {
      throw new NotFoundException(`Không tìm thấy tướng với id: ${id}`);
    }
    return champion;
  }

  // Tạo mới tướng
  async create(dto: CreateChampionDto): Promise<Champion> {
    const champion = this.championRepo.create(dto);
    return this.championRepo.save(champion);
  }

  // Cập nhật tướng (PATCH - chỉ cập nhật các trường được gửi lên)
  async update(id: number, dto: UpdateChampionDto): Promise<Champion> {
    const champion = await this.findOne(id);
    Object.assign(champion, dto);
    return this.championRepo.save(champion);
  }

  // Xóa tướng
  async remove(id: number): Promise<void> {
    const champion = await this.findOne(id);
    await this.championRepo.remove(champion);
  }
}

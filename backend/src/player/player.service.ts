import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto, UpdatePlayerDto } from './player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
  ) {}

  // Lấy tất cả tuyển thủ, kèm thông tin đội
  async findAll(): Promise<Player[]> {
    return this.playerRepo.find({
      relations: ['team'],
      order: { ovr: 'DESC' },
    });
  }

  // Lấy tuyển thủ theo đội
  async findByTeam(teamId: number): Promise<Player[]> {
    return this.playerRepo.find({
      where: { teamId },
      relations: ['team'],
      order: { mainRole: 'ASC' },
    });
  }

  // Lấy 1 tuyển thủ theo id
  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepo.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ với id: ${id}`);
    }
    return player;
  }

  // Tạo mới tuyển thủ
  async create(dto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepo.create(dto);
    return this.playerRepo.save(player);
  }

  // Cập nhật tuyển thủ
  async update(id: number, dto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    Object.assign(player, dto);
    return this.playerRepo.save(player);
  }

  // Xóa tuyển thủ
  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepo.remove(player);
  }
}

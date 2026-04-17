import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto, UpdateItemDto } from './item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Không tìm thấy trang bị với id: ${id}`);
    }
    return item;
  }

  async create(dto: CreateItemDto): Promise<Item> {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async update(id: number, dto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepo.remove(item);
  }
}

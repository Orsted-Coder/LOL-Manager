import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './item.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // GET /api/items - Lấy tất cả trang bị (cache 30 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30 * 60 * 1000)
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  // GET /api/items/:id - Lấy 1 trang bị (cache 30 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30 * 60 * 1000)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(id);
  }
}

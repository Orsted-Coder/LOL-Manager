import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ChampionService } from './champion.service';
import { CreateChampionDto, UpdateChampionDto } from './champion.dto';

// Tất cả route có prefix /api/champions
@Controller('champions')
export class ChampionController {
  constructor(private readonly championService: ChampionService) {}

  // GET /api/champions - Lấy danh sách tất cả tướng
  @Get()
  findAll() {
    return this.championService.findAll();
  }

  // GET /api/champions/:id - Lấy thông tin 1 tướng
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.championService.findOne(id);
  }

  // POST /api/champions - Tạo tướng mới
  @Post()
  create(@Body() dto: CreateChampionDto) {
    return this.championService.create(dto);
  }

  // PATCH /api/champions/:id - Cập nhật tướng (tên, ảnh, chỉ số)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChampionDto,
  ) {
    return this.championService.update(id, dto);
  }

  // DELETE /api/champions/:id - Xóa tướng
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.championService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PlayerService } from './player.service';
import { CreatePlayerDto, UpdatePlayerDto } from './player.dto';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  // GET /api/players - Lấy tất cả tuyển thủ (cache 5 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5 * 60 * 1000)
  @Get()
  findAll(@Query('teamId') teamId?: string) {
    if (teamId) {
      return this.playerService.findByTeam(parseInt(teamId));
    }
    return this.playerService.findAll();
  }

  // GET /api/players/:id - Lấy thông tin 1 tuyển thủ (cache 5 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5 * 60 * 1000)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.findOne(id);
  }

  // POST /api/players - Tạo tuyển thủ mới
  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.playerService.create(dto);
  }

  // PATCH /api/players/:id - Cập nhật thông tin tuyển thủ
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.playerService.update(id, dto);
  }

  // DELETE /api/players/:id - Xóa tuyển thủ
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.remove(id);
  }
}

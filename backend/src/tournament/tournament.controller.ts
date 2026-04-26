import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './tournament.dto';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  // GET /api/tournaments - Lấy tất cả giải đấu
  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  // GET /api/tournaments/:id - Chi tiết giải đấu
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.findOne(id);
  }

  // POST /api/tournaments - Tạo giải đấu mới
  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.create(dto);
  }

  // POST /api/tournaments/:id/simulate-next - Mô phỏng trận tiếp theo
  @Post(':id/simulate-next')
  simulateNext(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.simulateNext(id);
  }

  // POST /api/tournaments/:id/simulate-all - Mô phỏng tất cả trận còn lại
  @Post(':id/simulate-all')
  simulateAll(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.simulateAll(id);
  }

  // DELETE /api/tournaments/:id - Xóa giải đấu
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.remove(id);
  }
}

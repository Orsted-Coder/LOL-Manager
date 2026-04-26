import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { SimulateMatchDto } from './match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // GET /api/matches - Lấy tất cả trận đấu đã mô phỏng
  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  // GET /api/matches/:id - Lấy chi tiết một trận đấu
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOne(id);
  }

  // POST /api/matches/simulate - Mô phỏng trận đấu mới
  @Post('simulate')
  simulate(@Body() dto: SimulateMatchDto) {
    return this.matchService.simulate(dto);
  }
}

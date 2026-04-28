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
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // GET /api/teams - Lấy tất cả đội (cache 5 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5 * 60 * 1000)
  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  // GET /api/teams/:id - Lấy 1 đội (cache 5 phút)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5 * 60 * 1000)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }
}

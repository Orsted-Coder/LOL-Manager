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
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

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

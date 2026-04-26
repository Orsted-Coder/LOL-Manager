import { IsNumber, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SimulateMatchDto {
  @IsNumber()
  @Type(() => Number)
  team1Id: number;

  @IsNumber()
  @Type(() => Number)
  team2Id: number;

  @IsOptional()
  @IsIn(['bo1', 'bo3', 'bo5'])
  format?: 'bo1' | 'bo3' | 'bo5';
}

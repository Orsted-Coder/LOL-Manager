import { IsString, IsArray, IsIn, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name: string;

  // IDs của các đội tham gia (tối thiểu 2)
  @IsArray()
  @ArrayMinSize(2)
  teamIds: number[];

  // Định dạng trận trong giải (bo1 / bo3 / bo5)
  @IsOptional()
  @IsIn(['bo1', 'bo3', 'bo5'])
  matchFormat?: 'bo1' | 'bo3' | 'bo5';
}

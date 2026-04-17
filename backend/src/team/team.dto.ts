import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Region } from './team.entity';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsEnum(Region)
  region: Region;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(100)
  reputation?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(5)
  trainingRoomLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(5)
  academyLevel?: number;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;
}

export class UpdateTeamDto extends CreateTeamDto {}

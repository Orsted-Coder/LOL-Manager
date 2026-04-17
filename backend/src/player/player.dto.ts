import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { PlayerRole } from './player.entity';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(16) @Max(40)
  age?: number;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsEnum(PlayerRole)
  mainRole: PlayerRole;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(100)
  ovr?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(100)
  potential?: number;

  // Kỹ thuật
  @IsOptional() @IsNumber() @Min(1) @Max(20) mechanics?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) laning?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) farming?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) teamfighting?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) versatility?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) kiting?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) smite?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) visionControl?: number;

  // Tinh thần
  @IsOptional() @IsNumber() @Min(1) @Max(20) mapAwareness?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) positioning?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) decisionMaking?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) shotcalling?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) aggression?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) composure?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) anticipation?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) bravery?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) roaming?: number;

  // Thể chất & ẩn
  @IsOptional() @IsNumber() @Min(1) @Max(20) reactionTime?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) apm?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) stamina?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) naturalFitness?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) consistency?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) importantMatches?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) injuryProneness?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) adaptability?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) professionalism?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(20) loyalty?: number;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  teamId?: number;
}

export class UpdatePlayerDto extends CreatePlayerDto {}

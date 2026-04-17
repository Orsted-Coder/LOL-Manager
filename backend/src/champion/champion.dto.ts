import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { DamageType } from './champion.entity';

// DTO dùng khi tạo mới tướng (POST /champions)
export class CreateChampionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  hp?: number;

  @IsOptional()
  @IsNumber()
  hpPerLevel?: number;

  @IsOptional()
  @IsNumber()
  mp?: number;

  @IsOptional()
  @IsNumber()
  mpPerLevel?: number;

  @IsOptional()
  @IsNumber()
  armor?: number;

  @IsOptional()
  @IsNumber()
  armorPerLevel?: number;

  @IsOptional()
  @IsNumber()
  spellBlock?: number;

  @IsOptional()
  @IsNumber()
  mrPerLevel?: number;

  @IsOptional()
  @IsNumber()
  attackDamage?: number;

  @IsOptional()
  @IsNumber()
  adPerLevel?: number;

  @IsOptional()
  @IsNumber()
  attackSpeed?: number;

  @IsOptional()
  @IsNumber()
  asPerLevel?: number;

  @IsOptional()
  @IsNumber()
  attackRange?: number;

  @IsOptional()
  @IsNumber()
  moveSpeed?: number;

  @IsOptional()
  @IsNumber()
  hpRegen?: number;

  @IsOptional()
  @IsNumber()
  mpRegen?: number;

  @IsOptional()
  @IsEnum(DamageType)
  damageType?: DamageType;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  burstPotential?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  dpsPotential?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  waveclearScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  hardCC?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  softCC?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  healShieldPower?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(20)
  cooldownRatio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  damage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  durability?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  crowdControl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  mobility?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  utility?: number;

  @IsOptional()
  @IsNumber()
  @Min(1) @Max(10)
  difficulty?: number;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsArray()
  synergyTags?: string[];
}

// DTO khi cập nhật (PATCH /champions/:id) - tất cả trường đều optional
export class UpdateChampionDto extends CreateChampionDto {}

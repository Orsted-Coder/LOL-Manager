import { IsString, IsOptional, IsNumber, IsArray, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional() @IsNumber() @Min(0) ad?: number;
  @IsOptional() @IsNumber() @Min(0) ap?: number;
  @IsOptional() @IsNumber() @Min(0) armor?: number;
  @IsOptional() @IsNumber() @Min(0) mr?: number;
  @IsOptional() @IsNumber() @Min(0) hp?: number;
  @IsOptional() @IsNumber() @Min(0) mana?: number;
  @IsOptional() @IsNumber() @Min(0) attackSpeed?: number;
  @IsOptional() @IsNumber() @Min(0) critChance?: number;
  @IsOptional() @IsNumber() @Min(0) haste?: number;

  @IsOptional()
  @IsString()
  rule?: string;
}

export class UpdateItemDto extends CreateItemDto {}

import { IsNumber, Min } from 'class-validator';

// DTO để rao bán tuyển thủ lên thị trường
export class ListPlayerDto {
  @IsNumber()
  playerId: number;

  @IsNumber()
  @Min(0)
  transferFee: number;
}

// DTO để gỡ tuyển thủ khỏi thị trường
export class UnlistPlayerDto {
  @IsNumber()
  playerId: number;
}

// DTO để ký hợp đồng tuyển thủ tự do
export class SignFreeAgentDto {
  @IsNumber()
  teamId: number;

  @IsNumber()
  playerId: number;
}

// DTO để thả tuyển thủ ra thị trường tự do
export class ReleasePlayerDto {
  @IsNumber()
  teamId: number;

  @IsNumber()
  playerId: number;
}

// DTO để đặt giá mua tuyển thủ
export class MakeOfferDto {
  @IsNumber()
  fromTeamId: number;

  @IsNumber()
  playerId: number;

  @IsNumber()
  @Min(0)
  amount: number;
}

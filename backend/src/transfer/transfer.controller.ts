import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import {
  ListPlayerDto,
  UnlistPlayerDto,
  SignFreeAgentDto,
  ReleasePlayerDto,
  MakeOfferDto,
} from './transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  // GET /api/transfer/market - Lấy toàn bộ thị trường chuyển nhượng
  @Get('market')
  getMarket() {
    return this.transferService.getMarket();
  }

  // GET /api/transfer/offers?teamId=1 - Lấy đề nghị của một đội
  @Get('offers')
  getOffersByTeam(@Query('teamId', ParseIntPipe) teamId: number) {
    return this.transferService.getOffersByTeam(teamId);
  }

  // POST /api/transfer/list - Rao bán tuyển thủ
  @Post('list')
  listPlayer(@Body() dto: ListPlayerDto) {
    return this.transferService.listForTransfer(dto);
  }

  // POST /api/transfer/unlist - Gỡ tuyển thủ khỏi danh sách rao bán
  @Post('unlist')
  unlistPlayer(@Body() dto: UnlistPlayerDto) {
    return this.transferService.unlistFromTransfer(dto);
  }

  // POST /api/transfer/sign - Ký tuyển thủ tự do
  @Post('sign')
  signFreeAgent(@Body() dto: SignFreeAgentDto) {
    return this.transferService.signFreeAgent(dto);
  }

  // POST /api/transfer/release - Thả tuyển thủ ra thị trường tự do
  @Post('release')
  releasePlayer(@Body() dto: ReleasePlayerDto) {
    return this.transferService.releasePlayer(dto);
  }

  // POST /api/transfer/offer - Đặt giá mua tuyển thủ
  @Post('offer')
  makeOffer(@Body() dto: MakeOfferDto) {
    return this.transferService.makeOffer(dto);
  }

  // POST /api/transfer/offers/:id/accept - Chấp nhận đề nghị
  @Post('offers/:id/accept')
  acceptOffer(@Param('id', ParseIntPipe) id: number) {
    return this.transferService.acceptOffer(id);
  }

  // POST /api/transfer/offers/:id/reject - Từ chối đề nghị
  @Post('offers/:id/reject')
  rejectOffer(@Param('id', ParseIntPipe) id: number) {
    return this.transferService.rejectOffer(id);
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';
import { TransferOffer } from './transfer-offer.entity';
import {
  ListPlayerDto,
  UnlistPlayerDto,
  SignFreeAgentDto,
  ReleasePlayerDto,
  MakeOfferDto,
} from './transfer.dto';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
    @InjectRepository(TransferOffer)
    private offerRepo: Repository<TransferOffer>,
  ) {}

  // ===== MARKET DATA =====

  // Lấy toàn bộ thị trường: tự do + đang rao bán
  async getMarket(): Promise<{ freeAgents: Player[]; listedPlayers: Player[] }> {
    const [freeAgents, listedPlayers] = await Promise.all([
      this.playerRepo.find({
        where: { teamId: IsNull() },
        relations: ['team'],
        order: { ovr: 'DESC' },
      }),
      this.playerRepo.find({
        where: { isTransferListed: true, teamId: Not(IsNull()) },
        relations: ['team'],
        order: { ovr: 'DESC' },
      }),
    ]);
    return { freeAgents, listedPlayers };
  }

  // ===== LIST / UNLIST =====

  // Rao bán tuyển thủ với mức giá yêu cầu
  async listForTransfer(dto: ListPlayerDto): Promise<Player> {
    const player = await this.playerRepo.findOne({
      where: { id: dto.playerId },
    });
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ id: ${dto.playerId}`);
    }
    if (!player.teamId) {
      throw new BadRequestException('Tuyển thủ tự do không cần rao bán');
    }
    player.isTransferListed = true;
    player.transferFee = dto.transferFee;
    return this.playerRepo.save(player);
  }

  // Gỡ tuyển thủ khỏi danh sách rao bán
  async unlistFromTransfer(dto: UnlistPlayerDto): Promise<Player> {
    const player = await this.playerRepo.findOne({
      where: { id: dto.playerId },
    });
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ id: ${dto.playerId}`);
    }
    player.isTransferListed = false;
    player.transferFee = 0;
    return this.playerRepo.save(player);
  }

  // ===== SIGN / RELEASE =====

  // Ký tuyển thủ tự do (không tốn phí chuyển nhượng)
  async signFreeAgent(dto: SignFreeAgentDto): Promise<Player> {
    const [team, player] = await Promise.all([
      this.teamRepo.findOne({ where: { id: dto.teamId } }),
      this.playerRepo.findOne({ where: { id: dto.playerId }, relations: ['team'] }),
    ]);

    if (!team) {
      throw new NotFoundException(`Không tìm thấy đội id: ${dto.teamId}`);
    }
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ id: ${dto.playerId}`);
    }
    if (player.teamId !== null) {
      throw new BadRequestException('Tuyển thủ đang có đội, cần chuyển nhượng thay vì ký tự do');
    }

    // Gắn tuyển thủ vào đội và cập nhật tổng lương
    player.teamId = team.id;
    player.isTransferListed = false;
    team.totalSalary = Number(team.totalSalary) + player.salary;

    await this.teamRepo.save(team);
    return this.playerRepo.save(player);
  }

  // Thả tuyển thủ ra thị trường tự do
  async releasePlayer(dto: ReleasePlayerDto): Promise<Player> {
    const player = await this.playerRepo.findOne({
      where: { id: dto.playerId },
    });
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ id: ${dto.playerId}`);
    }
    if (player.teamId !== dto.teamId) {
      throw new BadRequestException('Tuyển thủ không thuộc đội này');
    }

    const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
    if (team) {
      team.totalSalary = Math.max(0, Number(team.totalSalary) - player.salary);
      await this.teamRepo.save(team);
    }

    player.teamId = null;
    player.isTransferListed = false;
    player.transferFee = 0;
    return this.playerRepo.save(player);
  }

  // ===== OFFERS =====

  // Đặt giá mua tuyển thủ từ đội khác
  async makeOffer(dto: MakeOfferDto): Promise<TransferOffer> {
    const [fromTeam, player] = await Promise.all([
      this.teamRepo.findOne({ where: { id: dto.fromTeamId } }),
      this.playerRepo.findOne({ where: { id: dto.playerId } }),
    ]);

    if (!fromTeam) {
      throw new NotFoundException(`Không tìm thấy đội id: ${dto.fromTeamId}`);
    }
    if (!player) {
      throw new NotFoundException(`Không tìm thấy tuyển thủ id: ${dto.playerId}`);
    }
    if (player.teamId === dto.fromTeamId) {
      throw new BadRequestException('Không thể đặt giá mua tuyển thủ của chính mình');
    }

    // Kiểm tra ngân sách
    if (Number(fromTeam.budget) < dto.amount) {
      throw new BadRequestException('Ngân sách không đủ để đặt giá này');
    }

    // Hủy các đề nghị pending cũ từ đội này cho tuyển thủ này
    await this.offerRepo.delete({
      fromTeamId: dto.fromTeamId,
      playerId: dto.playerId,
      status: 'pending',
    });

    const offer = this.offerRepo.create({
      fromTeamId: dto.fromTeamId,
      toTeamId: player.teamId ?? null,
      playerId: dto.playerId,
      amount: dto.amount,
      status: 'pending',
    });

    return this.offerRepo.save(offer);
  }

  // Lấy danh sách đề nghị liên quan đến một đội (gửi đi + nhận về)
  async getOffersByTeam(teamId: number): Promise<{ incoming: TransferOffer[]; outgoing: TransferOffer[] }> {
    const [incoming, outgoing] = await Promise.all([
      this.offerRepo.find({
        where: { toTeamId: teamId, status: 'pending' },
        order: { createdAt: 'DESC' },
      }),
      this.offerRepo.find({
        where: { fromTeamId: teamId },
        order: { createdAt: 'DESC' },
      }),
    ]);
    return { incoming, outgoing };
  }

  // Chấp nhận đề nghị mua → tuyển thủ chuyển đội, tiền được chuyển
  async acceptOffer(offerId: number): Promise<TransferOffer> {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) {
      throw new NotFoundException(`Không tìm thấy đề nghị id: ${offerId}`);
    }
    if (offer.status !== 'pending') {
      throw new BadRequestException('Đề nghị đã được xử lý rồi');
    }

    const [fromTeam, player] = await Promise.all([
      this.teamRepo.findOne({ where: { id: offer.fromTeamId } }),
      this.playerRepo.findOne({ where: { id: offer.playerId } }),
    ]);

    if (!fromTeam) {
      throw new NotFoundException('Đội mua không tồn tại');
    }
    if (!player) {
      throw new NotFoundException('Tuyển thủ không tồn tại');
    }
    if (Number(fromTeam.budget) < offer.amount) {
      throw new BadRequestException('Đội mua không còn đủ ngân sách');
    }

    // Trừ phí từ đội mua
    fromTeam.budget = Number(fromTeam.budget) - offer.amount;
    fromTeam.totalSalary = Number(fromTeam.totalSalary) + player.salary;

    // Cộng phí vào đội bán (nếu có)
    if (offer.toTeamId) {
      const toTeam = await this.teamRepo.findOne({ where: { id: offer.toTeamId } });
      if (toTeam) {
        toTeam.budget = Number(toTeam.budget) + offer.amount;
        toTeam.totalSalary = Math.max(0, Number(toTeam.totalSalary) - player.salary);
        await this.teamRepo.save(toTeam);
      }
    }

    await this.teamRepo.save(fromTeam);

    // Chuyển tuyển thủ sang đội mới
    player.teamId = fromTeam.id;
    player.isTransferListed = false;
    player.transferFee = 0;
    await this.playerRepo.save(player);

    // Từ chối mọi đề nghị pending khác cho tuyển thủ này
    const otherOffers = await this.offerRepo.find({
      where: { playerId: offer.playerId, status: 'pending' },
    });
    for (const other of otherOffers) {
      if (other.id !== offerId) {
        other.status = 'rejected';
        await this.offerRepo.save(other);
      }
    }

    offer.status = 'accepted';
    return this.offerRepo.save(offer);
  }

  // Từ chối đề nghị mua
  async rejectOffer(offerId: number): Promise<TransferOffer> {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) {
      throw new NotFoundException(`Không tìm thấy đề nghị id: ${offerId}`);
    }
    if (offer.status !== 'pending') {
      throw new BadRequestException('Đề nghị đã được xử lý rồi');
    }
    offer.status = 'rejected';
    return this.offerRepo.save(offer);
  }
}

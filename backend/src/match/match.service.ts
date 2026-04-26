import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, GameLog, MatchEvent, MatchFormat } from './match.entity';
import { SimulateMatchDto } from './match.dto';
import { Team } from '../team/team.entity';
import { Player } from '../player/player.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) throw new NotFoundException(`Không tìm thấy trận đấu với id: ${id}`);
    return match;
  }

  async simulate(dto: SimulateMatchDto): Promise<Match> {
    const { team1Id, team2Id, format = 'bo1' } = dto;

    if (team1Id === team2Id) {
      throw new BadRequestException('Hai đội không được trùng nhau');
    }

    const [team1, team2] = await Promise.all([
      this.teamRepo.findOne({ where: { id: team1Id } }),
      this.teamRepo.findOne({ where: { id: team2Id } }),
    ]);

    if (!team1) throw new NotFoundException(`Không tìm thấy đội với id: ${team1Id}`);
    if (!team2) throw new NotFoundException(`Không tìm thấy đội với id: ${team2Id}`);

    const [team1Players, team2Players] = await Promise.all([
      this.playerRepo.find({ where: { teamId: team1Id } }),
      this.playerRepo.find({ where: { teamId: team2Id } }),
    ]);

    // Số ván cần thắng để giành chiến thắng series
    const winsNeeded = format === 'bo1' ? 1 : format === 'bo3' ? 2 : 3;
    let team1Score = 0;
    let team2Score = 0;
    const matchLogs: GameLog[] = [];
    let gameNumber = 1;

    while (team1Score < winsNeeded && team2Score < winsNeeded) {
      const gameLog = this.simulateSingleGame(
        team1Players,
        team2Players,
        team1,
        team2,
        gameNumber,
      );
      matchLogs.push(gameLog);
      if (gameLog.winningSide === 1) team1Score++;
      else team2Score++;
      gameNumber++;
    }

    const winnerId = team1Score > team2Score ? team1Id : team2Id;
    const team1Power = this.computeTeamPower(team1Players);
    const team2Power = this.computeTeamPower(team2Players);

    const match = this.matchRepo.create({
      team1Id,
      team2Id,
      winnerId,
      format,
      team1Score,
      team2Score,
      team1Power: Math.round(team1Power * 100) / 100,
      team2Power: Math.round(team2Power * 100) / 100,
      matchLog: matchLogs,
    });

    return this.matchRepo.save(match);
  }

  // ===== MATCH ENGINE =====

  // Tính điểm sức mạnh đội (0-100)
  private computeTeamPower(players: Player[]): number {
    if (players.length === 0) return 50;
    const n = players.length;

    const avgOvr = players.reduce((s, p) => s + p.ovr, 0) / n;

    // Chỉ số tinh thần (1-20 → *5 để normalize về 0-100)
    const avgShotcalling = (players.reduce((s, p) => s + p.shotcalling, 0) / n) * 5;
    const avgTeamfighting = (players.reduce((s, p) => s + p.teamfighting, 0) / n) * 5;
    const avgConsistency = (players.reduce((s, p) => s + p.consistency, 0) / n) * 5;
    const avgComposure = (players.reduce((s, p) => s + p.composure, 0) / n) * 5;
    const avgDecisionMaking = (players.reduce((s, p) => s + p.decisionMaking, 0) / n) * 5;

    // OVR chiếm 70%, chỉ số tinh thần chiếm 30%
    return (
      avgOvr * 0.7 +
      ((avgShotcalling + avgTeamfighting + avgConsistency + avgComposure + avgDecisionMaking) / 5) *
        0.3
    );
  }

  // Hàm sigmoid để tính xác suất thắng từ hiệu số sức mạnh
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  // Số nguyên ngẫu nhiên trong [min, max]
  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Số thực ngẫu nhiên trong [min, max]
  private randFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Phần tử ngẫu nhiên từ mảng
  private randElement<T>(arr: T[]): T | undefined {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Mô phỏng một ván đấu đơn lẻ
  private simulateSingleGame(
    team1Players: Player[],
    team2Players: Player[],
    team1: Team,
    team2: Team,
    gameNumber: number,
  ): GameLog {
    const team1Power = this.computeTeamPower(team1Players);
    const team2Power = this.computeTeamPower(team2Players);

    // Tính variance ngẫu nhiên theo độ nhất quán (consistency thấp = variance cao)
    const avgConsistency1 =
      team1Players.length
        ? team1Players.reduce((s, p) => s + p.consistency, 0) / team1Players.length
        : 10;
    const avgConsistency2 =
      team2Players.length
        ? team2Players.reduce((s, p) => s + p.consistency, 0) / team2Players.length
        : 10;

    // consistency: 1-20 → variance tối đa 15 điểm khi consistency = 1
    const variance1 = ((21 - avgConsistency1) / 20) * 15;
    const variance2 = ((21 - avgConsistency2) / 20) * 15;

    const adjusted1 = team1Power + this.randFloat(-variance1, variance1);
    const adjusted2 = team2Power + this.randFloat(-variance2, variance2);

    // Tính xác suất thắng qua sigmoid (hiệu số ÷ 12 → ±15 điểm ≈ ±71% win rate)
    const powerDiff = adjusted1 - adjusted2;
    const winProb1 = this.sigmoid(powerDiff / 12);
    const team1Wins = Math.random() < winProb1;

    const winningSide: 1 | 2 = team1Wins ? 1 : 2;
    const duration = this.rand(22, 45);

    const events = this.generateMatchEvents(
      team1,
      team2,
      team1Players,
      team2Players,
      winningSide,
      duration,
    );

    const team1Kills = events.filter((e) => e.type === 'KILL' && e.teamSide === 1).length;
    const team2Kills = events.filter((e) => e.type === 'KILL' && e.teamSide === 2).length;

    return {
      gameNumber,
      winningSide,
      duration,
      team1Kills,
      team2Kills,
      team1PowerScore: Math.round(adjusted1 * 100) / 100,
      team2PowerScore: Math.round(adjusted2 * 100) / 100,
      events,
    };
  }

  // Tạo danh sách sự kiện cho một ván đấu
  private generateMatchEvents(
    team1: Team,
    team2: Team,
    team1Players: Player[],
    team2Players: Player[],
    winningSide: 1 | 2,
    duration: number,
  ): MatchEvent[] {
    const events: MatchEvent[] = [];

    const winningPlayers = winningSide === 1 ? team1Players : team2Players;
    const losingPlayers = winningSide === 1 ? team2Players : team1Players;
    const winningTeamName = winningSide === 1 ? team1.name : team2.name;
    const losingTeamName = winningSide === 1 ? team2.name : team1.name;
    const loosingSide: 1 | 2 = winningSide === 1 ? 2 : 1;

    const pickWin = () => this.randElement(winningPlayers);
    const pickLose = () => this.randElement(losingPlayers);

    // Tìm tuyển thủ theo vai trò
    const getRole = (players: Player[], role: string) =>
      players.find((p) => p.mainRole === role);

    const winJg = getRole(winningPlayers, 'Jungle') || pickWin();
    const loseJg = getRole(losingPlayers, 'Jungle') || pickLose();
    const winAdc = getRole(winningPlayers, 'ADC') || pickWin();

    // Hàm tiện ích thêm sự kiện Kill
    const addKill = (time: number, side: 1 | 2) => {
      const player = side === winningSide ? pickWin() : pickLose();
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'KILL',
        teamSide: side,
        playerName: player?.name,
        description: `💀 ${player?.name ?? 'Unknown'} (${teamName}) hạ gục đối thủ!`,
      });
    };

    // ===== EARLY GAME (5–15 min) =====

    // First Blood (5–8 min) — đội mạnh hơn có 65% khả năng lấy
    {
      const time = this.rand(5, 8);
      const side = Math.random() < 0.65 ? winningSide : loosingSide;
      const player = side === winningSide ? pickWin() : pickLose();
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'FIRST_BLOOD',
        teamSide: side,
        playerName: player?.name,
        description: `⚔️ ${player?.name ?? 'Unknown'} (${teamName}) giành First Blood!`,
      });
    }

    // Kills sớm (6–14 min): đội thắng lấy ~60%
    const earlyKillCount = this.rand(3, 6);
    for (let i = 0; i < earlyKillCount; i++) {
      const side = Math.random() < 0.60 ? winningSide : loosingSide;
      addKill(this.rand(6, 14), side);
    }

    // Dragon lần 1 (8–12 min)
    {
      const time = this.rand(8, 12);
      const side = Math.random() < 0.65 ? winningSide : loosingSide;
      const jungler = side === winningSide ? winJg : loseJg;
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'DRAGON',
        teamSide: side,
        playerName: jungler?.name,
        description: `🐉 ${jungler?.name ?? 'Jungler'} (${teamName}) tiêu diệt Rồng đầu tiên!`,
      });
    }

    // Tháp đầu tiên (10–14 min)
    {
      const time = this.rand(10, 14);
      const side = Math.random() < 0.65 ? winningSide : loosingSide;
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'TOWER',
        teamSide: side,
        description: `🏰 ${teamName} phá hủy tháp phòng thủ đầu tiên!`,
      });
    }

    // ===== MID GAME (14–25 min) =====

    // Kills giữa trận (14–24 min): đội thắng lấy ~62%
    const midKillCount = this.rand(4, 8);
    for (let i = 0; i < midKillCount; i++) {
      const side = Math.random() < 0.62 ? winningSide : loosingSide;
      addKill(this.rand(14, 24), side);
    }

    // Dragon lần 2 (13–18 min)
    {
      const time = this.rand(13, 18);
      const side = Math.random() < 0.65 ? winningSide : loosingSide;
      const jungler = side === winningSide ? winJg : loseJg;
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'DRAGON',
        teamSide: side,
        playerName: jungler?.name,
        description: `🐉 ${jungler?.name ?? 'Jungler'} (${teamName}) tiêu diệt Rồng lần 2!`,
      });
    }

    // Thêm 1–3 tháp giữa trận
    const midTowerCount = this.rand(1, 3);
    for (let i = 0; i < midTowerCount; i++) {
      const time = this.rand(14, 24);
      const side = Math.random() < 0.65 ? winningSide : loosingSide;
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'TOWER',
        teamSide: side,
        description: `🏰 ${teamName} phá thêm một tháp phòng thủ!`,
      });
    }

    // Baron Nashor (nếu trận kéo dài ≥25 min)
    if (duration >= 25) {
      const time = this.rand(20, Math.min(28, duration - 5));
      const side = Math.random() < 0.72 ? winningSide : loosingSide;
      const jungler = side === winningSide ? winJg : loseJg;
      const teamName = side === 1 ? team1.name : team2.name;
      events.push({
        time,
        type: 'BARON',
        teamSide: side,
        playerName: jungler?.name,
        description: `👾 ${jungler?.name ?? 'Jungler'} (${teamName}) tiêu diệt Baron Nashor!`,
      });
    }

    // ===== LATE GAME (25–duration) =====

    if (duration > 30) {
      const lateKillCount = this.rand(5, 10);
      for (let i = 0; i < lateKillCount; i++) {
        const side = Math.random() < 0.65 ? winningSide : loosingSide;
        addKill(this.rand(25, duration - 3), side);
      }

      // Dragon lần 3
      {
        const time = this.rand(22, Math.min(30, duration - 5));
        const teamName = winningSide === 1 ? team1.name : team2.name;
        events.push({
          time,
          type: 'DRAGON',
          teamSide: winningSide,
          playerName: winJg?.name,
          description: `🐉 ${winJg?.name ?? 'Jungler'} (${teamName}) tiêu diệt Rồng lần 3 — Dragon Soul!`,
        });
      }
    }

    // Ức Chế Thể của đội thắng
    {
      const time = Math.max(20, this.rand(duration - 8, duration - 3));
      events.push({
        time,
        type: 'INHIBITOR',
        teamSide: winningSide,
        description: `💥 ${winningTeamName} phá hủy Ức Chế Thể!`,
      });
    }

    // Ace trước Nexus
    if (Math.random() < 0.6) {
      const time = duration - 1;
      const acePlayer = winAdc;
      events.push({
        time,
        type: 'KILL',
        teamSide: winningSide,
        playerName: acePlayer?.name,
        description: `⚡ ACE! ${acePlayer?.name ?? winningTeamName} tiêu diệt toàn bộ đội địch!`,
      });
    }

    // Nexus — sự kiện kết thúc
    events.push({
      time: duration,
      type: 'NEXUS',
      teamSide: winningSide,
      description: `🏆 ${winningTeamName} phá hủy Nexus! Chiến thắng!`,
    });

    // Sắp xếp theo thứ tự thời gian
    events.sort((a, b) => a.time - b.time);

    return events;
  }
}

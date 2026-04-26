import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament, TournamentMatch, TournamentStanding } from './tournament.entity';
import { CreateTournamentDto } from './tournament.dto';
import { Team } from '../team/team.entity';
import { MatchService } from '../match/match.service';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepo: Repository<Tournament>,
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
    private matchService: MatchService,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.tournamentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Tournament> {
    const t = await this.tournamentRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Không tìm thấy giải đấu với id: ${id}`);
    return t;
  }

  async create(dto: CreateTournamentDto): Promise<Tournament> {
    const { name, teamIds, matchFormat = 'bo1' } = dto;

    if (teamIds.length < 2) {
      throw new BadRequestException('Giải đấu cần ít nhất 2 đội');
    }

    // Lấy các đội từ database
    const teams = await Promise.all(
      teamIds.map((id) =>
        this.teamRepo.findOne({ where: { id } }).then((t) => {
          if (!t) throw new NotFoundException(`Không tìm thấy đội với id: ${id}`);
          return t;
        }),
      ),
    );

    // Tạo lịch round-robin (mỗi cặp đấu một lần)
    const schedule: TournamentMatch[] = [];
    let round = 1;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        schedule.push({
          round,
          team1Id: teams[i].id,
          team1Name: teams[i].name,
          team2Id: teams[j].id,
          team2Name: teams[j].name,
          status: 'pending',
        });
        round++;
      }
    }

    // Khởi tạo bảng xếp hạng
    const standings: TournamentStanding[] = teams.map((t) => ({
      teamId: t.id,
      teamName: t.name,
      primaryColor: t.primaryColor || '#1a1a2e',
      secondaryColor: t.secondaryColor || '#e94560',
      wins: 0,
      losses: 0,
      points: 0,
    }));

    const tournament = this.tournamentRepo.create({
      name,
      matchFormat,
      teams,
      schedule,
      standings,
      status: 'pending',
      winnerId: null,
    });

    return this.tournamentRepo.save(tournament);
  }

  // Mô phỏng tất cả trận đấu còn lại trong giải
  async simulateAll(id: number): Promise<Tournament> {
    const tournament = await this.findOne(id);

    if (tournament.status === 'completed') {
      throw new BadRequestException('Giải đấu đã kết thúc');
    }

    const pendingMatches = tournament.schedule.filter(
      (m) => m.status === 'pending',
    );

    if (pendingMatches.length === 0) {
      throw new BadRequestException('Không còn trận đấu nào để mô phỏng');
    }

    // Mô phỏng từng trận còn lại
    for (const scheduled of pendingMatches) {
      const match = await this.matchService.simulate({
        team1Id: scheduled.team1Id,
        team2Id: scheduled.team2Id,
        format: tournament.matchFormat,
      });

      // Cập nhật kết quả vào schedule
      scheduled.matchId = match.id;
      scheduled.winnerId = match.winnerId;
      scheduled.winnerName =
        match.winnerId === match.team1Id
          ? scheduled.team1Name
          : scheduled.team2Name;
      scheduled.team1Score = match.team1Score;
      scheduled.team2Score = match.team2Score;
      scheduled.status = 'completed';

      // Cập nhật bảng xếp hạng
      this.updateStandings(tournament.standings, scheduled);
    }

    // Sắp xếp bảng xếp hạng theo điểm giảm dần
    this.sortStandings(tournament.standings);

    // Xác định trạng thái và đội vô địch
    const allDone = tournament.schedule.every((m) => m.status === 'completed');
    if (allDone) {
      tournament.status = 'completed';
      tournament.winnerId = tournament.standings[0]?.teamId ?? null;
    } else {
      tournament.status = 'ongoing';
    }

    return this.tournamentRepo.save(tournament);
  }

  // Mô phỏng trận đấu tiếp theo chưa thi đấu
  async simulateNext(id: number): Promise<Tournament> {
    const tournament = await this.findOne(id);

    if (tournament.status === 'completed') {
      throw new BadRequestException('Giải đấu đã kết thúc');
    }

    const nextMatch = tournament.schedule.find((m) => m.status === 'pending');
    if (!nextMatch) {
      throw new BadRequestException('Không còn trận đấu nào để mô phỏng');
    }

    const match = await this.matchService.simulate({
      team1Id: nextMatch.team1Id,
      team2Id: nextMatch.team2Id,
      format: tournament.matchFormat,
    });

    nextMatch.matchId = match.id;
    nextMatch.winnerId = match.winnerId;
    nextMatch.winnerName =
      match.winnerId === match.team1Id
        ? nextMatch.team1Name
        : nextMatch.team2Name;
    nextMatch.team1Score = match.team1Score;
    nextMatch.team2Score = match.team2Score;
    nextMatch.status = 'completed';

    this.updateStandings(tournament.standings, nextMatch);

    this.sortStandings(tournament.standings);

    const allDone = tournament.schedule.every((m) => m.status === 'completed');
    if (allDone) {
      tournament.status = 'completed';
      tournament.winnerId = tournament.standings[0]?.teamId ?? null;
    } else {
      tournament.status = 'ongoing';
    }

    return this.tournamentRepo.save(tournament);
  }

  async remove(id: number): Promise<void> {
    const tournament = await this.findOne(id);
    await this.tournamentRepo.remove(tournament);
  }

  // Sắp xếp bảng xếp hạng: điểm cao → số thắng cao
  private sortStandings(standings: TournamentStanding[]): void {
    standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
  }

  // Cập nhật bảng xếp hạng dựa trên kết quả một trận
  private updateStandings(
    standings: TournamentStanding[],
    match: TournamentMatch,
  ): void {
    const winner = standings.find((s) => s.teamId === match.winnerId);
    const loserId =
      match.winnerId === match.team1Id ? match.team2Id : match.team1Id;
    const loser = standings.find((s) => s.teamId === loserId);

    if (winner) {
      winner.wins += 1;
      winner.points += 3;
    }
    if (loser) {
      loser.losses += 1;
    }
  }
}

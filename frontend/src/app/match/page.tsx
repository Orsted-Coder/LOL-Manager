'use client';
// Trang Mô Phỏng Trận Đấu - Phase 2 Match Engine
// Chọn hai đội, chọn định dạng và chạy mô phỏng 5v5

import { useEffect, useState } from 'react';
import { teamApi, matchApi } from '@/lib/api';
import { Team, Match, GameLog, MatchEvent, MatchFormat } from '@/types';

const formatOptions: { value: MatchFormat; label: string; desc: string }[] = [
  { value: 'bo1', label: 'Bo1', desc: 'Trận đấu đơn' },
  { value: 'bo3', label: 'Bo3', desc: 'Thắng 2/3 ván' },
  { value: 'bo5', label: 'Bo5', desc: 'Thắng 3/5 ván' },
];

const eventTypeConfig: Record<string, { icon: string; color: string }> = {
  FIRST_BLOOD: { icon: '⚔️', color: 'text-red-400' },
  KILL:        { icon: '💀', color: 'text-orange-400' },
  DRAGON:      { icon: '🐉', color: 'text-emerald-400' },
  BARON:       { icon: '👾', color: 'text-purple-400' },
  TOWER:       { icon: '🏰', color: 'text-yellow-400' },
  INHIBITOR:   { icon: '💥', color: 'text-pink-400' },
  NEXUS:       { icon: '🏆', color: 'text-lol-gold' },
};

export default function MatchPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [team2Id, setTeam2Id] = useState<number | null>(null);
  const [format, setFormat] = useState<MatchFormat>('bo1');

  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<Match | null>(null);
  const [simError, setSimError] = useState('');

  // Lịch sử trận đấu
  const [history, setHistory] = useState<Match[]>([]);
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState<Match | null>(null);

  useEffect(() => {
    Promise.all([teamApi.getAll(), matchApi.getAll()])
      .then(([teamsData, matchesData]) => {
        setTeams(teamsData);
        setHistory(matchesData);
      })
      .catch(() => setError('Không thể tải dữ liệu. Đảm bảo backend đang chạy.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSimulate() {
    if (!team1Id || !team2Id) {
      setSimError('Vui lòng chọn cả hai đội!');
      return;
    }
    if (team1Id === team2Id) {
      setSimError('Hai đội phải khác nhau!');
      return;
    }

    setSimulating(true);
    setSimError('');
    setResult(null);
    setSelectedHistoryMatch(null);

    try {
      const match = await matchApi.simulate(team1Id, team2Id, format);
      setResult(match);
      // Cập nhật lịch sử
      setHistory((prev) => [match, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setSimError(`Lỗi khi mô phỏng trận đấu: ${msg}`);
    } finally {
      setSimulating(false);
    }
  }

  const displayedMatch = selectedHistoryMatch ?? result;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-lol-gold text-xl animate-pulse">⚡ Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ===== TIÊU ĐỀ ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">🎮 Mô Phỏng Trận Đấu</h1>
        <p className="text-gray-400">Chọn hai đội và bắt đầu mô phỏng 5v5 — Phase 2 Match Engine</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ===== LAYOUT CHÍNH ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ===== CỘT TRÁI: CÀI ĐẶT & KẾT QUẢ ===== */}
        <div className="xl:col-span-2 space-y-6">

          {/* Bảng cài đặt trận đấu */}
          <div className="bg-lol-panel border border-lol-border rounded-lg p-5">
            <h2 className="font-semibold text-lol-gold-light mb-4 text-lg">⚙️ Thiết Lập Trận Đấu</h2>

            {/* Chọn đội */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <TeamSelector
                label="🔵 Đội 1"
                teams={teams}
                value={team1Id}
                onChange={setTeam1Id}
                disabledId={team2Id}
              />
              <TeamSelector
                label="🔴 Đội 2"
                teams={teams}
                value={team2Id}
                onChange={setTeam2Id}
                disabledId={team1Id}
              />
            </div>

            {/* Chọn định dạng */}
            <div className="mb-5">
              <label className="text-xs text-gray-400 block mb-2">Định dạng</label>
              <div className="flex gap-2">
                {formatOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value)}
                    className={`
                      flex-1 py-2 rounded-md text-sm font-medium transition-all border
                      ${format === opt.value
                        ? 'bg-lol-gold/20 border-lol-gold text-lol-gold'
                        : 'bg-lol-border/30 border-lol-border text-gray-400 hover:text-lol-gold-light'
                      }
                    `}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Xem trước vs */}
            {team1Id && team2Id && (
              <VsPreview
                team1={teams.find((t) => t.id === team1Id)!}
                team2={teams.find((t) => t.id === team2Id)!}
                format={format}
              />
            )}

            {simError && (
              <p className="text-red-400 text-sm mb-3">{simError}</p>
            )}

            {/* Nút mô phỏng */}
            <button
              onClick={handleSimulate}
              disabled={simulating || !team1Id || !team2Id}
              className="
                w-full py-3 rounded-lg font-bold text-lol-dark bg-lol-gold
                hover:bg-lol-gold/80 transition-colors disabled:opacity-40
                disabled:cursor-not-allowed text-base mt-2
              "
            >
              {simulating ? '⏳ Đang mô phỏng...' : '⚔️ BẮT ĐẦU TRẬN ĐẤU'}
            </button>
          </div>

          {/* Kết quả trận đấu */}
          {displayedMatch && (
            <MatchResult match={displayedMatch} />
          )}
        </div>

        {/* ===== CỘT PHẢI: LỊCH SỬ TRẬN ĐẤU ===== */}
        <div>
          <div className="bg-lol-panel border border-lol-border rounded-lg">
            <div className="px-4 py-3 border-b border-lol-border">
              <h2 className="font-semibold text-lol-gold-light">📋 Lịch Sử Trận Đấu</h2>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">Chưa có trận đấu nào.</p>
              ) : (
                history.map((m) => (
                  <HistoryRow
                    key={m.id}
                    match={m}
                    isSelected={selectedHistoryMatch?.id === m.id}
                    onClick={() => {
                      setSelectedHistoryMatch(
                        selectedHistoryMatch?.id === m.id ? null : m
                      );
                      setResult(null);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function TeamSelector({
  label,
  teams,
  value,
  onChange,
  disabledId,
}: {
  label: string;
  teams: Team[];
  value: number | null;
  onChange: (id: number) => void;
  disabledId: number | null;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          w-full bg-lol-border/30 border border-lol-border rounded-md px-3 py-2
          text-lol-gold-light text-sm focus:outline-none focus:border-lol-gold
        "
      >
        <option value="" disabled>Chọn đội...</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id} disabled={t.id === disabledId}>
            {t.name} ({t.region})
          </option>
        ))}
      </select>
    </div>
  );
}

function VsPreview({ team1, team2, format }: { team1: Team; team2: Team; format: MatchFormat }) {
  return (
    <div className="flex items-center justify-center gap-4 py-3 mb-4 bg-lol-border/20 rounded-lg">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center text-sm font-bold mb-1"
          style={{ backgroundColor: team1.primaryColor + '40', color: team1.secondaryColor }}
        >
          {team1.name.slice(0, 2).toUpperCase()}
        </div>
        <p className="text-lol-gold-light text-sm font-medium">{team1.name}</p>
        <p className="text-gray-500 text-xs">{team1.region}</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-500">VS</div>
        <div className="text-xs text-lol-gold">{format.toUpperCase()}</div>
      </div>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center text-sm font-bold mb-1"
          style={{ backgroundColor: team2.primaryColor + '40', color: team2.secondaryColor }}
        >
          {team2.name.slice(0, 2).toUpperCase()}
        </div>
        <p className="text-lol-gold-light text-sm font-medium">{team2.name}</p>
        <p className="text-gray-500 text-xs">{team2.region}</p>
      </div>
    </div>
  );
}

function MatchResult({ match }: { match: Match }) {
  const [selectedGame, setSelectedGame] = useState(0);
  const game = match.matchLog[selectedGame];

  const isTeam1Winner = match.winnerId === match.team1Id;

  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg overflow-hidden">
      {/* Header kết quả */}
      <div className="p-5 border-b border-lol-border">
        <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wider">
          Kết Quả — {match.format.toUpperCase()}
        </p>

        {/* Scoreboard */}
        <div className="flex items-center justify-between gap-3">
          {/* Team 1 */}
          <div className={`flex-1 text-center ${isTeam1Winner ? '' : 'opacity-60'}`}>
            <div
              className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center text-xl font-bold mb-2 border-2"
              style={{
                backgroundColor: match.team1.primaryColor + '30',
                color: match.team1.secondaryColor,
                borderColor: isTeam1Winner ? match.team1.secondaryColor : 'transparent',
              }}
            >
              {match.team1.name.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm font-bold text-lol-gold-light">{match.team1.name}</p>
            <p className="text-xs text-gray-500">{match.team1.region}</p>
            {isTeam1Winner && (
              <span className="text-xs text-lol-gold font-bold mt-1 block">🏆 CHIẾN THẮNG</span>
            )}
          </div>

          {/* Score */}
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-lol-gold-light">
              {match.team1Score}
              <span className="text-gray-600 mx-2">—</span>
              {match.team2Score}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sức mạnh: {match.team1Power.toFixed(1)} vs {match.team2Power.toFixed(1)}
            </p>
          </div>

          {/* Team 2 */}
          <div className={`flex-1 text-center ${!isTeam1Winner ? '' : 'opacity-60'}`}>
            <div
              className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center text-xl font-bold mb-2 border-2"
              style={{
                backgroundColor: match.team2.primaryColor + '30',
                color: match.team2.secondaryColor,
                borderColor: !isTeam1Winner ? match.team2.secondaryColor : 'transparent',
              }}
            >
              {match.team2.name.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm font-bold text-lol-gold-light">{match.team2.name}</p>
            <p className="text-xs text-gray-500">{match.team2.region}</p>
            {!isTeam1Winner && (
              <span className="text-xs text-lol-gold font-bold mt-1 block">🏆 CHIẾN THẮNG</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs ván đấu */}
      {match.matchLog.length > 1 && (
        <div className="flex border-b border-lol-border">
          {match.matchLog.map((g, i) => (
            <button
              key={i}
              onClick={() => setSelectedGame(i)}
              className={`
                flex-1 py-2 text-xs font-medium transition-all
                ${selectedGame === i
                  ? 'bg-lol-gold/10 text-lol-gold border-b-2 border-lol-gold'
                  : 'text-gray-500 hover:text-gray-300'
                }
              `}
            >
              Ván {i + 1}
              {g.winningSide === 1
                ? ` (${match.team1.name.slice(0, 3)})`
                : ` (${match.team2.name.slice(0, 3)})`}
            </button>
          ))}
        </div>
      )}

      {/* Chi tiết ván đấu */}
      {game && (
        <div className="p-4">
          {/* Thống kê ván */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <StatChip label="Thời gian" value={`${game.duration} phút`} />
            <StatChip
              label="Tỉ số Kill"
              value={`${game.team1Kills} — ${game.team2Kills}`}
            />
            <StatChip
              label="Đội thắng ván"
              value={game.winningSide === 1 ? match.team1.name : match.team2.name}
              highlight
            />
          </div>

          {/* Power comparison bar */}
          <PowerBar
            team1Name={match.team1.name}
            team2Name={match.team2.name}
            score1={game.team1PowerScore}
            score2={game.team2PowerScore}
            team1Color={match.team1.secondaryColor}
            team2Color={match.team2.secondaryColor}
          />

          {/* Timeline sự kiện */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              📜 Timeline trận đấu
            </p>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {game.events.map((ev, i) => (
                <EventRow
                  key={i}
                  event={ev}
                  team1Name={match.team1.name}
                  team2Name={match.team2.name}
                  team1Color={match.team1.secondaryColor}
                  team2Color={match.team2.secondaryColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-lol-border/30 rounded-lg py-2 px-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-lol-gold' : 'text-lol-gold-light'} truncate`}>
        {value}
      </p>
    </div>
  );
}

function PowerBar({
  team1Name,
  team2Name,
  score1,
  score2,
  team1Color,
  team2Color,
}: {
  team1Name: string;
  team2Name: string;
  score1: number;
  score2: number;
  team1Color: string;
  team2Color: string;
}) {
  const total = score1 + score2 || 1;
  const pct1 = (score1 / total) * 100;
  const pct2 = (score2 / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{team1Name}: {score1.toFixed(1)}</span>
        <span className="text-gray-600">Sức mạnh ván</span>
        <span>{team2Name}: {score2.toFixed(1)}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden">
        <div
          className="transition-all duration-500"
          style={{ width: `${pct1}%`, backgroundColor: team1Color || '#c89b3c' }}
        />
        <div
          className="transition-all duration-500"
          style={{ width: `${pct2}%`, backgroundColor: team2Color || '#e84057' }}
        />
      </div>
    </div>
  );
}

function EventRow({
  event,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
}: {
  event: MatchEvent;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
}) {
  const cfg = eventTypeConfig[event.type] ?? { icon: '•', color: 'text-gray-400' };
  const isTeam1 = event.teamSide === 1;
  const sideColor = isTeam1 ? team1Color : team2Color;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md text-xs
        ${event.type === 'NEXUS' ? 'bg-lol-gold/10 border border-lol-gold/30' : 'bg-lol-border/20'}
      `}
    >
      {/* Thời gian */}
      <span className="text-gray-600 w-8 shrink-0 text-right">{event.time}&apos;</span>
      {/* Icon */}
      <span className={`${cfg.color} shrink-0`}>{cfg.icon}</span>
      {/* Mô tả */}
      <span className={`flex-1 ${event.type === 'NEXUS' ? 'text-lol-gold font-medium' : 'text-gray-300'}`}>
        {event.description}
      </span>
      {/* Bên thực hiện */}
      <span
        className="text-xs font-bold shrink-0"
        style={{ color: sideColor || (isTeam1 ? '#c89b3c' : '#e84057') }}
      >
        {isTeam1 ? team1Name.slice(0, 3) : team2Name.slice(0, 3)}
      </span>
    </div>
  );
}

function HistoryRow({
  match,
  isSelected,
  onClick,
}: {
  match: Match;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isTeam1Winner = match.winnerId === match.team1Id;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg transition-all border
        ${isSelected
          ? 'bg-lol-gold/10 border-lol-gold/40'
          : 'bg-lol-border/20 border-transparent hover:bg-lol-border/40'
        }
      `}
    >
      {/* Tên hai đội */}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={`font-medium ${isTeam1Winner ? 'text-lol-gold' : 'text-gray-400'}`}>
          {isTeam1Winner ? '🏆 ' : ''}{match.team1.name}
        </span>
        <span className="text-gray-600 text-xs">{match.format.toUpperCase()}</span>
        <span className={`font-medium ${!isTeam1Winner ? 'text-lol-gold' : 'text-gray-400'}`}>
          {match.team2.name}{!isTeam1Winner ? ' 🏆' : ''}
        </span>
      </div>
      {/* Score */}
      <div className="text-center text-lol-gold-light font-bold text-sm">
        {match.team1Score} — {match.team2Score}
      </div>
      {/* Thời gian */}
      <p className="text-gray-600 text-xs text-center mt-1">
        {new Date(match.createdAt).toLocaleString('vi-VN', {
          day: '2-digit', month: '2-digit',
          hour: '2-digit', minute: '2-digit',
        })}
      </p>
    </button>
  );
}

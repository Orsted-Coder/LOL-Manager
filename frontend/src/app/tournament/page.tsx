'use client';
// Trang Giải Đấu - Phase 3 Tournament System
// Tạo giải round-robin, mô phỏng trận đấu, xem bảng xếp hạng

import { useEffect, useState } from 'react';
import { teamApi, tournamentApi } from '@/lib/api';
import { Team, Tournament, TournamentMatch } from '@/types';

const FORMAT_OPTIONS = [
  { value: 'bo1' as const, label: 'Bo1', desc: 'Trận đơn' },
  { value: 'bo3' as const, label: 'Bo3', desc: '2/3 ván' },
  { value: 'bo5' as const, label: 'Bo5', desc: '3/5 ván' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chưa bắt đầu', color: 'text-gray-400' },
  ongoing:   { label: 'Đang diễn ra', color: 'text-yellow-400' },
  completed: { label: 'Đã kết thúc',  color: 'text-lol-gold' },
};

export default function TournamentPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form tạo giải mới
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [matchFormat, setMatchFormat] = useState<'bo1' | 'bo3' | 'bo5'>('bo1');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Giải đấu đang xem chi tiết
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState('');

  useEffect(() => {
    Promise.all([teamApi.getAll(), tournamentApi.getAll()])
      .then(([teamsData, toursData]) => {
        setTeams(teamsData);
        setTournaments(toursData);
      })
      .catch(() => setError('Không thể tải dữ liệu. Đảm bảo backend đang chạy.'))
      .finally(() => setLoading(false));
  }, []);

  // Toggle đội được chọn vào giải
  function toggleTeam(id: number) {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleCreate() {
    if (!newName.trim()) { setCreateError('Vui lòng nhập tên giải đấu'); return; }
    if (selectedTeamIds.length < 2) { setCreateError('Chọn ít nhất 2 đội'); return; }
    setCreating(true);
    setCreateError('');
    try {
      const t = await tournamentApi.create(newName.trim(), selectedTeamIds, matchFormat);
      setTournaments((prev) => [t, ...prev]);
      setSelectedTournament(t);
      setShowCreate(false);
      setNewName('');
      setSelectedTeamIds([]);
      setMatchFormat('bo1');
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setCreating(false);
    }
  }

  async function handleSimulateNext() {
    if (!selectedTournament) return;
    setSimulating(true);
    setSimError('');
    try {
      const updated = await tournamentApi.simulateNext(selectedTournament.id);
      setSelectedTournament(updated);
      setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e: unknown) {
      setSimError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setSimulating(false);
    }
  }

  async function handleSimulateAll() {
    if (!selectedTournament) return;
    setSimulating(true);
    setSimError('');
    try {
      const updated = await tournamentApi.simulateAll(selectedTournament.id);
      setSelectedTournament(updated);
      setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e: unknown) {
      setSimError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setSimulating(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await tournamentApi.remove(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
      if (selectedTournament?.id === id) setSelectedTournament(null);
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-lol-gold text-xl animate-pulse">⚡ Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tiêu đề */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-lol-gold mb-1">🏆 Hệ Thống Giải Đấu</h1>
          <p className="text-gray-400">Tạo và quản lý giải round-robin — Phase 3 Tournament</p>
        </div>
        <button
          onClick={() => { setShowCreate(!showCreate); setCreateError(''); }}
          className="px-5 py-2.5 bg-lol-gold text-lol-dark font-bold rounded-lg hover:bg-lol-gold/80 transition-colors"
        >
          {showCreate ? '✕ Đóng' : '+ Tạo Giải Mới'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Form tạo giải */}
      {showCreate && (
        <CreateTournamentForm
          teams={teams}
          newName={newName}
          setNewName={setNewName}
          selectedTeamIds={selectedTeamIds}
          toggleTeam={toggleTeam}
          matchFormat={matchFormat}
          setMatchFormat={setMatchFormat}
          creating={creating}
          createError={createError}
          onSubmit={handleCreate}
        />
      )}

      {/* Layout: danh sách giải + chi tiết */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Danh sách giải đấu */}
        <div className="xl:col-span-1">
          <div className="bg-lol-panel border border-lol-border rounded-lg">
            <div className="px-4 py-3 border-b border-lol-border">
              <h2 className="font-semibold text-lol-gold-light">📋 Danh Sách Giải Đấu</h2>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              {tournaments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Chưa có giải đấu nào. Tạo giải mới để bắt đầu!
                </p>
              ) : (
                tournaments.map((t) => (
                  <TournamentRow
                    key={t.id}
                    tournament={t}
                    isSelected={selectedTournament?.id === t.id}
                    onClick={() => setSelectedTournament(
                      selectedTournament?.id === t.id ? null : t,
                    )}
                    onDelete={() => handleDelete(t.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chi tiết giải đấu */}
        <div className="xl:col-span-2">
          {selectedTournament ? (
            <TournamentDetail
              tournament={selectedTournament}
              simulating={simulating}
              simError={simError}
              onSimulateNext={handleSimulateNext}
              onSimulateAll={handleSimulateAll}
            />
          ) : (
            <div className="bg-lol-panel border border-lol-border rounded-lg flex items-center justify-center min-h-[300px]">
              <p className="text-gray-500 text-sm">Chọn một giải đấu để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function CreateTournamentForm({
  teams,
  newName,
  setNewName,
  selectedTeamIds,
  toggleTeam,
  matchFormat,
  setMatchFormat,
  creating,
  createError,
  onSubmit,
}: {
  teams: Team[];
  newName: string;
  setNewName: (v: string) => void;
  selectedTeamIds: number[];
  toggleTeam: (id: number) => void;
  matchFormat: 'bo1' | 'bo3' | 'bo5';
  setMatchFormat: (v: 'bo1' | 'bo3' | 'bo5') => void;
  creating: boolean;
  createError: string;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-5 mb-6">
      <h2 className="font-semibold text-lol-gold-light text-lg mb-4">⚙️ Tạo Giải Đấu Mới</h2>

      {/* Tên giải */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Tên giải đấu</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="VD: VCS Summer 2025"
          className="
            w-full bg-lol-border/30 border border-lol-border rounded-md px-3 py-2
            text-lol-gold-light text-sm focus:outline-none focus:border-lol-gold
          "
        />
      </div>

      {/* Định dạng trận */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-2">Định dạng trận</label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMatchFormat(opt.value)}
              className={`
                flex-1 py-2 rounded-md text-sm font-medium transition-all border
                ${matchFormat === opt.value
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

      {/* Chọn đội */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-2">
          Chọn đội tham gia ({selectedTeamIds.length} đội đã chọn)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {teams.map((t) => {
            const selected = selectedTeamIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTeam(t.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md text-xs border transition-all
                  ${selected
                    ? 'bg-lol-gold/20 border-lol-gold text-lol-gold'
                    : 'bg-lol-border/20 border-lol-border text-gray-400 hover:text-lol-gold-light'
                  }
                `}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: t.primaryColor || '#888' }}
                />
                <span className="truncate">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {createError && (
        <p className="text-red-400 text-sm mb-3">{createError}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={creating}
        className="
          w-full py-2.5 rounded-lg font-bold text-lol-dark bg-lol-gold
          hover:bg-lol-gold/80 transition-colors disabled:opacity-40
          disabled:cursor-not-allowed text-sm
        "
      >
        {creating ? '⏳ Đang tạo...' : '🏆 TẠO GIẢI ĐẤU'}
      </button>
    </div>
  );
}

function TournamentRow({
  tournament,
  isSelected,
  onClick,
  onDelete,
}: {
  tournament: Tournament;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[tournament.status];
  const completedCount = tournament.schedule.filter((m) => m.status === 'completed').length;
  const totalCount = tournament.schedule.length;

  return (
    <div
      className={`
        group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
        ${isSelected
          ? 'bg-lol-gold/10 border-lol-gold/40'
          : 'bg-lol-border/20 border-transparent hover:bg-lol-border/40'
        }
      `}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lol-gold-light truncate">{tournament.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
          <span className="text-xs text-gray-600">
            {completedCount}/{totalCount} trận • {tournament.teams.length} đội
          </span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-gray-600 hover:text-red-400 ml-2 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        title="Xóa giải đấu"
      >
        🗑️
      </button>
    </div>
  );
}

function TournamentDetail({
  tournament,
  simulating,
  simError,
  onSimulateNext,
  onSimulateAll,
}: {
  tournament: Tournament;
  simulating: boolean;
  simError: string;
  onSimulateNext: () => void;
  onSimulateAll: () => void;
}) {
  const [tab, setTab] = useState<'standings' | 'schedule'>('standings');
  const cfg = STATUS_CONFIG[tournament.status];
  const pendingCount = tournament.schedule.filter((m) => m.status === 'pending').length;
  const winnerTeam = tournament.winnerId
    ? tournament.teams.find((t) => t.id === tournament.winnerId)
    : null;

  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-lol-border">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-lol-gold-light">{tournament.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
              <span className="text-xs text-gray-500">
                {tournament.matchFormat.toUpperCase()} • {tournament.teams.length} đội •{' '}
                {tournament.schedule.length} trận
              </span>
            </div>
          </div>

          {/* Nút mô phỏng */}
          {tournament.status !== 'completed' && pendingCount > 0 && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onSimulateNext}
                disabled={simulating}
                className="
                  px-4 py-2 rounded-md text-sm font-medium border border-lol-gold/40
                  text-lol-gold hover:bg-lol-gold/10 transition-colors disabled:opacity-40
                "
              >
                {simulating ? '⏳' : '▶ Trận tiếp theo'}
              </button>
              <button
                onClick={onSimulateAll}
                disabled={simulating}
                className="
                  px-4 py-2 rounded-md text-sm font-bold bg-lol-gold text-lol-dark
                  hover:bg-lol-gold/80 transition-colors disabled:opacity-40
                "
              >
                {simulating ? '⏳ Đang mô phỏng...' : '⚡ Mô phỏng tất cả'}
              </button>
            </div>
          )}
        </div>

        {/* Vô địch */}
        {winnerTeam && (
          <div
            className="mt-4 p-3 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: winnerTeam.primaryColor + '30', borderColor: winnerTeam.secondaryColor, borderWidth: 1 }}
          >
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-xs text-gray-400">Vô Địch</p>
              <p className="font-bold text-lg" style={{ color: winnerTeam.secondaryColor }}>
                {winnerTeam.name}
              </p>
            </div>
          </div>
        )}

        {simError && <p className="text-red-400 text-sm mt-3">{simError}</p>}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-lol-border">
        {(['standings', 'schedule'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              flex-1 py-2.5 text-sm font-medium transition-all
              ${tab === t
                ? 'bg-lol-gold/10 text-lol-gold border-b-2 border-lol-gold'
                : 'text-gray-500 hover:text-gray-300'
              }
            `}
          >
            {t === 'standings' ? '📊 Bảng Xếp Hạng' : '📅 Lịch Thi Đấu'}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="p-4">
        {tab === 'standings' ? (
          <StandingsTable standings={tournament.standings} winnerId={tournament.winnerId} />
        ) : (
          <ScheduleList schedule={tournament.schedule} />
        )}
      </div>
    </div>
  );
}

function StandingsTable({
  standings,
  winnerId,
}: {
  standings: Tournament['standings'];
  winnerId: number | null;
}) {
  if (standings.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">Chưa có dữ liệu xếp hạng.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase border-b border-lol-border">
            <th className="pb-2 text-left w-8">#</th>
            <th className="pb-2 text-left">Đội</th>
            <th className="pb-2 text-center">W</th>
            <th className="pb-2 text-center">L</th>
            <th className="pb-2 text-center">Điểm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lol-border/30">
          {standings.map((s, i) => (
            <tr
              key={s.teamId}
              className={`transition-colors ${s.teamId === winnerId ? 'bg-lol-gold/5' : ''}`}
            >
              <td className="py-2.5 text-gray-500 text-xs">{i + 1}</td>
              <td className="py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.primaryColor }}
                  />
                  <span
                    className="font-medium"
                    style={{ color: s.teamId === winnerId ? s.secondaryColor : undefined }}
                  >
                    {s.teamId === winnerId ? '🏆 ' : ''}{s.teamName}
                  </span>
                </div>
              </td>
              <td className="py-2.5 text-center text-emerald-400 font-bold">{s.wins}</td>
              <td className="py-2.5 text-center text-red-400">{s.losses}</td>
              <td className="py-2.5 text-center text-lol-gold font-bold">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScheduleList({ schedule }: { schedule: TournamentMatch[] }) {
  if (schedule.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">Chưa có lịch thi đấu.</p>;
  }

  return (
    <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
      {schedule.map((m, i) => (
        <div
          key={i}
          className={`
            flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm
            ${m.status === 'completed'
              ? 'bg-lol-border/20 border-lol-border/30'
              : 'bg-lol-border/10 border-dashed border-lol-border/30'
            }
          `}
        >
          {/* Đội 1 */}
          <span
            className={`font-medium flex-1 text-left ${
              m.status === 'completed' && m.winnerId === m.team1Id
                ? 'text-lol-gold'
                : 'text-gray-300'
            }`}
          >
            {m.status === 'completed' && m.winnerId === m.team1Id ? '🏆 ' : ''}
            {m.team1Name}
          </span>

          {/* Tỉ số */}
          <div className="text-center px-4 w-24 shrink-0">
            {m.status === 'completed' ? (
              <span className="font-bold text-lol-gold-light">
                {m.team1Score} — {m.team2Score}
              </span>
            ) : (
              <span className="text-xs text-gray-600 uppercase tracking-wider">vs</span>
            )}
          </div>

          {/* Đội 2 */}
          <span
            className={`font-medium flex-1 text-right ${
              m.status === 'completed' && m.winnerId === m.team2Id
                ? 'text-lol-gold'
                : 'text-gray-300'
            }`}
          >
            {m.team2Name}
            {m.status === 'completed' && m.winnerId === m.team2Id ? ' 🏆' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

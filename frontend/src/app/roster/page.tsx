'use client';
// Trang Đội Hình - Hiển thị tất cả tuyển thủ theo đội
// Có thể lọc theo đội và vị trí

import { useEffect, useState } from 'react';
import { playerApi, teamApi } from '@/lib/api';
import { Player, PlayerRole, Team } from '@/types';
import PlayerCard from '@/components/PlayerCard';
import StatBar from '@/components/StatBar';

const roleOrder: PlayerRole[] = ['TopLane', 'Jungle', 'MidLane', 'ADC', 'Support'];
const roleLabels: Record<PlayerRole, string> = {
  TopLane: '🛡️ Top',
  Jungle: '🌲 Rừng',
  MidLane: '⚡ Mid',
  ADC: '🎯 ADC',
  Support: '💚 Support',
};

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Lọc theo đội (null = tất cả)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  // Lọc theo vị trí (null = tất cả)
  const [selectedRole, setSelectedRole] = useState<PlayerRole | null>(null);
  // Tuyển thủ đang xem chi tiết
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [playersData, teamsData] = await Promise.all([
        playerApi.getAll(),
        teamApi.getAll(),
      ]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch (err) {
      setError('Không thể tải dữ liệu. Đảm bảo backend đang chạy.');
    } finally {
      setLoading(false);
    }
  }

  // Lọc danh sách tuyển thủ theo điều kiện đã chọn
  const filteredPlayers = players.filter((p) => {
    if (selectedTeamId && p.teamId !== selectedTeamId) return false;
    if (selectedRole && p.mainRole !== selectedRole) return false;
    return true;
  });

  // Sắp xếp theo thứ tự vai trò
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aIdx = roleOrder.indexOf(a.mainRole);
    const bIdx = roleOrder.indexOf(b.mainRole);
    if (aIdx !== bIdx) return aIdx - bIdx;
    return b.ovr - a.ovr;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ===== TIÊU ĐỀ ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">⚔️ Quản Lý Đội Hình</h1>
        <p className="text-gray-400">Xem và quản lý tuyển thủ của các đội tuyển</p>
      </div>

      {/* ===== LỖI ===== */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="text-lol-gold animate-pulse">⚡ Đang tải tuyển thủ...</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ===== BỘ LỌC ===== */}
          {/* flex flex-wrap gap-3: bọc xuống dòng khi không đủ chỗ */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Lọc theo đội */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Đội tuyển</label>
              {/* flex: xếp các nút cạnh nhau */}
              <div className="flex flex-wrap gap-1">
                <FilterButton
                  active={selectedTeamId === null}
                  onClick={() => setSelectedTeamId(null)}
                >
                  Tất cả
                </FilterButton>
                {teams.map((team) => (
                  <FilterButton
                    key={team.id}
                    active={selectedTeamId === team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    {team.name}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Lọc theo vị trí */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Vị trí</label>
              <div className="flex flex-wrap gap-1">
                <FilterButton
                  active={selectedRole === null}
                  onClick={() => setSelectedRole(null)}
                >
                  Tất cả
                </FilterButton>
                {roleOrder.map((role) => (
                  <FilterButton
                    key={role}
                    active={selectedRole === role}
                    onClick={() => setSelectedRole(role)}
                  >
                    {roleLabels[role]}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SỐ KẾT QUẢ ===== */}
          <p className="text-sm text-gray-400 mb-4">
            Hiển thị {sortedPlayers.length} / {players.length} tuyển thủ
          </p>

          {/* ===== LAYOUT CHÍNH ===== */}
          <div className="flex gap-6">
            {/* Danh sách tuyển thủ */}
            {/* Khi có panel chi tiết: thu lại, khi không có: toàn chiều rộng */}
            <div className={`flex-1 ${selectedPlayer ? 'max-w-2xl' : ''}`}>
              {sortedPlayers.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-4xl mb-3">😔</p>
                  <p>Không tìm thấy tuyển thủ phù hợp</p>
                </div>
              ) : (
                /* grid auto-fill: tự động tính số cột dựa theo min-width */
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {sortedPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onClick={(p) => setSelectedPlayer(
                        selectedPlayer?.id === p.id ? null : p
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ===== PANEL CHI TIẾT TUYỂN THỦ ===== */}
            {selectedPlayer && (
              <div className="w-80 shrink-0">
                <PlayerDetailPanel
                  player={selectedPlayer}
                  onClose={() => setSelectedPlayer(null)}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ===== HELPER COMPONENTS =====

// Nút lọc
function FilterButton({ children, active, onClick }: {
  children: React.ReactNode; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md text-xs font-medium transition-all
        ${active
          ? 'bg-lol-gold text-lol-dark font-bold'
          : 'bg-lol-panel border border-lol-border text-gray-400 hover:text-lol-gold-light'
        }
      `}
    >
      {children}
    </button>
  );
}

// Panel chi tiết tuyển thủ
function PlayerDetailPanel({ player, onClose }: { player: Player; onClose: () => void }) {
  return (
    // sticky top-20: dính vào vị trí khi scroll
    // max-h-[80vh] overflow-y-auto: giới hạn chiều cao và scroll dọc
    <div className="sticky top-20 bg-lol-panel border border-lol-border rounded-lg overflow-hidden max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-lol-border">
        <h3 className="font-bold text-lol-gold">{player.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Thông tin cơ bản */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lol-gold/30 to-lol-border 
                          flex items-center justify-center text-2xl font-bold text-lol-gold border-2 border-lol-gold/30">
            {player.name.charAt(0)}
          </div>
          <div>
            <p className="text-gray-400 text-xs">{player.nationality} • {player.age} tuổi</p>
            <p className="text-gray-400 text-xs">{player.team?.name || 'Tự do'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-lol-gold">{player.ovr}</span>
              <span className="text-gray-500 text-sm">OVR</span>
              <span className="text-lol-blue text-sm">/ {player.potential} POT</span>
            </div>
          </div>
        </div>

        {/* KỸ NĂNG KỸ THUẬT */}
        <div>
          <p className="text-xs font-semibold text-lol-gold mb-2 uppercase tracking-wider">
            ⚙️ Kỹ Thuật
          </p>
          <div className="space-y-1.5">
            <StatBar label="Kỹ thuật" value={player.mechanics} />
            <StatBar label="Đường đấu" value={player.laning} />
            <StatBar label="Farm" value={player.farming} />
            <StatBar label="Teamfight" value={player.teamfighting} />
            <StatBar label="Đa năng" value={player.versatility} />
            <StatBar label="Kiting" value={player.kiting} />
            <StatBar label="Smite" value={player.smite} />
            <StatBar label="Tầm nhìn" value={player.visionControl} />
          </div>
        </div>

        {/* TƯ DUY & TINH THẦN */}
        <div>
          <p className="text-xs font-semibold text-lol-blue mb-2 uppercase tracking-wider">
            🧠 Tư Duy
          </p>
          <div className="space-y-1.5">
            <StatBar label="Bản đồ" value={player.mapAwareness} color="bg-blue-500" />
            <StatBar label="Vị trí" value={player.positioning} color="bg-blue-500" />
            <StatBar label="Quyết định" value={player.decisionMaking} color="bg-blue-500" />
            <StatBar label="Chỉ huy" value={player.shotcalling} color="bg-blue-500" />
            <StatBar label="Hung hăng" value={player.aggression} color="bg-blue-500" />
            <StatBar label="Bình tĩnh" value={player.composure} color="bg-blue-500" />
          </div>
        </div>

        {/* CHỈ SỐ ẨN */}
        <div>
          <p className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">
            🔮 Ẩn
          </p>
          <div className="space-y-1.5">
            <StatBar label="Ổn định" value={player.consistency} color="bg-purple-500" />
            <StatBar label="Trận lớn" value={player.importantMatches} color="bg-purple-500" />
            <StatBar label="Thích nghi" value={player.adaptability} color="bg-purple-500" />
            <StatBar label="Chuyên nghiệp" value={player.professionalism} color="bg-purple-500" />
            <StatBar label="Trung thành" value={player.loyalty} color="bg-purple-500" />
          </div>
        </div>

        {/* LƯƠNG */}
        <div className="pt-3 border-t border-lol-border">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Lương hàng năm</span>
            <span className="text-lol-gold font-bold">${player.salary.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

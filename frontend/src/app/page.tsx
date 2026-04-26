'use client';
// Dashboard - Màn hình chính của game
// Hiển thị: tổng quan đội, lịch thi đấu, thống kê

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { teamApi, playerApi, seedApi, tournamentApi } from '@/lib/api';
import { Team, Player, Tournament } from '@/types';

// Dữ liệu tin tức giả
const mockNews = [
  { id: 1, icon: '📰', text: 'Bản vá 15.8 ra mắt - Meta chuyển sang tướng Tank', time: '2 giờ trước' },
  { id: 2, icon: '🤝', text: 'Levi gia hạn hợp đồng với GAM Esports thêm 2 năm', time: '5 giờ trước' },
  { id: 3, icon: '⚠️', text: 'Kiaya bị chấn thương nhẹ - cần theo dõi', time: '1 ngày trước' },
  { id: 4, icon: '🏆', text: 'VCS Summer Split bắt đầu tuần tới', time: '2 ngày trước' },
];

export default function DashboardPage() {
  // State lưu dữ liệu từ API
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  // useEffect chạy 1 lần khi component mount để fetch dữ liệu
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      // Gọi đồng thời các API để tối ưu thời gian chờ
      const [teamsData, playersData, toursData] = await Promise.all([
        teamApi.getAll(),
        playerApi.getAll(),
        tournamentApi.getAll(),
      ]);
      setTeams(teamsData);
      setPlayers(playersData);
      setTournaments(toursData);
    } catch (err) {
      setError('Không thể kết nối đến server. Đảm bảo backend đang chạy tại port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Hàm gọi API seed để tạo dữ liệu mẫu
  async function handleSeed() {
    setSeeding(true);
    setSeedMsg('');
    try {
      const result = await seedApi.run();
      setSeedMsg(result.message);
      // Reload data sau khi seed
      await loadData();
    } catch (err) {
      setSeedMsg('Lỗi khi tạo dữ liệu mẫu. Kiểm tra kết nối backend.');
    } finally {
      setSeeding(false);
    }
  }

  // Tìm tuyển thủ OVR cao nhất
  const topPlayer = players.length
    ? players.reduce((best, p) => p.ovr > (best?.ovr || 0) ? p : best, players[0])
    : null;

  return (
    // max-w-7xl mx-auto: giới hạn chiều rộng và căn giữa
    // px-4: padding ngang để không sát mép trên mobile
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ===== TIÊU ĐỀ TRANG ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">⚡ Dashboard</h1>
        <p className="text-gray-400">Chào mừng trở lại, HLV trưởng!</p>
      </div>

      {/* ===== THÔNG BÁO LỖI ===== */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
          <p>{error}</p>
          <p className="text-sm mt-1 text-red-400">
            Hãy chạy backend: <code className="bg-red-900/50 px-1 rounded">cd backend && npm run start:dev</code>
          </p>
        </div>
      )}

      {/* ===== NÚT SEED DỮ LIỆU ===== */}
      {!loading && teams.length === 0 && !error && (
        <div className="mb-6 p-4 bg-lol-gold/10 border border-lol-gold/30 rounded-lg">
          <p className="text-lol-gold mb-2">Database trống. Tạo dữ liệu mẫu để bắt đầu?</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-lol-gold text-lol-dark font-bold px-4 py-2 rounded-md 
                       hover:bg-lol-gold/80 transition-colors disabled:opacity-50"
          >
            {seeding ? '⏳ Đang tạo...' : '🌱 Tạo Dữ Liệu Mẫu'}
          </button>
          {seedMsg && <p className="mt-2 text-green-400 text-sm">{seedMsg}</p>}
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-lol-gold text-xl animate-pulse">⚡ Đang tải dữ liệu...</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ===== THỐNG KÊ NHANH ===== */}
          {/* grid grid-cols-2 md:grid-cols-4: 2 cột trên mobile, 4 cột trên desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon="🏟️" label="Đội tuyển" value={teams.length} color="lol-gold" />
            <StatCard icon="⚔️" label="Tuyển thủ" value={players.length} color="lol-blue" />
            <StatCard icon="⭐" label="OVR Cao nhất" value={topPlayer?.ovr || 0} color="green" />
            <StatCard icon="🏆" label="Giải Đấu" value={tournaments.length} color="yellow" />
          </div>

          {/* ===== LAYOUT CHÍNH: 2 cột trên desktop ===== */}
          {/* grid-cols-1: 1 cột trên mobile | lg:grid-cols-3: 3 cột trên màn lớn */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ===== CỘT TRÁI (chiếm 2/3) ===== */}
            <div className="lg:col-span-2 space-y-6">

              {/* Danh sách đội tuyển */}
              <Section title="🏟️ Đội Tuyển VCS" action={<Link href="/roster" className="text-xs text-lol-blue hover:underline">Xem tất cả →</Link>}>
                {teams.length === 0 ? (
                  <EmptyState text="Chưa có đội tuyển. Nhấn 'Tạo Dữ Liệu Mẫu' để bắt đầu." />
                ) : (
                  <div className="space-y-3">
                    {teams.map((team) => (
                      <TeamRow key={team.id} team={team} players={players} />
                    ))}
                  </div>
                )}
              </Section>

              {/* Giải đấu đang diễn ra */}
              <Section
                title="📅 Giải Đấu"
                action={<Link href="/tournament" className="text-xs text-lol-blue hover:underline">Xem tất cả →</Link>}
              >
                {tournaments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-3">Chưa có giải đấu nào.</p>
                    <Link
                      href="/tournament"
                      className="text-xs text-lol-gold border border-lol-gold/40 px-3 py-1.5 rounded-md hover:bg-lol-gold/10 transition-colors"
                    >
                      🏆 Tạo giải đấu đầu tiên
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tournaments.slice(0, 3).map((t) => {
                      const completed = t.schedule.filter((m) => m.status === 'completed').length;
                      const total = t.schedule.length;
                      const leader = t.standings[0];
                      return (
                        <Link
                          key={t.id}
                          href="/tournament"
                          className="flex items-center justify-between p-3 bg-lol-border/30 rounded-lg hover:bg-lol-border/50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-lol-gold-light">{t.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {t.matchFormat.toUpperCase()} • {completed}/{total} trận
                              {leader ? ` • Dẫn đầu: ${leader.teamName}` : ''}
                            </p>
                          </div>
                          <span className={`text-xs font-medium ${
                            t.status === 'completed' ? 'text-lol-gold' :
                            t.status === 'ongoing' ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {t.status === 'completed' ? '✅ Kết thúc' :
                             t.status === 'ongoing' ? '🔴 Đang diễn ra' : '⏳ Chờ'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </Section>
            </div>

            {/* ===== CỘT PHẢI (chiếm 1/3) ===== */}
            <div className="space-y-6">
              {/* Tin tức */}
              <Section title="📰 Tin Tức & Sự Kiện">
                <div className="space-y-3">
                  {mockNews.map((news) => (
                    <div key={news.id} className="flex gap-3 text-sm">
                      <span className="text-xl shrink-0">{news.icon}</span>
                      <div>
                        <p className="text-gray-300 text-xs leading-relaxed">{news.text}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{news.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Top tuyển thủ */}
              <Section title="🏆 Xếp Hạng Tuyển Thủ" action={<Link href="/roster" className="text-xs text-lol-blue hover:underline">Chi tiết →</Link>}>
                <div className="space-y-2">
                  {players
                    .sort((a, b) => b.ovr - a.ovr)
                    .slice(0, 5)
                    .map((player, idx) => (
                      <div key={player.id} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500 w-4">{idx + 1}</span>
                        <div className="w-7 h-7 rounded-full bg-lol-border flex items-center 
                                        justify-center text-xs font-bold text-lol-gold">
                          {player.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200 truncate text-xs">{player.name}</p>
                          <p className="text-gray-500 text-xs">{player.team?.name || 'Tự do'}</p>
                        </div>
                        <span className="text-lol-gold font-bold text-sm">{player.ovr}</span>
                      </div>
                    ))}
                </div>
              </Section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ===== HELPER COMPONENTS =====

// Component thẻ thống kê
// Dùng mapping object thay vì template literal vì Tailwind dùng static analysis
const statColorMap: Record<string, string> = {
  'lol-gold': 'text-yellow-400',
  'lol-blue': 'text-cyan-400',
  'green': 'text-green-400',
  'yellow': 'text-yellow-400',
};

function StatCard({ icon, label, value, color }: {
  icon: string; label: string; value: number | string; color: string
}) {
  const colorClass = statColorMap[color] || 'text-gray-300';
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}

// Component section với tiêu đề
function Section({ title, children, action }: {
  title: string; children: React.ReactNode; action?: React.ReactNode
}) {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg">
      {/* Tiêu đề section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-lol-border">
        <h2 className="font-semibold text-lol-gold-light">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// Component dòng thông tin đội
function TeamRow({ team, players }: { team: Team; players: Player[] }) {
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const avgOvr = teamPlayers.length
    ? Math.round(teamPlayers.reduce((s, p) => s + p.ovr, 0) / teamPlayers.length)
    : 0;

  return (
    <div className="flex items-center gap-3 p-3 bg-lol-border/20 rounded-lg">
      {/* Avatar đội */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: team.primaryColor + '40', color: team.secondaryColor }}
      >
        {team.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lol-gold-light">{team.name}</p>
        <p className="text-xs text-gray-500">{team.region} • {teamPlayers.length} tuyển thủ</p>
      </div>
      <div className="text-right">
        <p className="text-lol-gold font-bold">{avgOvr}</p>
        <p className="text-xs text-gray-500">OVR TB</p>
      </div>
    </div>
  );
}

// Component khi không có dữ liệu
function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-6 text-gray-500">
      <p className="text-2xl mb-2">📭</p>
      <p className="text-sm">{text}</p>
    </div>
  );
}

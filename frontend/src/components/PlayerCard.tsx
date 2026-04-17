// Component hiển thị thẻ tuyển thủ (Player Card)
import { Player, PlayerRole } from '@/types';
import StatBar from './StatBar';

interface PlayerCardProps {
  player: Player;
  // Callback khi click vào card (tuỳ chọn)
  onClick?: (player: Player) => void;
}

// Map vị trí sang icon và màu
const roleConfig: Record<PlayerRole, { icon: string; color: string; label: string }> = {
  TopLane: { icon: '🛡️', color: 'text-orange-400', label: 'Top' },
  Jungle: { icon: '🌲', color: 'text-green-400', label: 'Rừng' },
  MidLane: { icon: '⚡', color: 'text-blue-400', label: 'Mid' },
  ADC: { icon: '🎯', color: 'text-red-400', label: 'ADC' },
  Support: { icon: '💚', color: 'text-teal-400', label: 'Support' },
};

// Hàm tính màu OVR dựa theo giá trị
function getOvrColor(ovr: number): string {
  if (ovr >= 85) return 'text-yellow-300';
  if (ovr >= 75) return 'text-lol-gold';
  if (ovr >= 65) return 'text-gray-300';
  return 'text-gray-500';
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  const role = roleConfig[player.mainRole] || roleConfig.MidLane;

  return (
    // card-hover: class CSS tự định nghĩa cho hiệu ứng hover
    // cursor-pointer: con trỏ dạng tay khi hover
    <div
      className="card-hover bg-lol-panel border border-lol-border rounded-lg p-4 cursor-pointer"
      onClick={() => onClick?.(player)}
    >
      {/* Header: Avatar + tên + vai trò */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar placeholder - hình tròn với chữ đầu tên */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lol-border to-gray-700 
                        flex items-center justify-center text-lg font-bold text-lol-gold shrink-0">
          {player.name.charAt(0).toUpperCase()}
        </div>

        {/* Thông tin chính */}
        <div className="flex-1 min-w-0">
          {/* Tên tuyển thủ */}
          <h3 className="font-semibold text-lol-gold-light truncate">{player.name}</h3>
          {/* Vai trò + quốc tịch */}
          <div className="flex items-center gap-2 text-xs mt-0.5">
            <span className={role.color}>{role.icon} {role.label}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{player.nationality}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{player.age} tuổi</span>
          </div>
        </div>

        {/* OVR badge */}
        <div className="text-right shrink-0">
          <div className={`text-2xl font-bold ${getOvrColor(player.ovr)}`}>{player.ovr}</div>
          <div className="text-xs text-gray-500">OVR</div>
        </div>
      </div>

      {/* Tiềm năng */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Tiềm năng:</span>
        <span className="text-xs text-lol-blue font-medium">{player.potential}</span>
        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-lol-blue/60 rounded-full"
            style={{ width: `${player.potential}%` }}
          />
        </div>
      </div>

      {/* Chỉ số kỹ thuật chính */}
      <div className="space-y-1.5">
        <StatBar label="Kỹ thuật" value={player.mechanics} />
        <StatBar label="Đường đấu" value={player.laning} />
        <StatBar label="Farm" value={player.farming} />
        <StatBar label="Teamfight" value={player.teamfighting} />
      </div>

      {/* Lương */}
      <div className="mt-3 pt-3 border-t border-lol-border flex justify-between items-center">
        <span className="text-xs text-gray-500">Lương/năm</span>
        <span className="text-xs text-lol-gold font-medium">
          ${player.salary.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// Component hiển thị thẻ tướng (Champion Card)
import { Champion, DamageType } from '@/types';
import StatBar from './StatBar';

interface ChampionCardProps {
  champion: Champion;
  onClick?: (champion: Champion) => void;
}

// Map DamageType sang màu sắc
const damageTypeConfig: Record<DamageType, { label: string; color: string }> = {
  Physical: { label: 'Vật lý', color: 'text-orange-400' },
  Magic: { label: 'Phép', color: 'text-purple-400' },
  Mixed: { label: 'Hỗn hợp', color: 'text-yellow-400' },
};

// Map role sang label tiếng Việt
const roleLabels: Record<string, string> = {
  TopLane: 'Top',
  Jungle: 'Rừng',
  MidLane: 'Mid',
  ADC: 'ADC',
  Support: 'Sup',
};

export default function ChampionCard({ champion, onClick }: ChampionCardProps) {
  const dmgConfig = damageTypeConfig[champion.damageType];

  return (
    <div
      className="card-hover bg-lol-panel border border-lol-border rounded-lg p-4 cursor-pointer"
      onClick={() => onClick?.(champion)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar với chữ đầu tên */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lol-gold/20 to-lol-border 
                        flex items-center justify-center text-lg font-bold text-lol-gold shrink-0 border border-lol-gold/30">
          {champion.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lol-gold-light truncate">{champion.name}</h3>
          {/* Loại sát thương */}
          <span className={`text-xs ${dmgConfig.color}`}>{dmgConfig.label}</span>
        </div>

        {/* Độ khó */}
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-lol-gold">{champion.difficulty}/10</div>
          <div className="text-xs text-gray-500">Độ khó</div>
        </div>
      </div>

      {/* Tags vai trò */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(champion.roles || []).map((role) => (
          <span
            key={role}
            className="text-xs px-2 py-0.5 rounded-full bg-lol-border text-gray-300"
          >
            {roleLabels[role] || role}
          </span>
        ))}
        {(champion.synergyTags || []).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-lol-gold/10 text-lol-gold border border-lol-gold/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Chỉ số vai trò chính (thang 0-10) */}
      <div className="space-y-1.5">
        <StatBar label="Sát thương" value={champion.damage} max={10} color="bg-red-500" />
        <StatBar label="Bền bỉ" value={champion.durability} max={10} color="bg-blue-500" />
        <StatBar label="Khống chế" value={champion.crowdControl} max={10} color="bg-purple-500" />
        <StatBar label="Cơ động" value={champion.mobility} max={10} color="bg-green-500" />
      </div>

      {/* Chỉ số cơ bản */}
      <div className="mt-3 pt-3 border-t border-lol-border grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-gray-500">HP</div>
          <div className="text-lol-gold-light font-medium">{champion.hp}</div>
        </div>
        <div>
          <div className="text-gray-500">AD</div>
          <div className="text-lol-gold-light font-medium">{champion.attackDamage}</div>
        </div>
        <div>
          <div className="text-gray-500">Tầm đánh</div>
          <div className="text-lol-gold-light font-medium">{champion.attackRange}</div>
        </div>
      </div>
    </div>
  );
}

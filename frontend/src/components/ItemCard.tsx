// Component hiển thị thẻ trang bị (Item Card)
import { Item } from '@/types';

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

// Màu cho từng tag
const tagColors: Record<string, string> = {
  Offense: 'bg-red-900/40 text-red-300 border-red-700/40',
  Defense: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  Utility: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  Boots: 'bg-green-900/40 text-green-300 border-green-700/40',
  Jungle: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
};

export default function ItemCard({ item, onClick }: ItemCardProps) {
  // Chỉ hiện các chỉ số khác 0
  const stats: { label: string; value: number | string; icon: string }[] = [
    ...(item.ad > 0 ? [{ label: 'AD', value: `+${item.ad}`, icon: '⚔️' }] : []),
    ...(item.ap > 0 ? [{ label: 'AP', value: `+${item.ap}`, icon: '✨' }] : []),
    ...(item.armor > 0 ? [{ label: 'Giáp', value: `+${item.armor}`, icon: '🛡️' }] : []),
    ...(item.mr > 0 ? [{ label: 'Kháng phép', value: `+${item.mr}`, icon: '💜' }] : []),
    ...(item.hp > 0 ? [{ label: 'HP', value: `+${item.hp}`, icon: '❤️' }] : []),
    ...(item.mana > 0 ? [{ label: 'Mana', value: `+${item.mana}`, icon: '💧' }] : []),
    ...(item.attackSpeed > 0 ? [{ label: 'Tốc đánh', value: `+${item.attackSpeed}%`, icon: '⚡' }] : []),
    ...(item.critChance > 0 ? [{ label: 'Chí mạng', value: `+${item.critChance}%`, icon: '🎯' }] : []),
    ...(item.haste > 0 ? [{ label: 'Haste', value: `+${item.haste}`, icon: '⏱️' }] : []),
  ];

  return (
    <div
      className="card-hover bg-lol-panel border border-lol-border rounded-lg p-4 cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Icon trang bị */}
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-lol-gold/30 to-lol-border 
                        flex items-center justify-center text-xl shrink-0 border border-lol-gold/20">
          🗡️
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lol-gold-light text-sm">{item.name}</h3>
          {/* Giá vàng */}
          <span className="text-xs text-lol-gold">💰 {item.price.toLocaleString()} vàng</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(item.tags || []).map((tag) => (
          <span
            key={tag}
            className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[tag] || 'bg-gray-700 text-gray-300 border-gray-600'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Chỉ số */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-1 mb-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1 text-xs">
              <span>{stat.icon}</span>
              <span className="text-gray-400">{stat.label}:</span>
              <span className="text-lol-gold font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hiệu ứng đặc biệt */}
      {item.rule && (
        <div className="text-xs text-gray-400 bg-lol-border/50 rounded p-2 italic">
          {item.rule}
        </div>
      )}
    </div>
  );
}

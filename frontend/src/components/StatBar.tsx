// Component hiển thị thanh chỉ số (stat bar) - dùng ở nhiều nơi
interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export default function StatBar({ label, value, max = 20, color = 'bg-lol-gold' }: StatBarProps) {
  // Tính phần trăm để render thanh
  const percent = Math.min(100, (value / max) * 100);

  // Xác định màu sắc dựa vào giá trị
  const getBarColor = () => {
    if (color !== 'bg-lol-gold') return color;
    if (percent >= 75) return 'bg-lol-green';
    if (percent >= 50) return 'bg-lol-gold';
    if (percent >= 25) return 'bg-yellow-600';
    return 'bg-lol-red';
  };

  return (
    // flex items-center: xếp label và bar cạnh nhau nằm ngang
    <div className="flex items-center gap-2 text-xs">
      {/* Label bên trái, w-24 để cố định chiều rộng */}
      <span className="text-gray-400 w-28 shrink-0 truncate">{label}</span>
      {/* Thanh nền xám */}
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        {/* Thanh fill dựa theo % */}
        <div
          className={`h-full rounded-full stat-bar-fill ${getBarColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {/* Số điểm bên phải */}
      <span className="text-lol-gold-light w-6 text-right">{value}</span>
    </div>
  );
}

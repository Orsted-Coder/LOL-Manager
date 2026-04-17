'use client';
// Trang danh sách Tướng

import { useEffect, useState } from 'react';
import { championApi } from '@/lib/api';
import { Champion, DamageType } from '@/types';
import ChampionCard from '@/components/ChampionCard';
import StatBar from '@/components/StatBar';

const damageTypes: DamageType[] = ['Physical', 'Magic', 'Mixed'];
const damageLabels: Record<DamageType, string> = {
  Physical: '⚔️ Vật lý',
  Magic: '✨ Phép',
  Mixed: '🌀 Hỗn hợp',
};

export default function ChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<DamageType | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);  // plain string to match roles array elements
  const [selected, setSelected] = useState<Champion | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    championApi.getAll()
      .then(setChampions)
      .catch(() => setError('Không thể tải danh sách tướng.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = champions.filter((c) => {
    if (filter && c.damageType !== filter) return false;
    if (roleFilter && !(c.roles as string[] || []).includes(roleFilter)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">🐉 Danh Sách Tướng</h1>
        <p className="text-gray-400">Xem thông tin chi tiết tất cả các tướng</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-lol-gold animate-pulse">⚡ Đang tải tướng...</div>
        </div>
      ) : (
        <>
          {/* Bộ lọc và tìm kiếm */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Thanh tìm kiếm */}
            <input
              type="text"
              placeholder="🔍 Tìm tướng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-lol-panel border border-lol-border rounded-md px-3 py-2 text-sm 
                         text-lol-gold-light placeholder-gray-500 focus:outline-none focus:border-lol-gold"
            />

            {/* Lọc loại sát thương */}
            <div className="flex gap-1">
              <FilterBtn active={filter === null} onClick={() => setFilter(null)}>Tất cả</FilterBtn>
              {damageTypes.map((dt) => (
                <FilterBtn key={dt} active={filter === dt} onClick={() => setFilter(dt)}>
                  {damageLabels[dt]}
                </FilterBtn>
              ))}
            </div>

            {/* Lọc vị trí */}
            <div className="flex gap-1">
              {['TopLane', 'Jungle', 'MidLane', 'ADC', 'Support'].map((role) => (
                <FilterBtn
                  key={role}
                  active={roleFilter === role}
                  onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                >
                  {role === 'TopLane' ? 'Top' : role === 'MidLane' ? 'Mid' : role}
                </FilterBtn>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Hiển thị {filtered.length} / {champions.length} tướng
          </p>

          <div className="flex gap-6">
            <div className={`flex-1 ${selected ? 'max-w-2xl' : ''}`}>
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-4xl mb-3">🔍</p>
                  <p>Không tìm thấy tướng nào</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((champ) => (
                    <ChampionCard
                      key={champ.id}
                      champion={champ}
                      onClick={(c) => setSelected(selected?.id === c.id ? null : c)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Panel chi tiết tướng */}
            {selected && (
              <div className="w-80 shrink-0">
                <ChampionDetailPanel champion={selected} onClose={() => setSelected(null)} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function FilterBtn({ children, active, onClick }: {
  children: React.ReactNode; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
        ${active ? 'bg-lol-gold text-lol-dark font-bold' : 'bg-lol-panel border border-lol-border text-gray-400 hover:text-lol-gold-light'}`}
    >
      {children}
    </button>
  );
}

function ChampionDetailPanel({ champion, onClose }: { champion: Champion; onClose: () => void }) {
  return (
    <div className="sticky top-20 bg-lol-panel border border-lol-border rounded-lg overflow-hidden max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-lol-border">
        <h3 className="font-bold text-lol-gold">{champion.name}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="p-4 space-y-4">
        {/* Chỉ số vai trò */}
        <div>
          <p className="text-xs font-semibold text-lol-gold mb-2 uppercase tracking-wider">⚔️ Vai Trò</p>
          <div className="space-y-1.5">
            <StatBar label="Sát thương" value={champion.damage} max={10} color="bg-red-500" />
            <StatBar label="Bền bỉ" value={champion.durability} max={10} color="bg-blue-500" />
            <StatBar label="Khống chế" value={champion.crowdControl} max={10} color="bg-purple-500" />
            <StatBar label="Cơ động" value={champion.mobility} max={10} color="bg-green-500" />
            <StatBar label="Hỗ trợ" value={champion.utility} max={10} color="bg-teal-500" />
          </div>
        </div>

        {/* Chỉ số kỹ năng */}
        <div>
          <p className="text-xs font-semibold text-lol-blue mb-2 uppercase tracking-wider">🎯 Kỹ Năng</p>
          <div className="space-y-1.5">
            <StatBar label="Burst" value={champion.burstPotential} color="bg-lol-blue" />
            <StatBar label="DPS" value={champion.dpsPotential} color="bg-lol-blue" />
            <StatBar label="Dọn lính" value={champion.waveclearScore} color="bg-lol-blue" />
            <StatBar label="CC cứng" value={champion.hardCC} color="bg-lol-blue" />
            <StatBar label="CC mềm" value={champion.softCC} color="bg-lol-blue" />
            <StatBar label="Hồi/Khiên" value={champion.healShieldPower} color="bg-lol-blue" />
          </div>
        </div>

        {/* Chỉ số cơ bản */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">📊 Chỉ Số</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { l: 'HP', v: champion.hp }, { l: 'AD', v: champion.attackDamage },
              { l: 'Giáp', v: champion.armor }, { l: 'Kháng phép', v: champion.spellBlock },
              { l: 'Tốc đánh', v: champion.attackSpeed }, { l: 'Tầm đánh', v: champion.attackRange },
              { l: 'Tốc đi', v: champion.moveSpeed }, { l: 'Độ khó', v: `${champion.difficulty}/10` },
            ].map(({ l, v }) => (
              <div key={l} className="bg-lol-border/30 rounded p-2">
                <div className="text-gray-500">{l}</div>
                <div className="text-lol-gold font-medium">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

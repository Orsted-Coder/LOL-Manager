'use client';
// Trang danh sách Trang Bị

import { useEffect, useState } from 'react';
import { itemApi } from '@/lib/api';
import { Item } from '@/types';
import ItemCard from '@/components/ItemCard';

const tagFilters = ['Offense', 'Defense', 'Utility', 'Boots'];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Item | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    itemApi.getAll()
      .then(setItems)
      .catch(() => setError('Không thể tải danh sách trang bị.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    if (tagFilter && !(item.tags || []).includes(tagFilter)) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">🗡️ Danh Sách Trang Bị</h1>
        <p className="text-gray-400">15 trang bị cốt lõi + giày cho mỗi trận đấu</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-lol-gold animate-pulse">⚡ Đang tải trang bị...</div>
        </div>
      ) : (
        <>
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="🔍 Tìm trang bị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-lol-panel border border-lol-border rounded-md px-3 py-2 text-sm 
                         text-lol-gold-light placeholder-gray-500 focus:outline-none focus:border-lol-gold"
            />
            <div className="flex gap-1">
              <TagFilterBtn active={tagFilter === null} onClick={() => setTagFilter(null)}>
                Tất cả
              </TagFilterBtn>
              {tagFilters.map((tag) => (
                <TagFilterBtn
                  key={tag}
                  active={tagFilter === tag}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                >
                  {tag === 'Offense' ? '⚔️ Tấn công'
                    : tag === 'Defense' ? '🛡️ Phòng thủ'
                    : tag === 'Utility' ? '💜 Hỗ trợ'
                    : '👟 Giày'}
                </TagFilterBtn>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Hiển thị {filtered.length} / {items.length} trang bị
          </p>

          {/* Grid trang bị */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-3">🗡️</p>
              <p>Không tìm thấy trang bị nào</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={(i) => setSelected(selected?.id === i.id ? null : i)}
                />
              ))}
            </div>
          )}

          {/* Panel chi tiết */}
          {selected && (
            <div className="fixed bottom-4 right-4 w-80 bg-lol-panel border border-lol-gold/30 
                            rounded-lg p-4 shadow-gold z-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lol-gold">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <p className="text-xs text-gray-400 mb-2">💰 {selected.price.toLocaleString()} vàng</p>
              {selected.rule && (
                <p className="text-xs text-gray-300 italic bg-lol-border/50 rounded p-2">
                  {selected.rule}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TagFilterBtn({ children, active, onClick }: {
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

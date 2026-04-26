'use client';
// Trang Thị Trường Chuyển Nhượng - Phase 4
// Hiển thị: tuyển thủ tự do, danh sách rao bán, đề nghị, quản lý hợp đồng

import { useEffect, useState, useCallback } from 'react';
import { teamApi, playerApi, transferApi } from '@/lib/api';
import { Team, Player, PlayerRole, TransferOffer, TransferMarket, TeamOffers } from '@/types';

// ===== CONFIG =====
const roleLabels: Record<PlayerRole, string> = {
  TopLane: '🛡️ Top',
  Jungle: '🌲 Rừng',
  MidLane: '⚡ Mid',
  ADC: '🎯 ADC',
  Support: '💚 Support',
};

function getOvrColor(ovr: number) {
  if (ovr >= 85) return 'text-yellow-300';
  if (ovr >= 75) return 'text-lol-gold';
  if (ovr >= 65) return 'text-gray-300';
  return 'text-gray-500';
}

function fmt(n: number) {
  return `$${Number(n).toLocaleString()}`;
}

type Tab = 'market' | 'squad' | 'offers';

export default function TransferPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeamId, setMyTeamId] = useState<number | null>(null);
  const [market, setMarket] = useState<TransferMarket | null>(null);
  const [myPlayers, setMyPlayers] = useState<Player[]>([]);
  const [teamOffers, setTeamOffers] = useState<TeamOffers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const [tab, setTab] = useState<Tab>('market');

  // Modal trạng thái
  const [offerModal, setOfferModal] = useState<{ player: Player; isListed: boolean } | null>(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [listModal, setListModal] = useState<Player | null>(null);
  const [listFee, setListFee] = useState('');

  const myTeam = teams.find((t) => t.id === myTeamId) ?? null;

  const loadAll = useCallback(async (currentTeamId: number | null = null) => {
    try {
      setLoading(true);
      setError('');
      const [teamsData, marketData] = await Promise.all([
        teamApi.getAll(),
        transferApi.getMarket(),
      ]);
      setTeams(teamsData);
      setMarket(marketData);
      if (teamsData.length > 0 && currentTeamId === null) {
        setMyTeamId(teamsData[0].id);
      }
    } catch {
      setError('Không thể tải dữ liệu. Đảm bảo backend đang chạy.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTeamData = useCallback(async (teamId: number) => {
    try {
      const [playersData, offersData] = await Promise.all([
        playerApi.getAll(teamId),
        transferApi.getOffersByTeam(teamId),
      ]);
      setMyPlayers(playersData);
      setTeamOffers(offersData);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    loadAll(null);
  }, [loadAll]);

  useEffect(() => {
    if (myTeamId) {
      loadTeamData(myTeamId);
    }
  }, [myTeamId, loadTeamData]);

  async function handleTeamChange(id: number) {
    setMyTeamId(id);
    setActionMsg('');
    setActionError('');
    await loadTeamData(id);
  }

  function showMsg(msg: string) {
    setActionMsg(msg);
    setActionError('');
    setTimeout(() => setActionMsg(''), 4000);
  }
  function showErr(msg: string) {
    setActionError(msg);
    setActionMsg('');
    setTimeout(() => setActionError(''), 5000);
  }

  async function handleSignFreeAgent(player: Player) {
    if (!myTeamId) return;
    try {
      await transferApi.signFreeAgent(myTeamId, player.id);
      showMsg(`✅ Đã ký ${player.name} vào đội!`);
      await Promise.all([loadAll(myTeamId), loadTeamData(myTeamId)]);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi ký tuyển thủ');
    }
  }

  async function handleMakeOffer() {
    if (!myTeamId || !offerModal) return;
    const amount = parseInt(offerAmount);
    if (isNaN(amount) || amount < 0) {
      showErr('Số tiền không hợp lệ');
      return;
    }
    try {
      await transferApi.makeOffer(myTeamId, offerModal.player.id, amount);
      showMsg(`✅ Đã gửi đề nghị ${fmt(amount)} cho ${offerModal.player.name}!`);
      setOfferModal(null);
      setOfferAmount('');
      await loadTeamData(myTeamId);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi gửi đề nghị');
    }
  }

  async function handleListPlayer() {
    if (!listModal) return;
    const fee = parseInt(listFee);
    if (isNaN(fee) || fee < 0) {
      showErr('Phí chuyển nhượng không hợp lệ');
      return;
    }
    try {
      await transferApi.listPlayer(listModal.id, fee);
      showMsg(`✅ Đã rao bán ${listModal.name} với giá ${fmt(fee)}!`);
      setListModal(null);
      setListFee('');
      await Promise.all([loadAll(myTeamId), myTeamId ? loadTeamData(myTeamId) : Promise.resolve()]);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi rao bán');
    }
  }

  async function handleUnlist(player: Player) {
    try {
      await transferApi.unlistPlayer(player.id);
      showMsg(`✅ Đã gỡ ${player.name} khỏi danh sách rao bán`);
      await Promise.all([loadAll(myTeamId), myTeamId ? loadTeamData(myTeamId) : Promise.resolve()]);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi gỡ rao bán');
    }
  }

  async function handleRelease(player: Player) {
    if (!myTeamId) return;
    if (!confirm(`Thả ${player.name} ra thị trường tự do?`)) return;
    try {
      await transferApi.releasePlayer(myTeamId, player.id);
      showMsg(`✅ Đã thả ${player.name} ra thị trường tự do`);
      await Promise.all([loadAll(myTeamId), loadTeamData(myTeamId)]);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi thả tuyển thủ');
    }
  }

  async function handleAcceptOffer(offer: TransferOffer) {
    try {
      await transferApi.acceptOffer(offer.id);
      showMsg(`✅ Đã chấp nhận đề nghị mua ${offer.player.name} với giá ${fmt(offer.amount)}!`);
      await Promise.all([loadAll(myTeamId), myTeamId ? loadTeamData(myTeamId) : Promise.resolve()]);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi chấp nhận đề nghị');
    }
  }

  async function handleRejectOffer(offer: TransferOffer) {
    try {
      await transferApi.rejectOffer(offer.id);
      showMsg(`✅ Đã từ chối đề nghị`);
      if (myTeamId) await loadTeamData(myTeamId);
    } catch (e: any) {
      showErr(e.message || 'Lỗi khi từ chối đề nghị');
    }
  }

  const pendingIncoming = teamOffers?.incoming?.filter((o) => o.status === 'pending') ?? [];
  const offersTotal = pendingIncoming.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ===== TIÊU ĐỀ ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lol-gold mb-1">🔄 Thị Trường Chuyển Nhượng</h1>
        <p className="text-gray-400">Mua bán, ký kết và quản lý hợp đồng tuyển thủ</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 text-sm">
          {actionMsg}
        </div>
      )}
      {actionError && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          ❌ {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-lol-gold animate-pulse">⚡ Đang tải...</div>
        </div>
      ) : (
        <>
          {/* ===== CHỌN ĐỘI & THÔNG TIN NGÂN SÁCH ===== */}
          <div className="bg-lol-panel border border-lol-border rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Quản lý đội</label>
                <select
                  value={myTeamId ?? ''}
                  onChange={(e) => handleTeamChange(Number(e.target.value))}
                  className="bg-lol-border text-lol-gold-light px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-lol-gold"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.region})
                    </option>
                  ))}
                </select>
              </div>
              {myTeam && (
                <>
                  <BudgetStat label="💰 Ngân sách" value={fmt(myTeam.budget)} color="text-lol-gold" />
                  <BudgetStat label="💸 Tổng lương" value={fmt(myTeam.totalSalary)} color="text-red-400" />
                  <BudgetStat
                    label="🏦 Khả dụng"
                    value={fmt(Math.max(0, Number(myTeam.budget) - Number(myTeam.totalSalary)))}
                    color="text-green-400"
                  />
                  <BudgetStat label="👥 Tuyển thủ" value={`${myPlayers.length}`} color="text-lol-blue" />
                </>
              )}
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-2 mb-6 border-b border-lol-border">
            <TabButton active={tab === 'market'} onClick={() => setTab('market')}>
              🛒 Thị Trường ({(market?.freeAgents.length ?? 0) + (market?.listedPlayers.length ?? 0)})
            </TabButton>
            <TabButton active={tab === 'squad'} onClick={() => setTab('squad')}>
              ⚔️ Đội Hình ({myPlayers.length})
            </TabButton>
            <TabButton active={tab === 'offers'} onClick={() => setTab('offers')}>
              📨 Đề Nghị
              {offersTotal > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {offersTotal}
                </span>
              )}
            </TabButton>
          </div>

          {/* ===== TAB: THỊ TRƯỜNG ===== */}
          {tab === 'market' && market && (
            <div className="space-y-8">
              {/* Tuyển thủ tự do */}
              <Section title={`🆓 Tuyển Thủ Tự Do (${market.freeAgents.length})`}>
                {market.freeAgents.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Không có tuyển thủ tự do</p>
                ) : (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {market.freeAgents.map((p) => (
                      <PlayerMarketCard
                        key={p.id}
                        player={p}
                        isMine={p.teamId === myTeamId}
                        onSign={() => handleSignFreeAgent(p)}
                        onOffer={() => { setOfferModal({ player: p, isListed: false }); setOfferAmount(''); }}
                        isFreeAgent
                      />
                    ))}
                  </div>
                )}
              </Section>

              {/* Đang rao bán */}
              <Section title={`🏷️ Đang Rao Bán (${market.listedPlayers.length})`}>
                {market.listedPlayers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Không có tuyển thủ nào đang rao bán</p>
                ) : (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {market.listedPlayers.map((p) => (
                      <PlayerMarketCard
                        key={p.id}
                        player={p}
                        isMine={p.teamId === myTeamId}
                        onOffer={() => { setOfferModal({ player: p, isListed: true }); setOfferAmount(String(p.transferFee)); }}
                        onUnlist={() => handleUnlist(p)}
                      />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ===== TAB: ĐỘI HÌNH ===== */}
          {tab === 'squad' && (
            <Section title={`⚔️ Đội Hình ${myTeam?.name ?? ''}`}>
              {myPlayers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">Đội chưa có tuyển thủ</p>
              ) : (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {myPlayers.map((p) => (
                    <PlayerSquadCard
                      key={p.id}
                      player={p}
                      onList={() => { setListModal(p); setListFee(String(p.salary * 2)); }}
                      onUnlist={() => handleUnlist(p)}
                      onRelease={() => handleRelease(p)}
                    />
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* ===== TAB: ĐỀ NGHỊ ===== */}
          {tab === 'offers' && teamOffers && (
            <div className="space-y-6">
              {/* Đề nghị đến */}
              <Section title={`📥 Đề Nghị Đến (${pendingIncoming.length})`}>
                {pendingIncoming.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Không có đề nghị nào</p>
                ) : (
                  <div className="space-y-3">
                    {pendingIncoming.map((offer) => (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        isIncoming
                        onAccept={() => handleAcceptOffer(offer)}
                        onReject={() => handleRejectOffer(offer)}
                      />
                    ))}
                  </div>
                )}
              </Section>

              {/* Đề nghị đã gửi */}
              <Section title={`📤 Đề Nghị Đã Gửi (${teamOffers.outgoing.length})`}>
                {teamOffers.outgoing.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Chưa gửi đề nghị nào</p>
                ) : (
                  <div className="space-y-3">
                    {teamOffers.outgoing.map((offer) => (
                      <OfferRow key={offer.id} offer={offer} isIncoming={false} />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          )}
        </>
      )}

      {/* ===== MODAL: GỬI ĐỀ NGHỊ ===== */}
      {offerModal && (
        <Modal title={`💰 Đề Nghị Mua ${offerModal.player.name}`} onClose={() => setOfferModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-lol-border/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-lol-border flex items-center justify-center font-bold text-lol-gold">
                {offerModal.player.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-lol-gold-light">{offerModal.player.name}</p>
                <p className="text-xs text-gray-400">
                  {roleLabels[offerModal.player.mainRole]} • OVR {offerModal.player.ovr}
                  {offerModal.isListed
                    ? ` • Giá yêu cầu: ${fmt(offerModal.player.transferFee)}`
                    : ' • Tuyển thủ tự do'}
                </p>
              </div>
            </div>
            {offerModal.isListed && (
              <p className="text-xs text-yellow-400">
                ⚠️ Đội bán yêu cầu tối thiểu {fmt(offerModal.player.transferFee)}
              </p>
            )}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Số tiền đề nghị (USD)</label>
              <input
                type="number"
                min={0}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full bg-lol-border text-lol-gold-light px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-lol-gold"
                placeholder="Nhập số tiền..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setOfferModal(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleMakeOffer}
                className="px-4 py-2 bg-lol-gold text-lol-dark text-sm font-bold rounded-md hover:bg-lol-gold/80 transition-colors"
              >
                Gửi Đề Nghị
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===== MODAL: RAO BÁN ===== */}
      {listModal && (
        <Modal title={`🏷️ Rao Bán ${listModal.name}`} onClose={() => setListModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-lol-border/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-lol-border flex items-center justify-center font-bold text-lol-gold">
                {listModal.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-lol-gold-light">{listModal.name}</p>
                <p className="text-xs text-gray-400">
                  {roleLabels[listModal.mainRole]} • OVR {listModal.ovr} • Lương {fmt(listModal.salary)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Phí chuyển nhượng yêu cầu (USD)</label>
              <input
                type="number"
                min={0}
                value={listFee}
                onChange={(e) => setListFee(e.target.value)}
                className="w-full bg-lol-border text-lol-gold-light px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-lol-gold"
                placeholder="Nhập phí..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setListModal(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleListPlayer}
                className="px-4 py-2 bg-lol-gold text-lol-dark text-sm font-bold rounded-md hover:bg-lol-gold/80 transition-colors"
              >
                Rao Bán
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function BudgetStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-bold text-sm ${color}`}>{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
        active
          ? 'border-lol-gold text-lol-gold'
          : 'border-transparent text-gray-400 hover:text-lol-gold-light'
      }`}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-lol-panel border border-lol-border rounded-lg">
      <div className="px-4 py-3 border-b border-lol-border">
        <h2 className="font-semibold text-lol-gold-light">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function PlayerMarketCard({
  player, isMine, onSign, onOffer, onUnlist, isFreeAgent,
}: {
  player: Player;
  isMine: boolean;
  onSign?: () => void;
  onOffer?: () => void;
  onUnlist?: () => void;
  isFreeAgent?: boolean;
}) {
  return (
    <div className="bg-lol-border/20 border border-lol-border rounded-lg p-3">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-lol-border flex items-center justify-center font-bold text-lol-gold shrink-0">
          {player.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-lol-gold-light text-sm truncate">{player.name}</p>
          <p className="text-xs text-gray-400">
            {roleLabels[player.mainRole]} • {player.nationality} • {player.age}t
          </p>
          {player.team && (
            <p className="text-xs text-gray-500">{player.team.name}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className={`text-xl font-bold ${getOvrColor(player.ovr)}`}>{player.ovr}</span>
          <p className="text-xs text-gray-500">OVR</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-gray-500">Lương: <span className="text-lol-gold">{`$${Number(player.salary).toLocaleString()}`}</span></span>
        {!isFreeAgent && (
          <span className="text-yellow-400 font-medium">🏷️ {`$${Number(player.transferFee).toLocaleString()}`}</span>
        )}
        {isFreeAgent && (
          <span className="text-green-400 font-medium">🆓 Tự do</span>
        )}
      </div>

      {isMine ? (
        onUnlist && (
          <button
            onClick={onUnlist}
            className="w-full text-xs py-1.5 bg-red-900/40 border border-red-700/50 text-red-300 rounded hover:bg-red-900/60 transition-colors"
          >
            Gỡ Rao Bán
          </button>
        )
      ) : (
        <div className="flex gap-2">
          {isFreeAgent && onSign && (
            <button
              onClick={onSign}
              className="flex-1 text-xs py-1.5 bg-green-900/40 border border-green-700/50 text-green-300 rounded hover:bg-green-900/60 transition-colors"
            >
              ✅ Ký Tự Do
            </button>
          )}
          {onOffer && (
            <button
              onClick={onOffer}
              className="flex-1 text-xs py-1.5 bg-lol-gold/20 border border-lol-gold/40 text-lol-gold rounded hover:bg-lol-gold/30 transition-colors"
            >
              💰 Đặt Giá
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerSquadCard({
  player, onList, onUnlist, onRelease,
}: {
  player: Player;
  onList: () => void;
  onUnlist: () => void;
  onRelease: () => void;
}) {
  return (
    <div className="bg-lol-border/20 border border-lol-border rounded-lg p-3">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-lol-border flex items-center justify-center font-bold text-lol-gold shrink-0">
          {player.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-lol-gold-light text-sm truncate">{player.name}</p>
            {player.isTransferListed && (
              <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-1.5 py-0.5 rounded shrink-0">
                Rao bán
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {roleLabels[player.mainRole]} • {player.age}t • Hết HĐ mùa {player.contractEndSeason}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-xl font-bold ${getOvrColor(player.ovr)}`}>{player.ovr}</span>
          <p className="text-xs text-gray-500">OVR</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Lương: <span className="text-lol-gold">${Number(player.salary).toLocaleString()}</span>
        {player.isTransferListed && (
          <span className="ml-2">• Phí: <span className="text-yellow-400">${Number(player.transferFee).toLocaleString()}</span></span>
        )}
      </div>

      <div className="flex gap-2">
        {player.isTransferListed ? (
          <button
            onClick={onUnlist}
            className="flex-1 text-xs py-1.5 bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 rounded hover:bg-yellow-900/60 transition-colors"
          >
            Gỡ Rao
          </button>
        ) : (
          <button
            onClick={onList}
            className="flex-1 text-xs py-1.5 bg-lol-gold/20 border border-lol-gold/40 text-lol-gold rounded hover:bg-lol-gold/30 transition-colors"
          >
            🏷️ Rao Bán
          </button>
        )}
        <button
          onClick={onRelease}
          className="flex-1 text-xs py-1.5 bg-red-900/30 border border-red-700/40 text-red-300 rounded hover:bg-red-900/50 transition-colors"
        >
          Thả Tự Do
        </button>
      </div>
    </div>
  );
}

function OfferRow({
  offer, isIncoming, onAccept, onReject,
}: {
  offer: TransferOffer;
  isIncoming: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: '⏳ Chờ', color: 'text-yellow-400' },
    accepted: { label: '✅ Chấp nhận', color: 'text-green-400' },
    rejected: { label: '❌ Từ chối', color: 'text-red-400' },
  };
  const st = statusConfig[offer.status] ?? statusConfig.pending;

  return (
    <div className="flex items-center gap-4 p-3 bg-lol-border/20 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-lol-gold-light">{offer.player?.name}</span>
          <span className="text-xs text-gray-500">
            {offer.player ? `OVR ${offer.player.ovr} • ${roleLabels[offer.player.mainRole]}` : ''}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {isIncoming
            ? `👥 ${offer.fromTeam?.name ?? 'Đội lạ'} muốn mua với giá`
            : `➡️ Gửi đến ${offer.toTeam?.name ?? 'Đội lạ / Tự do'} với giá`}
          {' '}<span className="text-lol-gold font-medium">${Number(offer.amount).toLocaleString()}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
        {isIncoming && offer.status === 'pending' && (
          <>
            <button
              onClick={onAccept}
              className="text-xs px-2 py-1 bg-green-900/40 border border-green-700/50 text-green-300 rounded hover:bg-green-900/60 transition-colors"
            >
              Chấp nhận
            </button>
            <button
              onClick={onReject}
              className="text-xs px-2 py-1 bg-red-900/30 border border-red-700/40 text-red-300 rounded hover:bg-red-900/50 transition-colors"
            >
              Từ chối
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Modal({
  title, children, onClose,
}: {
  title: string; children: React.ReactNode; onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-lol-panel border border-lol-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-lol-border">
          <h3 className="font-bold text-lol-gold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

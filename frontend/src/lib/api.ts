import { Champion, Player, Item, Team, Match, Tournament, TransferMarket, TransferOffer, TeamOffers } from '@/types';

// Cấu hình API - URL của backend NestJS
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Hàm fetch chung với xử lý lỗi
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ===== API CALLS =====

// Champions
export const championApi = {
  getAll: () => fetchApi<Champion[]>('/champions'),
  getOne: (id: number) => fetchApi<Champion>(`/champions/${id}`),
  create: (data: Partial<Champion>) => fetchApi<Champion>('/champions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Champion>) => fetchApi<Champion>(`/champions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi<void>(`/champions/${id}`, { method: 'DELETE' }),
};

// Players
export const playerApi = {
  getAll: (teamId?: number) => fetchApi<Player[]>(teamId ? `/players?teamId=${teamId}` : '/players'),
  getOne: (id: number) => fetchApi<Player>(`/players/${id}`),
  create: (data: Partial<Player>) => fetchApi<Player>('/players', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Player>) => fetchApi<Player>(`/players/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi<void>(`/players/${id}`, { method: 'DELETE' }),
};

// Items
export const itemApi = {
  getAll: () => fetchApi<Item[]>('/items'),
  getOne: (id: number) => fetchApi<Item>(`/items/${id}`),
};

// Teams
export const teamApi = {
  getAll: () => fetchApi<Team[]>('/teams'),
  getOne: (id: number) => fetchApi<Team>(`/teams/${id}`),
};

// Seed data
export const seedApi = {
  run: () => fetchApi<{ message: string }>('/seed', { method: 'POST' }),
};

// Matches
export const matchApi = {
  getAll: () => fetchApi<Match[]>('/matches'),
  getOne: (id: number) => fetchApi<Match>(`/matches/${id}`),
  simulate: (team1Id: number, team2Id: number, format: 'bo1' | 'bo3' | 'bo5' = 'bo1') =>
    fetchApi<Match>('/matches/simulate', {
      method: 'POST',
      body: JSON.stringify({ team1Id, team2Id, format }),
    }),
};

// Tournaments
export const tournamentApi = {
  getAll: () => fetchApi<Tournament[]>('/tournaments'),
  getOne: (id: number) => fetchApi<Tournament>(`/tournaments/${id}`),
  create: (name: string, teamIds: number[], matchFormat: 'bo1' | 'bo3' | 'bo5' = 'bo1') =>
    fetchApi<Tournament>('/tournaments', {
      method: 'POST',
      body: JSON.stringify({ name, teamIds, matchFormat }),
    }),
  simulateNext: (id: number) =>
    fetchApi<Tournament>(`/tournaments/${id}/simulate-next`, { method: 'POST' }),
  simulateAll: (id: number) =>
    fetchApi<Tournament>(`/tournaments/${id}/simulate-all`, { method: 'POST' }),
  remove: (id: number) =>
    fetchApi<void>(`/tournaments/${id}`, { method: 'DELETE' }),
};

// SWR fetcher - hàm dùng với thư viện SWR để tự động cache và refetch
export const swrFetcher = (url: string) =>
  fetch(`${API_BASE_URL}${url}`).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  });

// Transfer Market - Phase 4
export const transferApi = {
  getMarket: () => fetchApi<TransferMarket>('/transfer/market'),
  getOffersByTeam: (teamId: number) =>
    fetchApi<TeamOffers>(`/transfer/offers?teamId=${teamId}`),
  listPlayer: (playerId: number, transferFee: number) =>
    fetchApi<Player>('/transfer/list', {
      method: 'POST',
      body: JSON.stringify({ playerId, transferFee }),
    }),
  unlistPlayer: (playerId: number) =>
    fetchApi<Player>('/transfer/unlist', {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    }),
  signFreeAgent: (teamId: number, playerId: number) =>
    fetchApi<Player>('/transfer/sign', {
      method: 'POST',
      body: JSON.stringify({ teamId, playerId }),
    }),
  releasePlayer: (teamId: number, playerId: number) =>
    fetchApi<Player>('/transfer/release', {
      method: 'POST',
      body: JSON.stringify({ teamId, playerId }),
    }),
  makeOffer: (fromTeamId: number, playerId: number, amount: number) =>
    fetchApi<TransferOffer>('/transfer/offer', {
      method: 'POST',
      body: JSON.stringify({ fromTeamId, playerId, amount }),
    }),
  acceptOffer: (offerId: number) =>
    fetchApi<TransferOffer>(`/transfer/offers/${offerId}/accept`, { method: 'POST' }),
  rejectOffer: (offerId: number) =>
    fetchApi<TransferOffer>(`/transfer/offers/${offerId}/reject`, { method: 'POST' }),
};

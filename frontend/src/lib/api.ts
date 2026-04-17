import { Champion, Player, Item, Team } from '@/types';

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

// SWR fetcher - hàm dùng với thư viện SWR để tự động cache và refetch
export const swrFetcher = (url: string) =>
  fetch(`${API_BASE_URL}${url}`).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  });

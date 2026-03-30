import { api } from './api';
import type { PartyListResponse, Party, SystemNotification, Category } from '../types/party';

export const partyKeys = {
  all: ['parties'] as const,
  // ✅ Fix: categoryId가 이제 카테고리 이름 문자열 (ex: "OTT", "생산성")
  list: (category: string | null, search: string) =>
    ['parties', 'list', category, search] as const,
  detail: (id: string) => ['parties', id] as const,
};

export const notificationKeys = {
  latest: ['notifications', 'latest'] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/parties/categories');
  return data;
};

export const fetchParties = async (params: {
  // ✅ Fix: category_id(UUID) → category(문자열) 로 파라미터명 변경
  category?: string;
  service_id?: string;
  search?: string;
  page?: number;
  size?: number;
}): Promise<PartyListResponse> => {
  const { data } = await api.get('/parties', { params });
  return data;
};

export const fetchParty = async (id: string): Promise<Party> => {
  const { data } = await api.get(`/parties/${id}`);
  return data;
};

export const applyParty = async (partyId: string): Promise<{ message: string }> => {
  const { data } = await api.post(`/parties/${partyId}/join`);
  return data;
};

export const fetchLatestNotifications = async (): Promise<SystemNotification[]> => {
  const { data } = await api.get('/notifications/latest');
  return data;
};

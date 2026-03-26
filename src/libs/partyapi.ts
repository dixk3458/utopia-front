import { api } from './api';
import type { PartyListResponse, Party, SystemNotification, Category } from '../types/party';

export const partyKeys = {
  all: ['parties'] as const,
  // [수정] categoryId 타입을 string | null로 변경
  list: (categoryId: string | null, search: string) =>
    ['parties', 'list', categoryId, search] as const,
  // [수정] id 타입을 string으로 변경
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
  // [수정] category_id 타입을 string으로 변경
  category_id?: string;
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

// [수정] partyId 타입을 string으로 변경
export const applyParty = async (partyId: string): Promise<{ message: string }> => {
  const { data } = await api.post(`/parties/${partyId}/join`);
  return data;
};

export const fetchLatestNotifications = async (): Promise<SystemNotification[]> => {
  const { data } = await api.get('/notifications/latest');
  return data;
};
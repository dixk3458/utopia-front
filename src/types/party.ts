export type PartyStatus = 'RECRUITING' | 'FULL' | 'COMPLETED' | 'CANCELED';

export interface Party {
  // [수정] UUID 대응을 위해 number -> string
  party_id: string; 
  host_id: string | null;
  platform_id: string | null;
  title: string;
  status: PartyStatus | null;
  host_nickname: string | null;
  platform_name: string | null;
  category_name: string | null;
  member_count: number; // 인원수는 숫자 유지
}

export interface PartyListResponse {
  parties: Party[];
  total: number;
  page: number;
  size: number;
}

export interface Category {
  // [수정] UUID 대응을 위해 number -> string
  category_id: string;
  category_name: string;
}

export interface SystemNotification {
  // [수정] DB 설정에 맞춰 string으로 통일 (안전함)
  notification_id: string;
  user_id: string | null;
  type: string | null;
  content: string | null;
  is_read: boolean | null;
  created_at: string | null;
}
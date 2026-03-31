/**
 * CaptchaWidget 관련 타입 정의
 * CONTEXT.md Section 4, 11, 14 기반
 */

//도상원
export interface CaptchaWidgetProps {
  onSuccess: (token: string) => void;
  onError?: (error: string) => void;
  triggerType?: 'register' | 'new_ip_login' | 'login_fail';
}
//도상원

//도상원
export interface CaptchaInitResponse {
  status: 'pass' | 'challenge' | 'block';
  token?: string | null;
  session_id?: string | null;
  message?: string | null;
}

export interface EmojiItem {
  id: string;
  url: string;
  category: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  index: number;
}

export interface CaptchaChallengeResponse {
  session_id: string;
  emojis: EmojiItem[];
  photos: PhotoItem[];
}

export interface CaptchaVerifyResponse {
  success: boolean;
  token?: string | null;
  remaining_attempts?: number | null;
  message?: string | null;
}

export interface CaptchaStatusResponse {
  status: 'NORMAL' | 'WAIT' | 'LOCKED' | 'BANNED';
  message: string;
  retry_after_seconds?: number | null;
  active_session_id?: string | null;
}
//도상원

//도상원
export type CaptchaPhase =
  | 'idle'
  | 'verifying'
  | 'passed'
  | 'challenge'
  | 'submitting'
  | 'success'
  | 'failed'
  | 'wait'
  | 'locked'
  | 'banned';
//도상원

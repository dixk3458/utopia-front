/**
 * Captcha API 서비스
 * 실제 백엔드 1차 캡챠 엔드포인트와 통신합니다.
 */
import { api } from '../../libs/api';
import type { BehaviorPayload } from './useBehaviorCollector';
import type {
  CaptchaChallengeResponse,
  CaptchaInitResponse,
  CaptchaStatusResponse,
  CaptchaVerifyResponse,
} from './types';

//도상원
export const ANIMAL_LABELS: Record<string, string> = {
  cat: '고양이',
  dog: '강아지',
  bear: '곰',
  fox: '여우',
  penguin: '펭귄',
};
//도상원

//도상원
export async function captchaInit(
  payload: BehaviorPayload & {
    trigger_type: 'register' | 'new_ip_login' | 'login_fail';
  },
): Promise<CaptchaInitResponse> {
  const { data } = await api.post<CaptchaInitResponse>(
    '/api/captcha/init',
    payload,
  );
  return data;
}

export async function captchaChallenge(
  sessionId: string,
): Promise<CaptchaChallengeResponse> {
  const { data } = await api.get<CaptchaChallengeResponse>(
    '/api/captcha/challenge',
    {
      params: { session_id: sessionId },
    },
  );
  return data;
}

export async function captchaVerify(
  sessionId: string,
  selectedIndices: number[],
): Promise<CaptchaVerifyResponse> {
  const { data } = await api.post<CaptchaVerifyResponse>(
    '/api/captcha/verify',
    {
      session_id: sessionId,
      selected_indices: selectedIndices,
    },
  );
  return data;
}

export async function captchaStatus(): Promise<CaptchaStatusResponse> {
  const { data } = await api.get<CaptchaStatusResponse>('/api/captcha/status');
  return data;
}
//도상원

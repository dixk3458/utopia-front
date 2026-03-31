/**
 * CaptchaWidget — 메인 오케스트레이터 컴포넌트
 * 체크박스는 기존 위치에 유지하고, challenge는 모달형으로 표시합니다.
 */
import { useCallback, useEffect, useState } from 'react';
import type {
  CaptchaChallengeResponse,
  CaptchaPhase,
  CaptchaStatusResponse,
  CaptchaWidgetProps,
} from './types';
import { useBehaviorCollector } from './useBehaviorCollector';
import {
  captchaChallenge,
  captchaInit,
  captchaStatus,
  captchaVerify,
} from './captchaApi';
import CaptchaCheckbox from './CaptchaCheckbox';
import CaptchaGrid from './CaptchaGrid';
import CaptchaStatusCard from './CaptchaStatusCard';

function mapStatusToPhase(
  status: Extract<
    CaptchaStatusResponse['status'],
    'WAIT' | 'LOCKED' | 'BANNED'
  >,
): Extract<CaptchaPhase, 'wait' | 'locked' | 'banned'> {
  if (status === 'WAIT') return 'wait';
  if (status === 'LOCKED') return 'locked';
  return 'banned';
}

export default function CaptchaWidget({
  onSuccess,
  onError,
  triggerType = 'new_ip_login',
}: CaptchaWidgetProps) {
  const [phase, setPhase] = useState<CaptchaPhase>('idle');
  const [challenge, setChallenge] = useState<CaptchaChallengeResponse | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string>();
  const [remainingAttempts, setRemainingAttempts] = useState<number>();
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [securityStatus, setSecurityStatus] =
    useState<CaptchaStatusResponse | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const { collectPayload } = useBehaviorCollector();

  //도상원
  const resetChallengeView = useCallback(() => {
    setChallenge(null);
    setErrorMessage(undefined);
    setRemainingAttempts(undefined);
  }, []);

  const restoreChallenge = useCallback(async (sessionId: string) => {
    const challengeData = await captchaChallenge(sessionId);
    setCurrentSessionId(sessionId);
    setChallenge(challengeData);
    setErrorMessage(undefined);
    setRemainingAttempts(undefined);
    setPhase('challenge');
  }, []);

  const applySecurityStatus = useCallback(
    (nextStatus: CaptchaStatusResponse) => {
      setSecurityStatus(nextStatus);

      if (nextStatus.status === 'NORMAL') {
        if (!nextStatus.active_session_id) {
          setPhase((prev) =>
            prev === 'wait' || prev === 'locked' || prev === 'banned'
              ? 'idle'
              : prev,
          );
        }
        return nextStatus;
      }

      resetChallengeView();
      setPhase(mapStatusToPhase(nextStatus.status));
      onError?.(nextStatus.message);
      return nextStatus;
    },
    [onError, resetChallengeView],
  );

  const syncStatus = useCallback(async () => {
    const nextStatus = await captchaStatus();

    if (nextStatus.status !== 'NORMAL') {
      return applySecurityStatus(nextStatus);
    }

    setSecurityStatus(nextStatus);

    if (nextStatus.active_session_id) {
      await restoreChallenge(nextStatus.active_session_id);
    } else {
      setPhase((prev) =>
        prev === 'wait' || prev === 'locked' || prev === 'banned'
          ? 'idle'
          : prev,
      );
    }

    return nextStatus;
  }, [applySecurityStatus, restoreChallenge]);
  //도상원

  //도상원
  useEffect(() => {
    void syncStatus();
  }, [syncStatus]);
  //도상원

  //도상원
  const startCaptchaFlow = useCallback(async () => {
    setIsRetrying(true);
    setErrorMessage(undefined);

    try {
      const nextStatus = await syncStatus();

      if (nextStatus.status !== 'NORMAL') {
        return;
      }

      if (nextStatus.active_session_id) {
        return;
      }

      setPhase('verifying');

      const payload = collectPayload();
      const result = await captchaInit({
        ...payload,
        trigger_type: triggerType,
      });

      switch (result.status) {
        case 'pass':
          setSecurityStatus(null);
          setPhase('passed');
          window.setTimeout(() => {
            setPhase('success');
            if (result.token) {
              onSuccess(result.token);
            }
          }, 500);
          break;

        case 'challenge':
          if (!result.session_id) {
            throw new Error('challenge session_id missing');
          }

          await restoreChallenge(result.session_id);
          break;

        case 'block': {
          const refreshedStatus = await syncStatus();

          if (refreshedStatus.status === 'NORMAL') {
            setSecurityStatus({
              status: 'WAIT',
              message:
                result.message ??
                '보안 정책에 따라 이용이 일시 제한되었습니다.',
              retry_after_seconds: 0,
              active_session_id: null,
            });
            setPhase('wait');
            onError?.(result.message ?? '일시 제한');
          }
          break;
        }
      }
    } catch {
      setPhase('failed');
      setErrorMessage('검증 중 오류가 발생했습니다.');
      onError?.('검증 오류');
    } finally {
      setIsRetrying(false);
    }
  }, [
    collectPayload,
    onError,
    onSuccess,
    restoreChallenge,
    syncStatus,
    triggerType,
  ]);
  //도상원

  //도상원
  const handleGridSubmit = useCallback(
    async (selectedIndices: number[]) => {
      if (!currentSessionId) return;

      setPhase('submitting');
      setErrorMessage(undefined);

      try {
        const result = await captchaVerify(currentSessionId, selectedIndices);

        if (result.success) {
          resetChallengeView();
          setSecurityStatus(null);
          setPhase('success');

          if (result.token) {
            onSuccess(result.token);
          }
          return;
        }

        setRemainingAttempts(result.remaining_attempts ?? undefined);

        if ((result.remaining_attempts ?? 0) <= 0) {
          const nextStatus = await syncStatus();

          if (nextStatus.status === 'NORMAL') {
            setSecurityStatus({
              status: 'LOCKED',
              message:
                result.message ?? '실패 횟수 초과로 잠시 잠금 상태입니다.',
              retry_after_seconds: 0,
              active_session_id: null,
            });
            setPhase('locked');
            onError?.(result.message ?? '잠금 상태');
          }
          return;
        }

        setErrorMessage(
          result.message ?? '정답이 아닙니다. 다시 시도해주세요.',
        );

        const nextChallenge = await captchaChallenge(currentSessionId);
        setChallenge(nextChallenge);
        setPhase('challenge');
      } catch {
        setPhase('challenge');
        setErrorMessage('검증 중 오류가 발생했습니다.');
      }
    },
    [currentSessionId, onError, onSuccess, resetChallengeView, syncStatus],
  );

  const handleGridCancel = useCallback(() => {
    resetChallengeView();
    setPhase('idle');
  }, [resetChallengeView]);
  //도상원

  //도상원
  let visibleStatus:
    | (CaptchaStatusResponse & { status: 'WAIT' | 'LOCKED' | 'BANNED' })
    | null = null;

  if (
    securityStatus?.status === 'WAIT' ||
    securityStatus?.status === 'LOCKED' ||
    securityStatus?.status === 'BANNED'
  ) {
    visibleStatus = {
      ...securityStatus,
      status: securityStatus.status,
    };
  }
  //도상원

  return (
    <div className="flex flex-col items-center gap-3">
      <CaptchaCheckbox phase={phase} onClick={startCaptchaFlow} />

      {visibleStatus && (
        <CaptchaStatusCard
          key={`${visibleStatus.status}:${visibleStatus.retry_after_seconds ?? 0}`}
          status={visibleStatus.status}
          message={visibleStatus.message}
          retryAfterSeconds={visibleStatus.retry_after_seconds}
          onRetry={startCaptchaFlow}
          isRetrying={isRetrying}
        />
      )}

      {(phase === 'challenge' || phase === 'submitting') && challenge && (
        <CaptchaGrid
          challenge={challenge}
          onSubmit={handleGridSubmit}
          onCancel={handleGridCancel}
          isSubmitting={phase === 'submitting'}
          errorMessage={errorMessage}
          remainingAttempts={remainingAttempts}
        />
      )}
    </div>
  );
}

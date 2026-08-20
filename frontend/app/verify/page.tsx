'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { getAuthProvider, type OtpChallenge } from '@/lib/auth/provider';

export default function VerifyPage() {
  const { t, locale, signIn } = useApp();
  const router = useRouter();
  const [challenge, setChallenge] = useState<(OtpChallenge & { phone: string }) | null>(null);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem('taap.otp');
    if (!raw) { router.replace('/login/'); return; }
    setChallenge(JSON.parse(raw));
    inputs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  async function verify(code: string) {
    if (!challenge) return;
    try {
      const auth = await getAuthProvider();
      const session = await auth.verifyOtp(challenge.requestId, code);
      sessionStorage.removeItem('taap.otp');
      signIn(session);
      router.push('/app/now/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code did not match.');
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    }
  }

  function setDigit(index: number, value: string) {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setError(null);
    if (v && index < 5) inputs.current[index + 1]?.focus();
    if (next.every((d) => d)) verify(next.join(''));
  }

  return (
    <div className="relative z-2 mx-auto flex min-h-dvh max-w-[452px] flex-col justify-center gap-6 px-6 py-10">
      <div>
        <h1 className={`font-display text-3xl font-extrabold tracking-tight ${dv(locale)}`}>{t.enterCode}</h1>
        <p className={`mt-1.5 text-[13.5px] text-base-content/70 ${dv(locale)}`}>
          {t.sentTo} <b className="font-display text-base-content">{challenge?.maskedPhone ?? '…'}</b>
        </p>
      </div>

      <div className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input key={i} ref={(el) => { inputs.current[i] = el; }}
            value={d} onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
            }}
            inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`}
            className="surface h-16 w-full min-w-0 rounded-field text-center font-display text-2xl
              font-extrabold outline-none focus:ring-2 focus:ring-primary" />
        ))}
      </div>

      {error && <p className="px-1 text-[13px] font-semibold text-error">{error}</p>}

      {challenge?.devCode && (
        <p className="rounded-field bg-base-300 px-4 py-3 text-[13px] text-base-content/70 ring-1 ring-base-content/10">
          Demo — any six digits work. Suggested code{' '}
          <b className="font-display text-base-content">{challenge.devCode}</b>.
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button onClick={() => router.push('/login/')}
          className={`text-[13.5px] font-extrabold text-primary ${dv(locale)}`}>{t.changeNumber}</button>
        <button disabled={seconds > 0} onClick={() => setSeconds(30)}
          className={`text-[13.5px] font-extrabold ${seconds > 0 ? 'text-base-content/40' : 'text-primary'} ${dv(locale)}`}>
          {t.resend}{seconds > 0 ? ` · ${seconds}s` : ''}
        </button>
      </div>
    </div>
  );
}

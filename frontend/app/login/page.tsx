'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { getAuthProvider } from '@/lib/auth/provider';
import { DEMO_ACCOUNTS } from '@/lib/auth/mock';

/**
 * Phone-first sign-in. A judge must never be blocked by an OTP that cannot
 * arrive, so the seeded accounts sign in directly — and the screen is explicit
 * that this is a mock rather than pretending otherwise.
 */
export default function LoginPage() {
  const { t, locale, signIn } = useApp();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const auth = await getAuthProvider();
      const challenge = await auth.requestOtp(phone);
      sessionStorage.setItem('taap.otp', JSON.stringify({ ...challenge, phone }));
      router.push('/verify/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code.');
      setBusy(false);
    }
  }

  return (
    <div className="relative z-2 mx-auto flex min-h-dvh max-w-[452px] flex-col justify-center gap-6 px-6 py-10">
      <Link href="/" className="flex items-center gap-3 self-start">
        <span className="grid size-10 place-items-center rounded-selector bg-neutral text-neutral-content">
          <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" />
          </svg>
        </span>
        <b className="font-display text-lg font-extrabold tracking-tight">Taap Alert</b>
      </Link>

      <div>
        <h1 className={`font-display text-3xl font-extrabold tracking-tight ${dv(locale)}`}>{t.signIn}</h1>
        <p className={`mt-1.5 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.phoneHint}</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="surface flex items-center gap-3 rounded-field px-4 py-3.5">
          <span className="font-display text-base font-extrabold text-base-content/55">+91</span>
          <span className="h-6 w-px bg-base-content/15" />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
            aria-label={t.phoneLabel}
            className="min-w-0 flex-1 bg-transparent font-display text-lg font-extrabold tracking-wide
              outline-none placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-base-content/35" />
        </label>

        {error && <p className="px-1 text-[13px] font-semibold text-error">{error}</p>}

        <button type="submit" disabled={phone.length !== 10 || busy}
          className={`press flex min-h-14 items-center justify-center rounded-field text-base font-extrabold transition
            ${phone.length === 10 && !busy
              ? 'bg-primary text-primary-content'
              : 'bg-base-300 text-base-content/40'} ${dv(locale)}`}>
          {t.sendCode}
        </button>
      </form>

      <div className="surface rounded-box p-4">
        <p className={`eyebrow ${dv(locale)}`}>{t.demoAccounts}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.phone}>
              <button
                onClick={() => { signIn(a); router.push('/app/now/'); }}
                className="press flex w-full items-center gap-3 rounded-field bg-base-300 px-3.5 py-2.75 text-left">
                <span className={`grid size-8 shrink-0 place-items-center rounded-selector text-[10px] font-extrabold
                  uppercase ${a.role === 'officer' ? 'bg-neutral text-neutral-content' : 'bg-primary text-primary-content'}`}>
                  {a.role === 'officer' ? 'DO' : a.role === 'supervisor' ? 'SUP' : 'W'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-extrabold tracking-tight">{a.name}</span>
                  <span className="block text-[11.5px] font-semibold text-base-content/55">
                    {a.role} · {a.source}
                  </span>
                </span>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6}
                  strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-base-content/40" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="px-1 text-[12px] leading-relaxed text-base-content/55">
        Mock authentication for demonstration — no SMS is sent and any six digits are accepted.
        A production build swaps in a DLT-registered aggregator behind the same interface.
      </p>
    </div>
  );
}

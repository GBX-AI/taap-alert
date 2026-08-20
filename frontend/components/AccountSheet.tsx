'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { INTENSITY_LABELS } from '@/lib/forecast/bands';
import { Icon } from './Pictograms';

const ROLE_LABEL = {
  worker: { en: 'Worker', hi: 'मज़दूर' },
  supervisor: { en: 'Supervisor', hi: 'सुपरवाइज़र' },
  officer: { en: 'District officer', hi: 'ज़िला अधिकारी' },
} as const;

/**
 * Who am I, and how do I become someone else.
 *
 * A demo gets looked at by several people in a row, and the roles see different
 * screens — so switching accounts has to be reachable from inside the app, not
 * only by clearing storage.
 */
export function AccountSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale, session, signOut, district, block, intensity } = useApp();
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const hi = locale === 'hi';

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const initials = (session?.name ?? '?')
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  function switchAccount() {
    onClose();
    router.push('/login/');
  }

  function endSession() {
    signOut();
    onClose();
    router.replace('/login/');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose}
        className="absolute inset-0 bg-neutral/45 backdrop-blur-[2px]" />

      <div role="dialog" aria-modal="true" aria-label={t.account}
        className="relative w-full max-w-[452px] rounded-t-[28px] bg-base-100 p-5 pb-7 shadow-2xl
          ring-1 ring-base-content/10 sm:rounded-[28px] sm:pb-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-base-content/20 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className={`grid size-13 shrink-0 place-items-center rounded-selector font-display
              text-[17px] font-black ${
                session?.role === 'officer' ? 'bg-neutral text-neutral-content' : 'bg-primary text-primary-content'}`}>
              {initials}
            </span>
            <span className="min-w-0">
              <span className={`block text-[18px] font-extrabold tracking-tight ${dv(locale)}`}>
                {session?.name ?? (hi ? 'साइन इन नहीं' : 'Not signed in')}
              </span>
              {session && (
                <span className={`mt-0.5 block text-[12.5px] font-semibold text-base-content/55 ${dv(locale)}`}>
                  {hi ? ROLE_LABEL[session.role].hi : ROLE_LABEL[session.role].en} · {session.source}
                </span>
              )}
            </span>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close"
            className="press grid size-9 shrink-0 place-items-center rounded-selector bg-base-300">
            <Icon size={16} stroke={2.6}><path d="M18 6L6 18M6 6l12 12" /></Icon>
          </button>
        </div>

        {session && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-base-content/10 pt-4">
            <Field k={t.acctPhone} v={`+91 ${session.phone.slice(0, 2)}xx xx${session.phone.slice(-4)}`} />
            <Field k={t.acctDistrict} v={hi ? district.hi : district.en} dvv={hi} />
            <Field k={t.acctBlock} v={hi ? block.hi : block.en} dvv={hi} />
            <Field k={t.workType} v={hi ? INTENSITY_LABELS[intensity].hi : INTENSITY_LABELS[intensity].en} dvv={hi} />
          </dl>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <button onClick={switchAccount}
            className="press flex min-h-13 items-center justify-center gap-2.5 rounded-field bg-primary
              text-[15px] font-extrabold text-primary-content">
            <Icon size={17} stroke={2.4}>
              <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" />
            </Icon>
            <span className={dv(locale)}>{t.switchAccount}</span>
          </button>

          {session && (
            <button onClick={endSession}
              className="press surface flex min-h-13 items-center justify-center gap-2.5 rounded-field
                text-[15px] font-extrabold">
              <Icon size={17} stroke={2.4}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
              </Icon>
              <span className={dv(locale)}>{t.signOut}</span>
            </button>
          )}
        </div>

        <p className={`mt-4 text-center text-[11.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>
          {t.acctNote}
        </p>
      </div>
    </div>
  );
}

function Field({ k, v, dvv }: { k: string; v: string; dvv?: boolean }) {
  const { locale } = useApp();
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={`eyebrow ${dv(locale)}`}>{k}</dt>
      <dd className={`text-[14px] font-extrabold tracking-tight ${dvv ? 'font-dv' : 'font-display'}`}>{v}</dd>
    </div>
  );
}

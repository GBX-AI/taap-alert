'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { Icon } from './Pictograms';
import { Toast } from './Primitives';

const TABS = [
  { href: '/app/now/', key: 'tabNow', icon: <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" /> },
  { href: '/app/map/', key: 'tabMap', icon: <><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 7" /><path d="M9 4v13M15 7v12.5" /></> },
  { href: '/app/ask/', key: 'tabAsk', icon: <path d="M20 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />, workerOnly: true },
  { href: '/app/approve/', key: 'tabApprove', icon: <path d="M20 6 9.5 17 4 11.5" />, officerOnly: true },
  { href: '/app/dispatch/', key: 'tabDispatch', icon: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9.5h8M8 12.5h5" /></>, officerOnly: true },
  { href: '/app/audit/', key: 'tabAudit', icon: <><path d="M12 3l7 3v6c0 4.4-3 8.3-7 9.5C8 20.3 5 16.4 5 12V6z" /><path d="M9 12l2 2 4-4" /></>, officerOnly: true },
  { href: '/app/shelters/', key: 'tabShelters', icon: <><path d="M3 10.5 12 4l9 6.5" /><path d="M5.5 10.5V20h13v-9.5" /><path d="M10 20v-5h4v5" /></>, workerOnly: true },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale, theme, toggleTheme, session, block, district, queue, toast } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  /* the app requires a session; the marketing pages do not */
  useEffect(() => {
    if (session === null && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('taap.session');
      if (!stored) router.replace('/login/');
    }
  }, [session, router]);

  /* Five tabs is the ceiling on a phone, so the bar is role-shaped: field users
     get the advisory and the assistant, officers get the issuing pipeline. */
  const isOfficer = session?.role === 'officer';
  const tabs = TABS.filter((tab) => {
    if ('officerOnly' in tab && tab.officerOnly) return isOfficer;
    if ('workerOnly' in tab && tab.workerOnly) return !isOfficer;
    return true;
  });

  return (
    <div className="relative z-2 mx-auto flex min-h-dvh max-w-[452px] flex-col md:my-6 md:min-h-[calc(100dvh-3rem)]
      md:rounded-[38px] md:shadow-2xl md:ring-1 md:ring-base-content/10">
      <header className="sticky top-0 z-25 flex items-center gap-2 bg-linear-to-b from-base-200 from-68% to-transparent px-5 pt-4 pb-2">
        <Link href="/app/now/" className="mr-auto flex min-w-0 items-center gap-2.5">
          <span className="grid size-8.5 shrink-0 place-items-center rounded-selector bg-neutral text-neutral-content">
            <Icon size={18} stroke={2.2}><path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" /></Icon>
          </span>
          <span className="min-w-0">
            <b className={`block font-display text-base font-extrabold tracking-tight ${dv(locale)}`}>{t.brand}</b>
            <span className={`block truncate text-[11.5px] font-semibold text-base-content/55 ${dv(locale)}`}>
              {locale === 'hi' ? district.hi : district.en} · {locale === 'hi' ? block.hi : block.en}
            </span>
          </span>
        </Link>

        <div className="surface flex rounded-selector p-0.5" role="group" aria-label="Language">
          {(['en', 'hi'] as const).map((l) => (
            <button key={l} onClick={() => setLocale(l)} aria-pressed={locale === l}
              className={`press rounded-[10px] px-2.5 py-1.5 text-[11.5px] font-extrabold transition
                ${locale === l ? 'bg-neutral text-neutral-content' : 'text-base-content/55'}`}>
              {l === 'en' ? 'EN' : 'हिं'}
            </button>
          ))}
        </div>

        <button onClick={toggleTheme} aria-label="Switch theme"
          className="surface press grid size-9.5 place-items-center rounded-selector">
          <Icon size={18} stroke={2.1}>
            {theme === 'taap-dark'
              ? <><circle cx="12" cy="12" r="4.1" /><path d="M12 2.6v2.1M12 19.3v2.1M4.3 4.3l1.5 1.5M18.2 18.2l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.3 19.7l1.5-1.5M18.2 5.8l1.5-1.5" /></>
              : <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />}
          </Icon>
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-5 pt-1.5 pb-32">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-base-200 from-42% to-transparent px-3 pb-3 md:absolute">
        <div className="surface mx-auto grid max-w-[428px] rounded-box p-1.5"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0,1fr))` }}>
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href.replace(/\/$/, ''));
            return (
              <Link key={tab.href} href={tab.href} aria-current={active ? 'page' : undefined}
                className={`press relative flex flex-col items-center gap-1 rounded-selector px-0.5 py-2.5 transition
                  ${active ? 'bg-neutral text-neutral-content' : 'text-base-content/55'}`}>
                <Icon size={19} stroke={2.1}>{tab.icon}</Icon>
                <span className={`text-[9.5px] font-extrabold ${dv(locale)}`}>{t[tab.key]}</span>
                {tab.key === 'tabApprove' && queue.length > 0 && (
                  <span className="absolute top-0.5 right-[calc(50%-20px)] grid size-4.5 place-items-center rounded-full
                    text-[9.5px] font-extrabold ring-[2.5px] ring-base-100"
                    style={{ background: 'var(--band-4)', color: 'var(--band-4-ink)' }}>
                    {queue.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <Toast message={toast} />
    </div>
  );
}

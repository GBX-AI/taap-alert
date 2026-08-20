'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { Card, Eyebrow } from './Primitives';
import { Icon } from './Pictograms';

/**
 * The work-rest cycle, running.
 *
 * Guidance nobody times is guidance nobody follows, so the app keeps the clock
 * rather than leaving it to the supervisor. Demo speed plays a minute per second
 * so a full cycle is visible in a demo; real time is one tap away.
 */
export function CycleTimer() {
  const { t, locale, work, say } = useApp();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [demo, setDemo] = useState(true);

  const total = (phase === 'work' ? work.workMin || 45 : work.restMin || 15) * 60;
  const [left, setLeft] = useState(total);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  /* the band can change under the timer — reset rather than run a stale cycle */
  useEffect(() => {
    setRunning(false);
    setPhase('work');
    setLeft((work.workMin || 45) * 60);
  }, [work.workMin, work.restMin]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((prev) => {
        if (prev > 1) return prev - 1;
        const next = phaseRef.current === 'work' ? 'rest' : 'work';
        setPhase(next);
        say(next === 'rest' ? t.toRest : t.toWork);
        return (next === 'work' ? work.workMin || 45 : work.restMin || 15) * 60;
      });
    }, demo ? 16.7 : 1000);
    return () => window.clearInterval(id);
  }, [running, demo, work.workMin, work.restMin, say, t.toRest, t.toWork]);

  const reset = useCallback(() => {
    setRunning(false);
    setPhase('work');
    setLeft((work.workMin || 45) * 60);
  }, [work.workMin]);

  const mins = Math.floor(Math.max(0, left) / 60);
  const secs = Math.max(0, left) % 60;
  const progress = 100 - (left / total) * 100;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span>
          <Eyebrow className={dv(locale)}>{t.timer}</Eyebrow>
          <h2 className={`mt-1 font-display text-xl font-extrabold tracking-tight ${dv(locale)}`}>
            {running ? (phase === 'work' ? t.working : t.resting) : t.notRunning}
          </h2>
        </span>
        <span className={`inline-flex items-center gap-1.75 rounded-full px-3.5 py-1.75 text-[11.5px]
          font-extrabold lowercase transition ${
            phase === 'work'
              ? 'bg-primary text-primary-content'
              : 'bg-base-300 text-base-content/70 ring-1 ring-base-content/10'} ${dv(locale)}`}>
          {running && <span className="size-1.5 animate-pulse rounded-full bg-current" />}
          {phase === 'work' ? t.work : t.rest}
        </span>
      </div>

      <p className="my-1 text-center font-display text-6xl leading-none font-extrabold tracking-tighter">
        {mins}:{String(secs).padStart(2, '0')}
      </p>
      <p className={`min-h-9.5 px-2 text-center text-[13px] text-base-content/70 ${dv(locale)}`}>
        {running ? (phase === 'work' ? t.workNote : t.restNote) : t.startNote}
      </p>

      <div className="my-4 h-3 overflow-hidden rounded-full bg-base-300 inset-shadow-sm">
        <div className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-2.75">
        <button onClick={() => setRunning((r) => !r)}
          className="press flex min-h-13.5 flex-1 items-center justify-center gap-2.25 rounded-field
            bg-primary text-[15.5px] font-extrabold text-primary-content">
          <Icon size={17} stroke={0} className="fill-current">
            {running ? <path d="M8 5h3v14H8zM13 5h3v14h-3z" /> : <path d="M8 5.5v13l11-6.5z" />}
          </Icon>
          <span className={dv(locale)}>{running ? t.pause : left < total ? t.resume : t.startCycle}</span>
        </button>
        <button onClick={reset} aria-label="Reset timer"
          className="press surface grid size-13.5 place-items-center rounded-field">
          <Icon size={18} stroke={2.3}><path d="M4 12a8 8 0 1 0 2.6-5.9" /><path d="M4 4v4.5h4.5" /></Icon>
        </button>
      </div>

      <p className={`mt-3.5 flex flex-wrap items-center justify-center gap-2 text-center text-[11.5px]
        font-bold text-base-content/55 ${dv(locale)}`}>
        {demo ? t.demoSpeed : t.realSpeed}
        <button onClick={() => setDemo((d) => !d)} className="rounded-[8px] px-1 font-extrabold text-primary">
          {demo ? t.useReal : t.useDemo}
        </button>
      </p>
    </Card>
  );
}

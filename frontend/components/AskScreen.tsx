'use client';

import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { forecastFor } from '@/lib/data/mock';
import { cycleLabel, INTENSITY_LABELS } from '@/lib/forecast/bands';
import { Icon } from './Pictograms';

interface Turn { role: 'user' | 'assistant'; html: string }

/**
 * A grounded assistant, not a language model.
 *
 * A published static page has no network egress, and more importantly the people
 * this serves are frequently out of coverage. So answers are composed from the
 * live forecast state and the guidance table rather than fetched — which means
 * it keeps working when nothing else does. The UI says so plainly rather than
 * implying a chatbot that isn't there.
 */
export function AskScreen() {
  const app = useApp();
  const { t, locale, block, district, forecast: f, band, guidance: g, work, intensity, hour, shelters, days } = app;
  const hi = locale === 'hi';
  const [turns, setTurns] = useState<Turn[]>([{ role: 'assistant', html: t.askHello }]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTurns([{ role: 'assistant', html: t.askHello }]); }, [t.askHello]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [turns]);

  const i = hour - 6;
  const place = hi ? block.hi : block.en;
  const shelter = shelters.find((s) => s.open) ?? shelters[0];
  const perHour = work.waterMl * (60 / work.waterEveryMin);
  const shift = ((perHour * 8) / 1000).toFixed(1);
  const pad = (n: number) => String(n).padStart(2, '0');

  function answer(q: string): string {
    const s = q.toLowerCase();
    const has = (...w: string[]) => w.some((x) => s.includes(x));

    if (has('water', 'पानी', 'drink', 'पीना', 'ors', 'hydrat', 'कितना'))
      return hi
        ? `<b>${work.waterMl} मि.ली. हर ${work.waterEveryMin} मिनट</b> — लगभग ${perHour} मि.ली. प्रति घंटा, 8 घंटे की पाली में करीब <b>${shift} लीटर</b>। ${g.ors ? 'हर दूसरी बोतल में ORS मिलाएँ।' : 'आज सादा पानी काफ़ी है।'}<br><br>एक घंटे में 1 लीटर से ज़्यादा कभी न पिएँ।`
        : `<b>${work.waterMl} ml every ${work.waterEveryMin} minutes</b> — about ${perHour} ml an hour, roughly <b>${shift} litres</b> across an 8-hour shift. ${g.ors ? 'Add ORS to every second bottle.' : 'Plain water is enough today.'}<br><br>Never take more than 1 litre in any single hour.`;

    if (has('hour', 'when', 'time', 'समय', 'window', 'कब', 'shift', 'schedule'))
      return !f.window
        ? hi ? `आज ${place} में कोई खतरे का समय नहीं — पूरे दिन बैंड 2 या कम।`
             : `No danger window in ${place} today — Band 2 or below all day.`
        : hi ? `${place} में खतरे का समय <b>${f.window}</b> है, उच्चतम ${f.peakTemp}° (महसूस ${f.peakFeels}°)।<br><br>भारी काम <b>${pad(f.windowStart!)}:00 से पहले</b> या <b>${pad(f.windowEnd!)}:00 के बाद</b> करें।`
             : `The danger window in ${place} is <b>${f.window}</b>, peaking at ${f.peakTemp}° (feels ${f.peakFeels}°).<br><br>Do heavy work <b>before ${pad(f.windowStart!)}:00</b> or <b>after ${pad(f.windowEnd!)}:00</b>. Inside it: ${cycleLabel(work, 'en').toLowerCase()}.`;

    if (has('shelter', 'cool', 'shade', 'केंद्र', 'छाया'))
      return hi
        ? `सबसे नज़दीक <b>${shelter.hi}</b>, ${shelter.place} — <b>${shelter.distance}</b> दूर, ${shelter.hours} खुला, क्षमता ${shelter.capacity}। ${shelter.open ? 'अभी खुला है।' : 'अभी खुला दर्ज नहीं है।'}`
        : `Closest is <b>${shelter.en}</b> at ${shelter.place} — <b>${shelter.distance}</b> away, open ${shelter.hours}, capacity ${shelter.capacity}. ${shelter.open ? 'It is recorded open right now.' : 'It is not recorded open yet — confirm before sending anyone.'}`;

    if (has('dizz', 'faint', 'vomit', 'sick', 'symptom', 'चक्कर', 'उल्टी', 'बेहोश', '108', 'emergency', 'बीमार'))
      return hi
        ? `<b>तुरंत काम रोकें।</b> छाया में ले जाएँ, कपड़े ढीले करें, शरीर पर पानी डालें, हवा करें और <b>108</b> पर कॉल करें। अकेला न छोड़ें।<br><br>होश में हों तो ORS वाला पानी थोड़ा-थोड़ा दें। बेहोश हों तो कुछ भी पिलाने की कोशिश न करें।`
        : `<b>Stop work now.</b> Move them into shade, loosen clothing, wet the skin, fan them, and call <b>108</b>. Do not leave them alone.<br><br>If conscious, give ORS water in small sips. If not fully conscious, do not try to make them drink.`;

    if (has('band', 'why', 'level', 'बैंड', 'क्यों', 'normal', 'सामान्य', 'anomal')) {
      const an = f.anomaly[i];
      const ac = f.acclim > 0.66 ? (hi ? 'काफ़ी आदी' : 'well adapted')
        : f.acclim > 0.33 ? (hi ? 'कुछ हद तक आदी' : 'partly adapted')
        : (hi ? 'आदी नहीं' : 'not adapted');
      return hi
        ? `${place} अभी <b>बैंड ${band} — ${g.hi}</b> पर है।<br><br>महसूस <b>${Math.round(f.feels[i])}°</b>, जबकि इस तारीख़ का सामान्य <b>${Math.round(f.normalFeels[i])}°</b> है — यानी <b>${an > 0 ? '+' : ''}${an.toFixed(1)}°</b> का अंतर। यहाँ के मज़दूर गरमी के ${ac} हैं।<br><br>बैंड इसी अंतर से तय होता है, केवल तापमान से नहीं।`
        : `${place} is at <b>Band ${band} — ${g.en}</b>.<br><br>It feels like <b>${Math.round(f.feels[i])}°</b> against a seasonal normal of <b>${Math.round(f.normalFeels[i])}°</b> for this date — a departure of <b>${an > 0 ? '+' : ''}${an.toFixed(1)}°</b>. Workers here are ${ac} to heat.<br><br>The band follows that departure, not the temperature alone, which is why a cooler district can carry a higher band.`;
    }

    if (has('tomorrow', 'कल', 'next day')) {
      const td = forecastFor(block.id, 1);
      return hi
        ? `कल (${days[1].date}) ${place} में <b>बैंड ${td.maxBand}</b> रहने का अनुमान, उच्चतम ${td.peakTemp}° (महसूस ${td.peakFeels}°)। खतरे का समय ${td.window ?? '—'}।`
        : `Tomorrow (${days[1].date}) ${place} is forecast at <b>Band ${td.maxBand}</b>, peaking ${td.peakTemp}° (feels ${td.peakFeels}°). Danger window ${td.window ?? '—'}.`;
    }

    if (has('rest', 'break', 'cycle', 'आराम', 'चक्र', 'heavy', 'light', 'भारी', 'हल्का')) {
      const label = hi ? INTENSITY_LABELS[intensity].hi : INTENSITY_LABELS[intensity].en;
      if (work.stop)
        return hi
          ? `${label} काम आज बंद रखें — बैंड ${band} पर भारी काम सुरक्षित नहीं। टीम को शीतल केंद्र भेजें।`
          : `Stop ${label.toLowerCase()} work today — at Band ${band} it is not safe. Move the crew to a cooling station.`;
      if (!work.workMin)
        return hi
          ? `${label} काम के लिए आज चक्र की ज़रूरत नहीं — बैंड ${band} पर लगातार काम ठीक है।`
          : `No cycle needed for ${label.toLowerCase()} work today — at Band ${band} continuous work is fine.`;
      return hi
        ? `${label} काम के लिए <b>${cycleLabel(work, 'hi')}</b> — लगभग ${(60 / (work.workMin + work.restMin)).toFixed(1)} चक्र प्रति घंटा।<br><br>काम का प्रकार बदलने पर अनुपात भी बदलता है — 'अभी' स्क्रीन पर चुनें।`
        : `For ${label.toLowerCase()} work: <b>${cycleLabel(work, 'en')}</b> — about ${(60 / (work.workMin + work.restMin)).toFixed(1)} cycles an hour.<br><br>The ratio changes with the work class; switch it on the Now screen. Heavier work sheds less heat, so it earns more rest at the same band.`;
    }

    if (has('cloth', 'wear', 'कपड़े', 'पहन'))
      return hi
        ? `ढीले, हल्के सूती कपड़े, पूरी बाँह और सिर ढका हुआ। गर्दन और कलाई पर गीला कपड़ा हर ब्रेक पर बदलें।`
        : `Loose, light cotton with full sleeves and the head covered. Refresh a wet cloth on the neck and wrists at every break. Avoid dark colours and synthetics.`;

    if (has('temp', 'heat', 'degree', 'तापमान', 'गरमी', 'गर्मी'))
      return hi
        ? `${place} में अभी ${Math.round(f.temps[i])}°, महसूस <b>${Math.round(f.feels[i])}°</b>। आज का उच्चतम ${f.peakTemp}° (महसूस ${f.peakFeels}°)।`
        : `${place} is ${Math.round(f.temps[i])}° right now, feeling like <b>${Math.round(f.feels[i])}°</b>. Today peaks at ${f.peakTemp}° (feels ${f.peakFeels}°).`;

    if (has('where', 'district', 'ज़िला', 'कहाँ', 'area', 'block'))
      return hi
        ? `आप <b>${place}</b>, ${district.hi} ज़िला देख रहे हैं। बदलने के लिए 'नक्शा' खोलें — सभी 33 ज़िले, फिर ब्लॉक या वार्ड।`
        : `You are looking at <b>${place}</b> in ${district.en} district. To change it, open Map — all 33 districts, then blocks or wards.`;

    return hi
      ? `मुझे यह समझ नहीं आया। मैं पानी की मात्रा, काम के सुरक्षित घंटे, आराम का चक्र, नज़दीकी शीतल केंद्र, लू के लक्षण और कल के अनुमान में मदद कर सकता हूँ।`
      : `I did not follow that. I can help with water amounts, safe working hours, the rest cycle, the nearest cooling station, heat-illness symptoms, and tomorrow’s forecast.`;
  }

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setTurns((prev) => [...prev, { role: 'user', html: q }, { role: 'assistant', html: answer(q) }]);
    setDraft('');
  }

  const chips = [t.qWater, t.qHours, t.qShelter, `${t.band} ${band}?`, t.qTomorrow, t.qSymptom];

  return (
    <div className="flex min-h-[calc(100dvh-16rem)] flex-col gap-3">
      <div className="flex flex-1 flex-col gap-2.5">
        {turns.map((turn, idx) => (
          <div key={idx}
            className={`max-w-[86%] rounded-[20px] px-4 py-3.25 text-[14.5px] leading-relaxed ${
              turn.role === 'user'
                ? 'self-end rounded-br-[7px] bg-primary text-primary-content'
                : 'surface self-start rounded-bl-[7px]'} ${dv(locale)}`}
            dangerouslySetInnerHTML={{ __html: turn.html }} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)}
            className={`press surface rounded-full px-3.5 py-2.25 text-[12.5px] font-bold text-base-content/70 ${dv(locale)}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-start gap-2.25 rounded-field bg-base-300 px-3.5 py-3 ring-1 ring-base-content/10">
        <span className="mt-px shrink-0 text-base-content/40">
          <Icon size={15} stroke={2.2}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
        </span>
        <span className={`text-[11.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.askNote}</span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(draft); }}
        className="sticky bottom-0 flex gap-2.25 bg-linear-to-t from-base-200 from-26% to-transparent pt-2.5 pb-0.5">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} autoComplete="off"
          placeholder={t.askPlaceholder} aria-label={t.askPlaceholder}
          className="surface h-13 min-w-0 flex-1 rounded-field px-4 text-[14.5px] outline-none placeholder:text-base-content/40" />
        <button type="submit" aria-label="Send"
          className="press grid size-13 shrink-0 place-items-center rounded-field bg-primary text-primary-content">
          <Icon size={20} stroke={2.4}><path d="M4 12h14M12 5l7 7-7 7" /></Icon>
        </button>
      </form>
    </div>
  );
}

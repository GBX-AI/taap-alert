/**
 * Two interface locales: English and Hindi.
 *
 * Marwari is deliberately NOT an interface locale. It is a spoken language with
 * no standard written form in this context, so it appears only as IVR script
 * content in the advisory console, played from a recorded native-speaker prompt
 * bank (FR-4.3 — Bhashini does not cover Marwari).
 *
 * All Hindi and Marwari strings need native-speaker review before any pilot.
 */

export type Locale = 'en' | 'hi';

export const LOCALES: Locale[] = ['en', 'hi'];

const en = {
  brand: 'Taap Alert',
  tagline: 'Heat-stress early warning for outdoor workers',

  tabNow: 'Now', tabMap: 'Map', tabAsk: 'Ask', tabApprove: 'Approve', tabShelters: 'Shelters',

  dangerWindow: 'danger window',
  peakFeels: 'peak · feels like',
  feelsLike: 'feels like',
  confHigh: 'high confidence', confMedium: 'medium confidence', confLow: 'low confidence',
  dayAhead: 'day ahead', tapHour: 'tap an hour', at: 'at', band: 'Band',
  noWindow: 'No danger window — Band 2 or below all day.',
  windowIs: 'Danger window',

  safeHours: 'safe working hours', safeTitle: 'When it is safe to work',
  keyWork: 'Work freely', keyCycle: 'Work in cycles', keyAvoid: 'Avoid heavy work', keyStop: 'Stop outdoor work',

  why: 'why this band', rNormal: 'normal for this date', rToday: 'today',
  rDeparture: 'departure', rAcclim: 'adapted to heat',
  acHigh: 'High', acMid: 'Partly', acLow: 'Low',

  cycle: 'work & rest cycle', water: 'drinking water', nearestShelter: 'nearest cooling station',
  onSite: 'on site today', minWork: 'min work', minRest: 'min rest',
  mlEvery: (ml: number, m: number) => `${ml} ml · every ${m} min`,
  perHour: 'cycles per hour', restAt: 'take rest at', shiftTotal: 'across an 8 h shift',
  ors: 'ORS', orsYes: 'In every 2nd bottle', orsNo: 'Not needed today',
  capacity: 'capacity', openHours: 'open',
  waterCap: 'Never drink more than 1 litre in an hour. Too much water too fast is dangerous on its own.',
  stopWork: 'Stop outdoor work', stopSub: 'Move the crew to shade or a cooling station',
  moreDetail: 'More detail', lessDetail: 'Less detail',

  timer: 'cycle timer', notRunning: 'Not running', working: 'Working', resting: 'Resting',
  work: 'work', rest: 'rest', startCycle: 'Start cycle', pause: 'Pause', resume: 'Resume',
  startNote: 'Start the cycle when the crew begins work.',
  workNote: 'Keep going. Water break at the end of this stretch.',
  restNote: 'Sit in shade. Drink now — do not skip it.',
  toWork: 'Rest over — back to work.', toRest: 'Rest now. Move into shade and drink.',
  demoSpeed: 'Demo speed — 1 min plays as 1 sec.', realSpeed: 'Real time — 1 min is 1 min.',
  useReal: 'Use real time', useDemo: 'Use demo speed',

  sosTitle: 'Stop work immediately if', sosSub: 'Heat stroke can kill within an hour.',
  sos1: 'Dizziness, confusion or fainting', sos2: 'Vomiting or nausea',
  sos3: 'Sweating stops, skin turns dry', sos4: 'Cramps that will not settle',
  sosAction: 'Move the person into shade, loosen clothing, wet the skin, fan them, and call 108. Do not leave them alone.',
  sosBtn: 'Emergency — call 108',
  sosToast: 'Demo — a real call would dial 108.',

  rajasthan: 'Rajasthan',
  stateSub: 'All 33 districts, graded hour by hour. Tap one to open its blocks and wards.',
  blockSub: 'Tap a block to make it your site.', wardSub: 'Tap a ward or block to make it your site.',
  legend: '1 low → 5 extreme · hatched = stale data', hottest: 'highest right now',
  modeRisk: 'Risk', modeHeat: 'Heat only',
  modeRiskNote: 'Bands follow departure from each district’s own normal — the way the body actually feels it.',
  modeHeatNote: 'Raw apparent temperature only. Compare with Risk to see which districts the anomaly rule lifts.',
  district: 'district',

  approvalCloses: 'Approval closes 19:00',
  approvalSub: 'Approved advisories go out at 05:30.',
  awaiting: 'Awaiting approval',
  gateNote: 'Bands 4 and 5 must be read before sending.',
  blocks: 'blocks', block: 'block', readFirst: 'read first',
  slideApprove: 'Slide to approve', slideSend: 'Slide to schedule 05:30',
  queueClear: 'Queue clear', queueClearSub: 'Every block for tomorrow has been reviewed.',
  staleNote: 'raised one band · data 14 h old', vintage: 'issued 04:00 · 2 h ago',
  staleWhy: 'The IMD feed aged out, so the band was raised. It is never lowered on degraded data.',
  smsHindi: 'sms · hindi', ivrMarwari: 'ivr script · marwari', ivrTiming: 'ivr · timing',
  segWarn: '129 characters · 2 SMS segments', ivrWarn: '0:32 against a 0:30 cap',
  marwariNote: 'Marwari is not covered by Bhashini, so this plays from a recorded native-speaker prompt bank.',
  reaches: 'reaches', workers: 'registered workers', back: 'Back',

  shelterTitle: 'Open near ', shelterSub: 'Mark a station open when you arrive.',
  markOpen: 'not yet open', opened: 'open', openIt: 'Open', closeIt: 'Close',

  askHello: 'Namaste. Ask me anything about working in today’s heat.',
  askNote: 'Answers come from this district’s live forecast and the guidance table — not from a general chatbot, so it works with no signal.',
  askPlaceholder: 'Ask about heat, water, shelters…',
  qWater: 'How much water?', qHours: 'When can we work?', qShelter: 'Nearest shelter?',
  qSymptom: 'Someone feels dizzy', qTomorrow: 'What about tomorrow?',

  workType: 'type of work', workTypeHint: 'changes the ratio',
  auditEyebrow: 'audit trail', auditTitle: 'Advisory audit',
  auditSub: 'Every advisory issued, and the data vintage it was built on. Append-only, retained 5 years.',
  auditRecords: 'records', auditStale: 'on stale input', auditRetention: 'retention',
  auditVintage: 'issued', auditVintageTitle: 'data vintage',
  auditSource: 'source issued', auditAge: 'age at grading', auditModelRun: 'model run',
  auditRecipients: 'recipients', auditChain: 'provenance chain', auditRecord: 'record',
  auditReason: 'reason recorded', auditContent: 'content issued',
  auditVariants: 'variants issued',
  auditVariantsNote: 'One advisory, one approval — the work-intensity variants are derived, not separately governed.',
  auditExportCsv: 'Export CSV', auditExportJson: 'Export JSON',
  auditImmutable: 'Append-only. Editing a dispatched advisory creates a new record and marks the old one superseded — nothing is rewritten in place.',
  tabAudit: 'Audit', tabDispatch: 'Sent',
  dispatchEyebrow: 'alerts sent', dispatchTitle: 'Dispatch history',
  dispatchSub: 'Every alert issued, in all three forms, with what actually reached people.',
  fTitle: 'delivery funnel', alert: 'alert', alerts: 'alerts',
  fTargeted: 'Targeted', fDispatched: 'Dispatched', fDelivered: 'Delivered',
  fAnswered: 'Answered', fCompleted: 'Listened through',
  issuedIn: 'issued in three forms',
  issuedInNote: 'One approved advisory becomes an SMS and two voice calls. Both IVR languages are mandatory — a Hindi-only alert does not reach a Marwari-speaking crew.',
  dispatchHistory: 'history', reached: 'reached', dispatchRecord: 'dispatch',
  dispatchedAt: 'Sent', fromAdvisory: 'from',
  langRouting: 'language routing',
  langRoutingNote: 'Everyone receives the SMS. Which voice call they get follows the preferred-language field on their labour-database record.',
  answered: 'Answered', delivered: 'Delivered', listened: 'Listened through',
  repeatKey: 'Pressed repeat', segments: 'SMS segments', failed: 'Failed',
  retryQueue: 'retry queue', nextAttempt: 'next attempt', notRetried: 'not retried',
  optOuts: 'Opted out',
  ucs2Warn: 'Devanagari is UCS-2 — 2 segments per message',
  overCap: 'against a 30 s cap',
  signIn: 'Sign in', phoneLabel: 'Mobile number', phoneHint: 'Registered with BOCW or MGNREGA',
  sendCode: 'Send code', enterCode: 'Enter the 6-digit code', sentTo: 'Sent to',
  resend: 'Resend code', verify: 'Verify', changeNumber: 'Change number',
  demoAccounts: 'Demo accounts — no code needed',
  signOut: 'Sign out',
};

type Dict = typeof en;

const hi: Dict = {
  brand: 'ताप अलर्ट',
  tagline: 'बाहर काम करने वालों के लिए गर्मी की पूर्व चेतावनी',

  tabNow: 'अभी', tabMap: 'नक्शा', tabAsk: 'पूछें', tabApprove: 'अनुमोदन', tabShelters: 'केंद्र',

  dangerWindow: 'खतरे का समय',
  peakFeels: 'उच्चतम · महसूस',
  feelsLike: 'महसूस',
  confHigh: 'उच्च विश्वसनीयता', confMedium: 'मध्यम विश्वसनीयता', confLow: 'कम विश्वसनीयता',
  dayAhead: 'आगे का दिन', tapHour: 'समय चुनें', at: 'समय', band: 'बैंड',
  noWindow: 'कोई खतरे का समय नहीं — पूरे दिन बैंड 2 या कम।',
  windowIs: 'खतरे का समय',

  safeHours: 'काम के सुरक्षित घंटे', safeTitle: 'काम कब सुरक्षित है',
  keyWork: 'खुलकर काम', keyCycle: 'चक्र में काम', keyAvoid: 'भारी काम टालें', keyStop: 'बाहरी काम बंद',

  why: 'यह बैंड क्यों', rNormal: 'इस तारीख़ का सामान्य', rToday: 'आज',
  rDeparture: 'अंतर', rAcclim: 'गरमी के आदी',
  acHigh: 'बहुत', acMid: 'कुछ हद तक', acLow: 'नहीं',

  cycle: 'काम और आराम चक्र', water: 'पीने का पानी', nearestShelter: 'निकटतम शीतल केंद्र',
  onSite: 'आज साइट पर', minWork: 'मिनट काम', minRest: 'मिनट आराम',
  mlEvery: (ml: number, m: number) => `${ml} मि.ली. · हर ${m} मिनट`,
  perHour: 'प्रति घंटा चक्र', restAt: 'आराम का समय', shiftTotal: '8 घंटे की पाली में',
  ors: 'ORS', orsYes: 'हर दूसरी बोतल में', orsNo: 'आज ज़रूरत नहीं',
  capacity: 'क्षमता', openHours: 'खुला',
  waterCap: 'एक घंटे में 1 लीटर से ज़्यादा कभी न पिएँ। बहुत तेज़ी से बहुत पानी अपने आप में ख़तरनाक है।',
  stopWork: 'बाहर काम बंद करें', stopSub: 'टीम को छाया या शीतल केंद्र में ले जाएँ',
  moreDetail: 'और जानकारी', lessDetail: 'कम जानकारी',

  timer: 'चक्र टाइमर', notRunning: 'चालू नहीं', working: 'काम जारी', resting: 'आराम',
  work: 'काम', rest: 'आराम', startCycle: 'चक्र शुरू करें', pause: 'रोकें', resume: 'जारी रखें',
  startNote: 'काम शुरू होते ही चक्र शुरू करें।',
  workNote: 'काम जारी रखें। इस चरण के बाद पानी।',
  restNote: 'छाया में बैठें। अभी पानी पिएँ।',
  toWork: 'आराम पूरा — काम पर लौटें।', toRest: 'आराम करें। छाया में जाएँ और पानी पिएँ।',
  demoSpeed: 'डेमो गति — 1 मिनट = 1 सेकंड।', realSpeed: 'वास्तविक समय।',
  useReal: 'वास्तविक समय', useDemo: 'डेमो गति',

  sosTitle: 'इन लक्षणों पर तुरंत काम रोकें', sosSub: 'लू लगने से एक घंटे में जान जा सकती है।',
  sos1: 'चक्कर, भ्रम या बेहोशी', sos2: 'उल्टी या मतली',
  sos3: 'पसीना बंद, त्वचा सूखी', sos4: 'न रुकने वाली ऐंठन',
  sosAction: 'व्यक्ति को छाया में ले जाएँ, कपड़े ढीले करें, शरीर गीला करें, हवा करें और 108 पर कॉल करें। अकेला न छोड़ें।',
  sosBtn: 'आपातकाल — 108 पर कॉल',
  sosToast: 'डेमो — असली कॉल 108 पर जाएगी।',

  rajasthan: 'राजस्थान',
  stateSub: 'सभी 33 ज़िले, हर घंटे श्रेणीबद्ध। ब्लॉक और वार्ड देखने के लिए ज़िला दबाएँ।',
  blockSub: 'अपनी साइट चुनने के लिए ब्लॉक दबाएँ।', wardSub: 'अपनी साइट चुनने के लिए वार्ड या ब्लॉक दबाएँ।',
  legend: '1 कम → 5 अत्यधिक · धारीदार = पुराना डेटा', hottest: 'अभी सबसे अधिक',
  modeRisk: 'जोखिम', modeHeat: 'केवल गरमी',
  modeRiskNote: 'बैंड हर ज़िले के अपने सामान्य से अंतर पर आधारित — जैसा शरीर सचमुच महसूस करता है।',
  modeHeatNote: 'केवल महसूस होने वाला तापमान। जोखिम से तुलना करें कि अंतर का नियम किन ज़िलों को ऊपर उठाता है।',
  district: 'ज़िला',

  approvalCloses: 'अनुमोदन शाम 7 बजे बंद',
  approvalSub: 'स्वीकृत सलाह कल 5:30 बजे जाएगी।',
  awaiting: 'अनुमोदन शेष',
  gateNote: 'बैंड 4 और 5 को भेजने से पहले पढ़ना ज़रूरी है।',
  blocks: 'ब्लॉक', block: 'ब्लॉक', readFirst: 'पहले पढ़ें',
  slideApprove: 'स्वीकृत करने को खिसकाएँ', slideSend: '5:30 बजे भेजने को खिसकाएँ',
  queueClear: 'सूची पूरी', queueClearSub: 'कल के सभी ब्लॉक देख लिए गए।',
  staleNote: 'एक बैंड बढ़ाया · डेटा 14 घंटे पुराना', vintage: '04:00 बजे जारी · 2 घंटे पहले',
  staleWhy: 'आईएमडी फ़ीड पुरानी है, इसलिए बैंड बढ़ाया गया — घटाया कभी नहीं जाता।',
  smsHindi: 'एसएमएस · हिंदी', ivrMarwari: 'आईवीआर स्क्रिप्ट · मारवाड़ी', ivrTiming: 'आईवीआर · अवधि',
  segWarn: '129 अक्षर · 2 एसएमएस खंड', ivrWarn: '0:32 — सीमा 0:30',
  marwariNote: 'भाषिणी में मारवाड़ी नहीं है, इसलिए यह रिकॉर्ड की गई देशी आवाज़ की प्रॉम्प्ट बैंक से चलती है।',
  reaches: 'पहुँच', workers: 'पंजीकृत मज़दूर', back: 'वापस',

  shelterTitle: 'खुले केंद्र — ', shelterSub: 'पहुँचने पर केंद्र को खुला दर्ज करें।',
  markOpen: 'अभी बंद', opened: 'खुला', openIt: 'खोलें', closeIt: 'बंद करें',

  askHello: 'नमस्ते। आज की गर्मी में काम को लेकर कुछ भी पूछें।',
  askNote: 'जवाब इस ज़िले के मौजूदा पूर्वानुमान और सलाह तालिका से आते हैं — किसी सामान्य चैटबॉट से नहीं, इसलिए बिना नेटवर्क भी चलता है।',
  askPlaceholder: 'गर्मी, पानी, केंद्र के बारे में पूछें…',
  qWater: 'कितना पानी?', qHours: 'काम कब करें?', qShelter: 'नज़दीकी केंद्र?',
  qSymptom: 'किसी को चक्कर आ रहा है', qTomorrow: 'कल कैसा रहेगा?',

  workType: 'काम का प्रकार', workTypeHint: 'अनुपात बदलता है',
  auditEyebrow: 'अंकेक्षण', auditTitle: 'सलाह अंकेक्षण',
  auditSub: 'हर जारी सलाह और वह डेटा जिस पर बनी। केवल जोड़ी जाती है, 5 साल तक सुरक्षित।',
  auditRecords: 'रिकॉर्ड', auditStale: 'पुराने डेटा पर', auditRetention: 'अवधि',
  auditVintage: 'जारी', auditVintageTitle: 'डेटा की आयु',
  auditSource: 'स्रोत जारी', auditAge: 'ग्रेडिंग पर आयु', auditModelRun: 'मॉडल रन',
  auditRecipients: 'प्राप्तकर्ता', auditChain: 'उद्गम शृंखला', auditRecord: 'रिकॉर्ड',
  auditReason: 'दर्ज कारण', auditContent: 'जारी सामग्री',
  auditVariants: 'जारी रूप',
  auditVariantsNote: 'एक सलाह, एक अनुमोदन — काम के प्रकार के रूप उसी से निकलते हैं।',
  auditExportCsv: 'CSV निर्यात', auditExportJson: 'JSON निर्यात',
  auditImmutable: 'केवल जोड़ी जाती है। भेजी गई सलाह बदलने पर नया रिकॉर्ड बनता है और पुराना प्रतिस्थापित होता है।',
  tabAudit: 'अंकेक्षण', tabDispatch: 'भेजे',
  dispatchEyebrow: 'भेजी गई चेतावनी', dispatchTitle: 'प्रेषण इतिहास',
  dispatchSub: 'हर जारी चेतावनी, तीनों रूपों में, और वास्तव में कितनों तक पहुँची।',
  fTitle: 'वितरण क्रम', alert: 'चेतावनी', alerts: 'चेतावनियाँ',
  fTargeted: 'लक्षित', fDispatched: 'भेजा', fDelivered: 'प्राप्त',
  fAnswered: 'उठाया', fCompleted: 'पूरा सुना',
  issuedIn: 'तीन रूपों में जारी',
  issuedInNote: 'एक स्वीकृत सलाह एक एसएमएस और दो वॉइस कॉल बनती है। दोनों आईवीआर भाषाएँ अनिवार्य — केवल हिंदी की चेतावनी मारवाड़ी बोलने वालों तक नहीं पहुँचती।',
  dispatchHistory: 'इतिहास', reached: 'तक पहुँची', dispatchRecord: 'प्रेषण',
  dispatchedAt: 'भेजा', fromAdvisory: 'से',
  langRouting: 'भाषा के अनुसार',
  langRoutingNote: 'एसएमएस सबको जाता है। कौन-सी वॉइस कॉल मिलेगी, यह श्रम रजिस्ट्री में दर्ज पसंदीदा भाषा से तय होता है।',
  answered: 'उठाया', delivered: 'प्राप्त', listened: 'पूरा सुना',
  repeatKey: 'दोहराया', segments: 'एसएमएस खंड', failed: 'विफल',
  retryQueue: 'पुनः प्रयास', nextAttempt: 'अगला प्रयास', notRetried: 'दोबारा नहीं',
  optOuts: 'सेवा छोड़ी',
  ucs2Warn: 'देवनागरी UCS-2 है — प्रति संदेश 2 खंड',
  overCap: '30 सेकंड की सीमा के विरुद्ध',
  signIn: 'साइन इन', phoneLabel: 'मोबाइल नंबर', phoneHint: 'BOCW या मनरेगा में पंजीकृत',
  sendCode: 'कोड भेजें', enterCode: '6 अंकों का कोड डालें', sentTo: 'भेजा गया',
  resend: 'दोबारा भेजें', verify: 'पुष्टि करें', changeNumber: 'नंबर बदलें',
  demoAccounts: 'डेमो खाते — कोड की ज़रूरत नहीं',
  signOut: 'साइन आउट',
};

export const DICT: Record<Locale, Dict> = { en, hi };
export const isHindi = (l: Locale) => l === 'hi';
/** Devanagari needs a larger size and looser leading than Latin at the same rank. */
export const dv = (l: Locale, base = '') => (l === 'hi' ? `${base} font-dv`.trim() : base);

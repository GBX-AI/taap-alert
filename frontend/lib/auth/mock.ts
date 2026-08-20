import type { AuthProvider, OtpChallenge, Session } from './provider';

/**
 * Mock OTP. Accepts ANY six digits — this is a demo, and it says so on screen.
 * Do not let this reach a real deployment: gate on NEXT_PUBLIC_AUTH_SOURCE.
 *
 * The seeded registry demonstrates FR-5.6 geographic targeting: a phone number
 * resolves to the worker's own block, so the advisory they see is the one that
 * would actually be dispatched to them.
 */
const REGISTRY: Record<string, Session> = {
  '9414410001': { phone: '9414410001', name: 'Ramlal Bhati', role: 'worker',
    districtId: 'jodhpur', blockId: 'phalodi', source: 'BOCW' },
  '9414410002': { phone: '9414410002', name: 'Sunita Devi', role: 'worker',
    districtId: 'jodhpur', blockId: 'shergarh', source: 'MGNREGA' },
  '9414410003': { phone: '9414410003', name: 'Mohan Singh', role: 'supervisor',
    districtId: 'jodhpur', blockId: 'phalodi', source: 'Supervisor roster' },
  '9414410004': { phone: '9414410004', name: 'R. Bishnoi', role: 'officer',
    districtId: 'jodhpur', blockId: 'phalodi', source: 'Department' },
  '9414410005': { phone: '9414410005', name: 'K. Meena', role: 'officer',
    districtId: 'kota', blockId: 'ladpura', source: 'Department' },
};

export const DEMO_ACCOUNTS = Object.values(REGISTRY);

/** Anything not in the seeded registry still gets in, as an unregistered worker. */
function fallback(phone: string): Session {
  return { phone, name: 'Guest worker', role: 'worker',
    districtId: 'jodhpur', blockId: 'phalodi', source: 'BOCW' };
}

const pending = new Map<string, string>();
let counter = 0;

const mask = (p: string) => `+91 ${p.slice(0, 2)}xx xx${p.slice(-4)}`;

export const mockAuthProvider: AuthProvider = {
  async requestOtp(phone): Promise<OtpChallenge> {
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length !== 10) throw new Error('Enter a 10-digit mobile number.');
    const requestId = `mock-${++counter}`;
    pending.set(requestId, digits);
    return { requestId, maskedPhone: mask(digits), devCode: '123456', expiresInSec: 30 };
  },

  async verifyOtp(requestId, code): Promise<Session> {
    const phone = pending.get(requestId);
    if (!phone) throw new Error('That code has expired. Request a new one.');
    if (!/^\d{6}$/.test(code)) throw new Error('Enter the 6-digit code.');
    pending.delete(requestId);
    return REGISTRY[phone] ?? fallback(phone);
  },
};

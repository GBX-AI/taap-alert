/**
 * Authentication seam.
 *
 * The prototype ships a mock OTP provider so the flow can be demonstrated with
 * no telecom account. A production build swaps in an aggregator (MSG91,
 * Gupshup, Kaleyra) behind the same interface — see auth/msg91.ts.
 *
 * India-specific constraints the real implementation must satisfy, none of
 * which the mock enforces:
 *   · every SMS template DLT-registered with TRAI, sent from a registered header
 *   · transactional classification so OTPs reach DND numbers
 *   · consent captured and revocable per DPDP Act 2023 (FR-5.8, NFR-7)
 */

export type Role = 'worker' | 'supervisor' | 'officer';
export type { Intensity } from '../forecast/bands';

export interface Session {
  phone: string;
  name: string;
  role: Role;
  /** Home district id. */
  districtId: string;
  /** Home block/ward id. */
  blockId: string;
  /** Which labour database the record came from — FR-5.2, FR-5.3. */
  source: 'BOCW' | 'MGNREGA' | 'Supervisor roster' | 'Department';
  /** Registered work-intensity class — FR-5.1. Drives which advisory variant they see. */
  intensity: import('../forecast/bands').Intensity;
}

export interface OtpChallenge {
  requestId: string;
  /** Masked for display, e.g. "+91 94xx xx4471". */
  maskedPhone: string;
  /** Mock only — the real provider never returns the code to the client. */
  devCode?: string;
  expiresInSec: number;
}

export interface AuthProvider {
  requestOtp(phone: string): Promise<OtpChallenge>;
  verifyOtp(requestId: string, code: string): Promise<Session>;
}

export const AUTH_SOURCE = process.env.NEXT_PUBLIC_AUTH_SOURCE ?? 'mock';

export async function getAuthProvider(): Promise<AuthProvider> {
  if (AUTH_SOURCE === 'msg91') {
    const { msg91AuthProvider } = await import('./msg91');
    return msg91AuthProvider;
  }
  const { mockAuthProvider } = await import('./mock');
  return mockAuthProvider;
}

const KEY = 'taap.session';

export function loadSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
}

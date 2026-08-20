import type { AuthProvider, OtpChallenge, Session } from './provider';

/**
 * Production OTP via an Indian aggregator. Not wired in the prototype.
 *
 * Requirements before this can be switched on:
 *   · DLT entity + header registered with the operators
 *   · OTP template registered and its template id set below
 *   · verification handled server-side; the client must never see the code
 */
const BASE = process.env.NEXT_PUBLIC_AUTH_API_BASE ?? '/api/auth';

export const msg91AuthProvider: AuthProvider = {
  async requestOtp(phone): Promise<OtpChallenge> {
    const res = await fetch(`${BASE}/otp/request`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw new Error('Could not send the code. Try again.');
    return res.json();
  },

  async verifyOtp(requestId, code): Promise<Session> {
    const res = await fetch(`${BASE}/otp/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestId, code }),
    });
    if (!res.ok) throw new Error('That code did not match.');
    return res.json();
  },
};

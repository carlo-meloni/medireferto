'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { checkRateLimit, getIP, loginLimiter } from '@/lib/rate-limit';

export async function loginAction(email: string, password: string): Promise<{ error: string } | undefined> {
  const ip = await getIP();
  const key = `${ip}:${email}`;
  const { allowed, retryAfterSeconds } = await checkRateLimit(loginLimiter, key);

  if (!allowed) {
    const minutes = Math.ceil((retryAfterSeconds ?? 0) / 60);
    return { error: `Troppi tentativi di accesso. Riprova tra ${minutes} minut${minutes === 1 ? 'o' : 'i'}.` };
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o password non validi.' };
    }
    throw error;
  }
}

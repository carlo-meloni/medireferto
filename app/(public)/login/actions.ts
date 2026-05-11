'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { checkRateLimit, getIP, loginLimiter } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const ip = await getIP();
  const key = `${ip}:${email}`;
  const { allowed, retryAfterSeconds } = await checkRateLimit(loginLimiter, key);

  if (!allowed) {
    const minutes = Math.ceil((retryAfterSeconds ?? 0) / 60);
    redirect(`/login?error=${encodeURIComponent(`Troppi tentativi di accesso. Riprova tra ${minutes} minut${minutes === 1 ? 'o' : 'i'}.`)}`);
  }

  const user = await prisma.user.findFirst({ where: { email }, select: { role: true } });
  const redirectTo = user?.role === 'ADMIN' ? '/admin' : '/medico';

  let loginError: string | undefined;
  try {
    await signIn('credentials', { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      loginError = 'Email o password non validi.';
    } else {
      throw error;
    }
  }

  if (loginError) {
    redirect(`/login?error=${encodeURIComponent(loginError)}`);
  }
}

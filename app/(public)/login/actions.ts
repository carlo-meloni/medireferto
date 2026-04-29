'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginAction(email: string, password: string): Promise<{ error: string } | undefined> {
  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o password non validi.' };
    }
    throw error;
  }
}

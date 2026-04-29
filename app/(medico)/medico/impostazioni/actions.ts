'use server';

import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

type Result = { success: true } | { success: false; error: string };

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Non autenticato' };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { success: false, error: 'Utente non trovato' };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { success: false, error: 'Password attuale non corretta' };

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return { success: true };
}

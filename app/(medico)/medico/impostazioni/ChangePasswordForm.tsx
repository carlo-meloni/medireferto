'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { changePassword } from './actions';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (next.length < 8) {
      setError('La nuova password deve essere di almeno 8 caratteri');
      return;
    }
    if (next !== confirm) {
      setError('Le password non coincidono');
      return;
    }

    setLoading(true);
    const result = await changePassword(current, next);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current-password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Password attuale
          </Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Nuova password
          </Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            className="focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Conferma password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 animate-[fade-in_0.2s_ease-out]">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 animate-[fade-in_0.2s_ease-out]">
          <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
          Password aggiornata con successo
        </div>
      )}

      <div className="pt-1">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 transition-all duration-150"
        >
          {loading ? 'Salvataggio…' : 'Aggiorna password'}
        </Button>
      </div>
    </form>
  );
}

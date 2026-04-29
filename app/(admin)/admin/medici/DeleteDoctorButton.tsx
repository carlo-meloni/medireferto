'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { deleteMedico } from '@/lib/db/doctor';

interface Props {
  doctorId: string;
  doctorName: string;
}

export default function DeleteDoctorButton({ doctorId, doctorName }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteMedico(doctorId);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => { setError(null); setOpen(true); }}
        className="text-red-500 text-xs font-medium hover:text-red-700"
      >
        Elimina
      </button>

      {mounted && createPortal(
        open ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !isPending && setOpen(false)}
            />

            <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl text-center">
              <h2 className="text-base font-semibold text-zinc-900">
                Elimina medico
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Sei sicuro di voler eliminare{' '}
                <span className="font-medium text-zinc-900">{doctorName}</span>?
                <br />
                Questa azione non può essere annullata.
              </p>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? 'Eliminazione…' : 'Elimina'}
                </button>
              </div>
            </div>
          </div>
        ) : null,
        document.body
      )}
    </>
  );
}

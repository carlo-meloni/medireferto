'use client';

import { useState } from 'react';
import { deleteDoctorAction } from '@/lib/db/doctor';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, X, Check } from 'lucide-react'; 

export function DeleteDoctorButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Nuovo stato per la conferma

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteDoctorAction(id);
      // Non serve resettare showConfirm perché la riga sparirà
    } catch (error: any) {
      alert(error.message);
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  // Se l'utente ha cliccato una volta, mostriamo i tasti di conferma
  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          className="h-8 px-2 text-zinc-500 hover:text-zinc-800"
          disabled={isDeleting}
        >
          <X className="h-4 w-4 mr-1" />
          <span className="text-xs">No</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Sì, elimina</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  // Stato iniziale: solo l'iconcina della pattumiera
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      title="Elimina medico"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
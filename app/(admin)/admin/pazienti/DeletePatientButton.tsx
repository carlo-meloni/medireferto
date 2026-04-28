'use client';

import { useState } from 'react';
import { deletePatientAction } from '@/lib/db/patient';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, X, Check } from 'lucide-react'; 

export function DeletePatientButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePatientAction(id);
    } catch (error: any) {
      alert(error.message);
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

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
          className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white font-medium"
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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      title="Elimina paziente"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
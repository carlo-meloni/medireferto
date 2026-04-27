'use client';

import { useState } from 'react';
import { deleteDoctorAction } from '@/lib/db/doctor';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react'; 

export function DeleteDoctorButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Sei sicuro di voler eliminare definitivamente questo medico?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoctorAction(id);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      title="Elimina medico"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
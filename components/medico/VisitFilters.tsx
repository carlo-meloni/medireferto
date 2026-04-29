'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VisitFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hasFilters =
    searchParams.get('patientSearch') ||
    searchParams.get('dateFrom') ||
    searchParams.get('dateTo') ||
    searchParams.get('status');

  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-zinc-500">Paziente</Label>
        <Input
          type="text"
          placeholder="Nome, cognome o codice fiscale"
          defaultValue={searchParams.get('patientSearch') ?? ''}
          onChange={(e) => updateParams({ patientSearch: e.target.value })}
          className="w-72"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-zinc-500">Dal</Label>
        <Input
          type="date"
          defaultValue={searchParams.get('dateFrom') ?? ''}
          onChange={(e) => updateParams({ dateFrom: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-zinc-500">Al</Label>
        <Input
          type="date"
          defaultValue={searchParams.get('dateTo') ?? ''}
          onChange={(e) => updateParams({ dateTo: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-zinc-500">Stato</Label>
        <Select
          value={searchParams.get('status') ?? 'ALL'}
          onValueChange={(value) => updateParams({ status: !value || value === 'ALL' ? '' : value })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tutti" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tutti</SelectItem>
            <SelectItem value="IN_REGISTRAZIONE">In registrazione</SelectItem>
            <SelectItem value="IN_REVISIONE">In revisione</SelectItem>
            <SelectItem value="APPROVATO">Approvato</SelectItem>
            <SelectItem value="ESPORTATO">Esportato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={() => router.push('?')}>
          Azzera filtri
        </Button>
      )}
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
}

export default function Pagination({ page, total, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-zinc-400">
        {total} {total === 1 ? 'visita' : 'visite'} — pagina {page} di {totalPages}
      </span>

      <div className="flex items-center gap-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          aria-label="Pagina precedente"
        >
          <span className="hidden sm:inline">Precedente</span>
          <span className="sm:hidden">←</span>
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => goToPage(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          aria-label="Pagina successiva"
        >
          <span className="hidden sm:inline">Successiva</span>
          <span className="sm:hidden">→</span>
        </Button>
      </div>
    </div>
  );
}

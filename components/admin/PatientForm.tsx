'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { patientFormSchema, type PatientFormValues } from '@/app/(admin)/admin/pazienti/validator';
import { createPaziente, updatePaziente } from '@/lib/db/patient';

interface PatientFormProps {
  mode: 'create' | 'edit';
  initialValues?: PatientFormValues;
  patientId?: string;
}

const EMPTY_VALUES: PatientFormValues = {
  firstName: '',
  lastName: '',
  fiscalCode: '',
  birthDate: '',
  birthPlace: '',
  gender: 'M',
  phone: '',
  email: '',
};

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export default function PatientForm({ mode, initialValues, patientId }: PatientFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  async function onSubmit(values: PatientFormValues) {
    setSubmitting(true);
    setServerError(null);

    const result =
      mode === 'create'
        ? await createPaziente(values)
        : await updatePaziente(patientId!, values);

    if (!result.success) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }

    router.push('/admin/pazienti');
  }

  const title = mode === 'create' ? 'Nuovo paziente' : 'Modifica paziente';
  const subtitle =
    mode === 'create'
      ? "Aggiungi un nuovo paziente all'anagrafica."
      : 'Aggiorna i dati anagrafici del paziente.';
  const submitLabel = mode === 'create' ? 'Crea paziente' : 'Salva modifiche';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 animate-fade-in">
        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-blue-500" />
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
            </div>
            <p className="ml-4 text-sm leading-relaxed text-zinc-500">{subtitle}</p>
          </div>
          <Link
            href="/admin/pazienti"
            className="group flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
          >
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            Torna alla lista
          </Link>
        </header>

        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 animate-slide-up">
            <svg className="mt-0.5 size-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <section
          className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3">
            <span className="size-1.5 rounded-full bg-blue-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Dati anagrafici</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Nome</FormLabel>
                  <FormControl>
                    <Input className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Cognome</FormLabel>
                  <FormControl>
                    <Input className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fiscalCode"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Codice fiscale</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RSSMRA80A01H501X"
                      maxLength={16}
                      className="font-mono uppercase tracking-wider transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Data di nascita</FormLabel>
                  <FormControl>
                    <Input type="date" className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Luogo di nascita</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Roma (RM)" className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Sesso</FormLabel>
                  <FormControl>
                    <select {...field} className={selectClass}>
                      <option value="M">Maschile</option>
                      <option value="F">Femminile</option>
                      <option value="ALTRO">Altro</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section
          className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3">
            <span className="size-1.5 rounded-full bg-blue-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Contatti</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Telefono</FormLabel>
                  <FormControl>
                    <Input type="tel" className="transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
          <Link href="/admin/pazienti" className={buttonVariants({ variant: 'outline' })}>
            Annulla
          </Link>
          <Button type="submit" disabled={submitting} className="min-w-36 transition-all duration-200">
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvataggio…
              </span>
            ) : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

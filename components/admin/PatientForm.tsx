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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          <Link
            href="/admin/pazienti"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition"
          >
            ← Torna alla lista
          </Link>
        </header>

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Dati anagrafici</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Codice fiscale</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RSSMRA80A01H501X"
                      maxLength={16}
                      className="font-mono uppercase"
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
                  <FormLabel>Data di nascita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Luogo di nascita</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Roma (RM)" {...field} />
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
                  <FormLabel>Sesso</FormLabel>
                  <FormControl>
                    <select {...field} className={selectClass}>
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="ALTRO">Altro</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Contatti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/pazienti" className={buttonVariants({ variant: 'outline' })}>
            Annulla
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvataggio…' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
import { patientFormSchema, type PatientFormValues } from '@/app/(medico)/medico/pazienti/validator';
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

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  async function onSubmit(values: PatientFormValues) {
    setSubmitting(true);
    const result =
      mode === 'create'
        ? await createPaziente(values)
        : await updatePaziente(patientId!, values);

    if (!result.success) {
      form.setError('root', { message: result.error });
      setSubmitting(false);
      return;
    }

    router.push('/medico/pazienti');
  }

  const title = mode === 'create' ? 'Nuovo paziente' : 'Modifica paziente';
  const subtitle =
    mode === 'create'
      ? "Aggiungi un nuovo paziente all'anagrafica."
      : 'Aggiorna i dati anagrafici del paziente.';
  const submitLabel = mode === 'create' ? 'Crea paziente' : 'Salva modifiche';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 animate-fade-in"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm text-zinc-500">{subtitle}</p>
          </div>
          <Link
            href="/medico/pazienti"
            className="inline-flex items-center gap-1.5 mt-1 shrink-0 text-sm font-medium text-zinc-400 hover:text-zinc-700 transition-colors duration-150"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Torna alla lista
          </Link>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 animate-[slide-up_0.3s_ease-out_0.05s_both]">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Dati anagrafici
            </h2>
          </div>
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
                      className="font-mono uppercase tracking-widest"
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

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 animate-[slide-up_0.3s_ease-out_0.12s_both]">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Contatti
            </h2>
          </div>
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

        {form.formState.errors.root && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-fade-in">
            <p className="text-sm font-medium text-red-700">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 animate-[slide-up_0.3s_ease-out_0.18s_both]">
          <Link href="/medico/pazienti" className={buttonVariants({ variant: 'outline' })}>
            Annulla
          </Link>
          <Button type="submit" disabled={submitting} className="min-w-36">
            {submitting ? 'Salvataggio…' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

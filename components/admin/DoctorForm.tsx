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
import { doctorFormSchema, type DoctorFormValues } from '@/app/(admin)/admin/medici/validator';

interface DoctorFormProps {
  mode: 'create' | 'edit';
  initialValues?: DoctorFormValues;
  doctorId?: string;
}

const EMPTY_VALUES: DoctorFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  specialization: '',
  licenseNumber: '',
  clinicName: '',
  clinicAddress: '',
  phone: '',
};

export default function DoctorForm({ mode, initialValues, doctorId }: DoctorFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  async function onSubmit(values: DoctorFormValues) {
    setSubmitting(true);
    // TODO: collegare a server action quando il DB sarà attivo
    console.log(mode === 'create' ? 'Create doctor' : `Update doctor ${doctorId}`, values);
    await new Promise((r) => setTimeout(r, 400));
    router.push('/admin/medici');
  }

  const title = mode === 'create' ? 'Nuovo medico' : 'Modifica medico';
  const subtitle =
    mode === 'create'
      ? 'Aggiungi un nuovo medico alla piattaforma.'
      : 'Aggiorna i dati del medico selezionato.';
  const submitLabel = mode === 'create' ? 'Crea medico' : 'Salva modifiche';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          <Link
            href="/admin/medici"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition"
          >
            ← Torna alla lista
          </Link>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Dati personali</h2>
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

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Profilo professionale</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializzazione</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Cardiologia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero albo</FormLabel>
                  <FormControl>
                    <Input placeholder="es. MI-123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Studio</h2>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="clinicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome studio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo studio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/medici" className={buttonVariants({ variant: 'outline' })}>
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

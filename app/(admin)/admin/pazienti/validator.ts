import { z } from 'zod';

const FISCAL_CODE_RE = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

export const patientFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Il nome è obbligatorio').max(80),
  lastName: z.string().trim().min(1, 'Il cognome è obbligatorio').max(80),
  fiscalCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(16, 'Il codice fiscale deve essere di 16 caratteri')
    .regex(FISCAL_CODE_RE, 'Formato codice fiscale non valido'),
  birthDate: z
    .string()
    .min(1, 'La data di nascita è obbligatoria')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Data non valida')
    .refine((v) => new Date(v) <= new Date(), 'La data non può essere futura'),
  birthPlace: z.string().trim().min(1, 'Il luogo di nascita è obbligatorio').max(120),
  gender: z.enum(['M', 'F', 'ALTRO'], { message: 'Sesso non valido' }),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s()./-]*$/u, 'Telefono contiene caratteri non validi')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Email non valida')
    .optional()
    .or(z.literal('')),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

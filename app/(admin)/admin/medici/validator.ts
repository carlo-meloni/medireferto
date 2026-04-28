import { z } from 'zod';

export const doctorFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Il nome è obbligatorio').max(80),
  lastName: z.string().trim().min(1, 'Il cognome è obbligatorio').max(80),
  
  email: z.string().trim().email('Email non valida').min(1, 'L\'email è obbligatoria'),
  //password: z.string().min(8, 'La password deve essere di almeno 8 caratteri'),

  specialization: z.string().trim().min(1, 'La specializzazione è obbligatoria').max(120),
  licenseNumber: z
    .string()
    .trim()
    .min(1, 'Il numero di albo è obbligatorio')
    .max(40),

  clinicName: z.string().trim().max(120).optional().or(z.literal('')),
  clinicAddress: z.string().trim().max(200).optional().or(z.literal('')),

  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s()./-]*$/u, 'Telefono contiene caratteri non validi')
    .optional()
    .or(z.literal('')),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
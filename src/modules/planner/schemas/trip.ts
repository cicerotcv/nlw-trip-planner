import { z } from 'zod';

export const tripDetailsSchema = z.object({
  dates: z.object({
    startsAt: z.string({ required_error: 'Data de início é obrigatória' }),
    endsAt: z.string({ required_error: 'Data de término é obrigatória' }),
  }),
  destination: z.string({ required_error: 'Destino é obrigatório' }).min(4, {
    message: 'Destino deve ter pelo menos 4 caracteres',
  }),
});

export type TripDetailsSchema = z.infer<typeof tripDetailsSchema>;

export const tripGuestsSchema = z.object({
  emailsToInvite: z.array(
    z
      .string({
        required_error: 'Email é obrigatório',
      })
      .email({
        message: 'Email inválido',
      }),
    {
      required_error: 'Pelo menos um convidado é obrigatório',
    },
  ),
});

export type TripGuestsSchema = z.infer<typeof tripGuestsSchema>;

export const tripSchema = z.object({
  tripDetails: tripDetailsSchema,
  tripGuests: tripGuestsSchema,
});

export type TripSchema = z.infer<typeof tripSchema>;

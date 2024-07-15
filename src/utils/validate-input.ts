import { z } from 'zod';

import { tripSchema } from '@/modules/planner/schemas/trip';

function url(url: string) {
  const urlSchema = z.string().url();

  return urlSchema.safeParse(url).success;
}

function email(email: string) {
  const emailSchema = z.string().email();

  return emailSchema.safeParse(email).success;
}

function trip(trip: any) {
  return tripSchema.safeParseAsync({
    tripDetails: {
      destination: trip?.destination,
      dates: {
        startsAt: trip?.selectedDates?.startsAt?.dateString,
        endsAt: trip?.selectedDates?.endsAt?.dateString,
      },
    },
    tripGuests: { emails_to_invite: trip?.emailsToInvite },
  });
}

export const validateInput = { url, email, trip };

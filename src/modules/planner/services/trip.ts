import { ObjectToCamel, objectToCamel } from 'ts-case-convert/lib/caseConvert';

import { wrapRequest } from '@/utils/requests';

import { api } from './api';

export type TripDetailsRaw = {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
};

export type TripDetails = ObjectToCamel<TripDetailsRaw>;

export type TripCreateRaw = Omit<TripDetailsRaw, 'id' | 'is_confirmed'> & {
  emails_to_invite: string[];
};
export type TripCreate = ObjectToCamel<TripCreateRaw>;

export type TripUpdateRaw = Omit<TripDetailsRaw, 'is_confirmed'>;
export type TripUpdate = ObjectToCamel<TripUpdateRaw>;

export namespace TripService {
  export const getById = wrapRequest(async (id: string) => {
    const { data } = await api.get<{ trip: TripDetailsRaw }>(`/trips/${id}`);

    return objectToCamel(data.trip);
  });

  export const create = wrapRequest(async (trip: TripCreate) => {
    const { data } = await api.post<{ tripId: string }>('/trips', {
      destination: trip.destination,
      starts_at: trip.startsAt,
      ends_at: trip.endsAt,
      emails_to_invite: trip.emailsToInvite,
      owner_name: 'John Doe',
      owner_email: 'elm.tiago@gmail.com',
    });

    return data;
  });
  export const update = wrapRequest(async (trip: TripUpdate) => {
    await api.put(`/trips/${trip.id}`, {
      destination: trip.destination,
      starts_at: trip.startsAt,
      ends_at: trip.endsAt,
    });
  });
}

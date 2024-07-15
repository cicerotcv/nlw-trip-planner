import { ObjectToCamel, objectToCamel } from 'ts-case-convert/lib/caseConvert';

import { wrapRequest } from '@/utils/requests';

import { api } from './api';

type ParticipantRaw = {
  id: string;
  name: string;
  email: string;
  is_confirmed: boolean;
};

export type Particpant = ObjectToCamel<ParticipantRaw>;

type ParticipantConfirm = {
  participantId: string;
  name: string;
  email: string;
};

export namespace ParticipantService {
  export const getByTripId = wrapRequest(async (tripId: string) => {
    const { data } = await api.get<{ participants: ParticipantRaw[] }>(
      `/trips/${tripId}/participants`,
    );

    return objectToCamel(data.participants);
  });

  export const confirmTripByParticipantId = wrapRequest(
    async (params: ParticipantConfirm) => {
      await api.patch(`/participants/${params.participantId}/confirm`, {
        name: params.name,
        email: params.email,
      });
    },
  );
}

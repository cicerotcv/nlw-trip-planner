import { wrapRequest } from '@/utils/requests';

import { api } from './api';

export type Link = {
  id: string;
  title: string;
  url: string;
};

export type LinkCreate = Omit<Link, 'id'> & {
  tripId: string;
};

export namespace LinkService {
  export const getLinksByTripId = wrapRequest(async (tripId: string) => {
    const { data } = await api.get<{ links: Link[] }>(`/trips/${tripId}/links`);
    return data.links;
  });

  export const create = wrapRequest(
    async ({ tripId, title, url }: LinkCreate) => {
      const { data } = await api.post<{ linkId: string }>(
        `/trips/${tripId}/links`,
        { title, url },
      );

      return data;
    },
  );
}

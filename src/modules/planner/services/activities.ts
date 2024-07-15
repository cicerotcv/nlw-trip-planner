import { ObjectToCamel, objectToCamel } from 'ts-case-convert/lib/caseConvert';

import { wrapRequest } from '@/utils/requests';

import { api } from './api';

type Activity = {
  id: string;
  occurs_at: string;
  title: string;
};

type ActivityResponseRaw = {
  activities: {
    date: string;
    activities: Activity[];
  }[];
};

export type ActivitiesResponse =
  ObjectToCamel<ActivityResponseRaw>['activities'];

type CreateActivitiesRaw = Omit<Activity, 'id'> & {
  tripId: string;
};

export type CreateActivities = ObjectToCamel<CreateActivitiesRaw>;

export namespace ActivityService {
  export const create = wrapRequest(async (params: CreateActivities) => {
    const { data } = await api.post<{ activityId: string }>(
      `/trips/${params.tripId}/activities`,
      { occurs_at: params.occursAt, title: params.title },
    );

    return data;
  });

  export const getActivitiesByTripId = wrapRequest(async (tripId: string) => {
    const { data } = await api.get<ActivityResponseRaw>(
      `/trips/${tripId}/activities`,
    );

    return objectToCamel(data.activities);
  });
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackRoutes } from './routes';

export type RootStackParams = {
  [RootStackRoutes.NewTrip]: undefined;
  [RootStackRoutes.TripDetails]: { tripId: string };
  [RootStackRoutes.TripList]: undefined;
};

export type RootStackScreen<Route extends keyof RootStackParams = any> =
  React.FC<NativeStackScreenProps<RootStackParams, Route>>;

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackRoutes } from './routes';

export type RootStackParams = {
  [RootStackRoutes.Home]: undefined;
};

export type RootStackScreen<Route extends keyof RootStackParams = any> =
  React.FC<NativeStackScreenProps<RootStackParams, Route>>;

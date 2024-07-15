import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NewTripScreen } from '@/modules/planner/screens/new-trip';
import { TripDetailsScreen } from '@/modules/planner/screens/trip-details';
import { TripListScreen } from '@/modules/planner/screens/trips-list';
import { colors } from '@/styles/colors';

import { RootStackParams } from './params';
import { RootStackRoutes } from './routes';

const RootStack = createNativeStackNavigator<RootStackParams>();

export const RootStackNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.zinc[950],
        },
      }}
      initialRouteName={RootStackRoutes.TripList}
    >
      <RootStack.Screen
        name={RootStackRoutes.NewTrip}
        component={NewTripScreen}
      />
      <RootStack.Screen
        name={RootStackRoutes.TripDetails}
        component={TripDetailsScreen}
      />
      <RootStack.Screen
        name={RootStackRoutes.TripList}
        component={TripListScreen}
      />
    </RootStack.Navigator>
  );
};

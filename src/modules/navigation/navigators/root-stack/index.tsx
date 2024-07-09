import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/modules/planner/screens/home';
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
    >
      <RootStack.Screen name={RootStackRoutes.Home} component={HomeScreen} />
    </RootStack.Navigator>
  );
};
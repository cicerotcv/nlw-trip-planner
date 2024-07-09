import { NavigationContainer } from '@react-navigation/native';

import { RootStackNavigator } from './navigators/root-stack';

type Props = {
  onReady: () => void;
};
export const NavigationRoutes: React.FC<Props> = (props) => {
  return (
    <NavigationContainer onReady={props.onReady}>
      <RootStackNavigator />
    </NavigationContainer>
  );
};

import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Splash from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { Loading } from '@/components/loading';
import { useFontsLoaded } from '@/hooks/fonts-loaded';
import { NavigationRoutes } from '@/modules/navigation';
import '@/styles/global.css';

Splash.preventAutoHideAsync();

export default function App() {
  const isFontsLoaded = useFontsLoaded();

  if (!isFontsLoaded) return <Loading />;

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationRoutes onReady={Splash.hideAsync} />
      <StatusBar translucent style="light" backgroundColor="transparent" />
    </SafeAreaProvider>
  );
}

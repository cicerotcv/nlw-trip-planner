import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Splash from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Loading } from '@/components/loading';
import { useFontsLoaded } from '@/hooks/fonts-loaded';
import { NavigationRoutes } from '@/modules/navigation';
import '@/styles/global.css';
import '@/utils/daysjs-locale-config';

const queryClient = new QueryClient();

Splash.preventAutoHideAsync();

export default function App() {
  const isFontsLoaded = useFontsLoaded();

  if (!isFontsLoaded) return <Loading />;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <NavigationRoutes onReady={Splash.hideAsync} />
        <StatusBar translucent style="light" backgroundColor="transparent" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

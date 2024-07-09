import { Image, Text, View } from 'react-native';

import SvgLogo from '@/assets/app/logo.svg';
import { RootStackScreen } from '@/modules/navigation/navigators/root-stack/params';
import { colors } from '@/styles/colors';

export const HomeScreen: RootStackScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <SvgLogo color={colors.zinc[100]} height={32} />
      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{'\n'}
        próxima viagem
      </Text>
    </View>
  );
};

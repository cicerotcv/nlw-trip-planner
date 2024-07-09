import {
  ArrowRight,
  Calendar as IconCalendar,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native';

import { useState } from 'react';
import { Text, View } from 'react-native';

import SvgLogo from '@/assets/app/logo.svg';
import { Button } from '@/components/buttons';
import { Input } from '@/components/input';
import { RootStackScreen } from '@/modules/navigation/navigators/root-stack/params';
import { colors } from '@/styles/colors';

const FormSteps = {
  TripDetails: 1,
  AddEmail: 2,
} as const;

export const HomeScreen: RootStackScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<
    (typeof FormSteps)[keyof typeof FormSteps]
  >(FormSteps.TripDetails);

  const handleNextFormStep = () => {
    if (currentStep === FormSteps.TripDetails) {
      setCurrentStep(FormSteps.AddEmail);
      return;
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-5">
      <SvgLogo color={colors.zinc[100]} height={32} />
      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{'\n'}
        próxima viagem
      </Text>

      <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800 px-5">
        <Input variant="primary">
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={currentStep === FormSteps.TripDetails}
          />
        </Input>

        <Input variant="primary">
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={currentStep === FormSteps.TripDetails}
          />
        </Input>

        {currentStep === FormSteps.AddEmail && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button
                variant="secondary"
                onPress={() => setCurrentStep(FormSteps.TripDetails)}
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field placeholder="Quem estará na viagem?" />
            </Input>
          </>
        )}

        <Button onPress={handleNextFormStep}>
          <Button.Title>
            {currentStep === FormSteps.TripDetails
              ? 'Continuar'
              : 'Confirmar viagem'}
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planejar sua viagem pela plann.er você concorda com nossos{' '}
        <Text className="text-zinc-300 underline">
          termos de uso e políticas de privacidade.
        </Text>
      </Text>
    </View>
  );
};

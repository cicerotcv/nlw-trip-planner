import dayjs from 'dayjs';
import {
  ArrowRight,
  AtSign,
  Calendar as IconCalendar,
  MapPin,
  Settings2,
  UserRoundPlus,
} from 'lucide-react-native';

import { useState } from 'react';
import { Alert, Keyboard, Text, View } from 'react-native';
import { DateData } from 'react-native-calendars';

import { useMutation } from '@tanstack/react-query';

import SvgLogo from '@/assets/app/logo.svg';
import { Button } from '@/components/buttons';
import { Calendar } from '@/components/calendar';
import { GuestEmail } from '@/components/email';
import { Input } from '@/components/input';
import { Modal } from '@/components/modal';
import { RootStackScreen } from '@/modules/navigation/navigators/root-stack/params';
import { RootStackRoutes } from '@/modules/navigation/navigators/root-stack/routes';
import { colors } from '@/styles/colors';
import { DatesSelected, calendarUtils } from '@/utils/calendar-utils';
import { validateInput } from '@/utils/validate-input';

import { tripDetailsSchema } from '../../schemas/trip';
import { TripService } from '../../services/trip';
import { useTripActions } from '../../store/trip';

enum FORM {
  TRIP_DETAILS = 1,
  ADD_GUEST = 2,
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

export const NewTripScreen: RootStackScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(FORM.TRIP_DETAILS);
  const [modalState, setModalState] = useState(MODAL.NONE);

  //! refactor: use react-hook-form
  const [tripDetailErrors, setTripDetailErrors] = useState<
    Record<string, string[]>
  >({});

  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [destination, setDestination] = useState<string>();
  const [emailToInvite, setEmailToInvite] = useState<string>('');
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);
  const tripActions = useTripActions();

  const handleNextFormStep = async () => {
    const areTripDetailsValid = await tripDetailsValidation(
      destination,
      selectedDates,
    );

    if (!areTripDetailsValid) return;

    if (currentStep === FORM.TRIP_DETAILS) {
      setCurrentStep(FORM.ADD_GUEST);
      return;
    }

    Alert.alert('Confirmação', 'Deseja confirmar a viagem?', [
      {
        style: 'cancel',
        text: 'Não',
      },
      {
        style: 'default',
        text: 'Sim',
        onPress: handleSubmit,
      },
    ]);
  };

  const tripDetailsValidation = async (
    destination?: string,
    dates?: DatesSelected,
  ) => {
    const { error: tripDetailsErrors, success } =
      await tripDetailsSchema.safeParseAsync({
        destination,
        dates: {
          startsAt: dates?.startsAt?.dateString,
          endsAt: dates?.endsAt?.dateString,
        },
      });

    setTripDetailErrors(tripDetailsErrors?.formErrors?.fieldErrors ?? {});

    return success;
  };

  const handleSelectDate = (selectedDay: DateData) => {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      selectedDay: selectedDay,
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
    });

    setSelectedDates(dates);
  };

  const handleRemoveEmail = (email: string) => {
    setEmailsToInvite((prev) => prev.filter((e) => e !== email));
  };

  const handleAddEmail = () => {
    const email = emailToInvite.trim();

    if (!validateInput.email(email))
      return Alert.alert('Convidado', 'E-mail inválido');

    if (emailsToInvite.includes(emailToInvite))
      return Alert.alert('Convidado', 'E-mail já adicionado');

    setEmailsToInvite((prev) => [...prev, emailToInvite]);
    setEmailToInvite('');
  };

  const { mutateAsync: createTrip, isPending: isCreating } = useMutation({
    mutationKey: ['create-trip'],
    mutationFn: TripService.create,
    onSuccess: ({ tripId }) => {
      Alert.alert('Sucesso', 'Viagem criada com sucesso!', [
        {
          text: 'Ok',
          onPress: () => {
            tripActions.addTrip(tripId);
            navigation.navigate(RootStackRoutes.TripDetails, { tripId });
          },
        },
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () =>
    createTrip({
      destination: destination!,
      startsAt: dayjs(selectedDates.startsAt!.dateString).toISOString(),
      endsAt: dayjs(selectedDates.endsAt!.dateString).toISOString(),
      emailsToInvite: emailsToInvite!,
    });

  return (
    <View className="flex-1 items-center justify-center px-5">
      <SvgLogo color={colors.zinc[100]} height={32} />
      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{'\n'}
        próxima viagem
      </Text>

      <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800 px-5 gap-4">
        <Input variant="primary" error={tripDetailErrors?.destination?.at(0)}>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={currentStep === FORM.TRIP_DETAILS}
            onChangeText={setDestination}
            value={destination}
            defaultValue="São Paulo"
          />
        </Input>

        <Input variant="primary" error={tripDetailErrors?.dates?.at(0)}>
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={currentStep === FORM.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() => {
              if (currentStep === FORM.TRIP_DETAILS)
                setModalState(MODAL.CALENDAR);
            }}
            value={selectedDates.formatDatesInText}
          />
        </Input>

        {currentStep === FORM.ADD_GUEST && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button
                variant="secondary"
                onPress={() => setCurrentStep(FORM.TRIP_DETAILS)}
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  !!emailsToInvite.length
                    ? `${emailsToInvite.length} pessoa(s) convidada(s).`
                    : ''
                }
                onPress={() => {
                  if (currentStep === FORM.ADD_GUEST)
                    setModalState(MODAL.GUESTS);
                }}
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}

        <Button onPress={handleNextFormStep} loading={isCreating}>
          <Button.Title>
            {currentStep === FORM.TRIP_DETAILS
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

      <Modal
        title="Selecionar datas"
        subtitle="Escolha a data de início e fim da viagem"
        visible={MODAL.CALENDAR === modalState}
        onClose={() => setModalState(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectDate}
            markedDates={selectedDates.dates}
          />

          <Button
            onPress={() => {
              tripDetailsValidation(destination, selectedDates);
              setModalState(MODAL.NONE);
            }}
          >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={modalState === MODAL.GUESTS}
        onClose={() => setModalState(MODAL.NONE)}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
          {!!emailsToInvite.length ? (
            emailsToInvite.map((email) => (
              <GuestEmail
                key={email}
                onRemove={() => handleRemoveEmail(email)}
                email={email}
              />
            ))
          ) : (
            <Text className="text-zinc-500 text-base font-regular">
              Nenhum e-mail adicionado
            </Text>
          )}
        </View>

        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Adicionar e-mail"
              keyboardType="email-address"
              defaultValue="teste2@email.com"
              onChangeText={setEmailToInvite}
              value={emailToInvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
              autoCapitalize="none"
            />
          </Input>

          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
};

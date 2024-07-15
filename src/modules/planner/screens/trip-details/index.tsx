import dayjs from 'dayjs';
import {
  Calendar as CalendarIcon,
  CalendarRange,
  Info,
  MapPin,
  Settings2,
} from 'lucide-react-native';

import { useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';

import { useMutation, useQuery } from '@tanstack/react-query';

import { Button } from '@/components/buttons';
import { Calendar } from '@/components/calendar';
import { Input } from '@/components/input';
import { Loading } from '@/components/loading';
import { Modal } from '@/components/modal';
import { RootStackScreen } from '@/modules/navigation/navigators/root-stack/params';
import { RootStackRoutes } from '@/modules/navigation/navigators/root-stack/routes';
import { colors } from '@/styles/colors';
import { DatesSelected, calendarUtils } from '@/utils/calendar-utils';

import { TripDetails, TripService } from '../../services/trip';
import { TripActivities } from './activities';
import { TripDetails as DetailsSection } from './details';

const formatTripDetails = (tripDetails: TripDetails) => {
  const maxLengthDestination = 14;
  const destination =
    tripDetails.destination.length > maxLengthDestination
      ? `${tripDetails.destination.slice(0, maxLengthDestination)}...`
      : tripDetails.destination;

  const startMonth = dayjs(tripDetails.startsAt).format('MMM');
  const endMonth = dayjs(tripDetails.endsAt).format('MMM');

  const startsAt = dayjs(tripDetails.startsAt).format(
    startMonth === endMonth ? 'DD' : 'DD [de] MMM',
  );
  const endsAt = dayjs(tripDetails.endsAt).format('DD [de] MMMM');

  return {
    ...tripDetails,
    when: `${destination} de ${startsAt} a ${endsAt}`,
  };
};

enum MODAL {
  UPDATE_TRIP = 'UPDATE_TRIP',
  NONE = 'NONE',
  CALENDAR = 'CALENDAR',
}

export const TripDetailsScreen: RootStackScreen<
  typeof RootStackRoutes.TripDetails
> = ({ route }) => {
  // params
  const { tripId } = route.params;

  // states
  const [option, setOption] = useState<'activities' | 'details'>('activities');
  const [modalState, setModalState] = useState<MODAL>(MODAL.NONE);
  const [destination, setDestination] = useState('');
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);

  // queries
  const tripQuery = useQuery({
    queryKey: ['trip-details', tripId],
    queryFn: async () => {
      const data = await TripService.getById(tripId);
      return formatTripDetails(data);
    },
    enabled: !!tripId,
  });
  const tripDetails = tripQuery.data!;

  useLayoutEffect(() => {
    if (!tripDetails) return;

    setDestination(tripDetails.destination);
  }, [tripDetails]);

  const handleSelectDate = (selectedDay: DateData) => {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      selectedDay: selectedDay,
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
    });

    setSelectedDates(dates);
  };

  const { mutateAsync: updateTrip, isPending: isUpdating } = useMutation({
    mutationKey: ['update-trip', tripId],
    mutationFn: TripService.update,
    onSuccess: () => {
      Alert.alert('Atualizar viagem', 'Viagem atualizada com sucesso.', [
        {
          text: 'Ok',
          onPress: () => {
            setModalState(MODAL.NONE);
            tripQuery.refetch();
          },
        },
      ]);
    },
    onError: () => {},
  });

  const handleUpdateTrip = async () => {
    if (!tripId) return;

    if (!destination || !selectedDates.startsAt || !selectedDates.endsAt)
      return Alert.alert('Atualizar viagem', 'Preencha todos os campos.');

    updateTrip({
      id: tripId,
      destination,
      startsAt: dayjs(selectedDates.startsAt.dateString).toISOString(),
      endsAt: dayjs(selectedDates.endsAt.dateString).toISOString(),
    });
  };

  if (tripQuery.isLoading) return <Loading />;

  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />

        <Input.Field value={tripDetails.when} readOnly />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalState(MODAL.UPDATE_TRIP)}
          className="w-9 h-9 bg-zinc-800 items-center justify-center rounded"
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {option === 'activities' ? (
        <TripActivities details={tripDetails} />
      ) : (
        <DetailsSection id={tripId} />
      )}

      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">
          <Button
            className="flex-1"
            variant={option === 'activities' ? 'primary' : 'secondary'}
            onPress={() => setOption('activities')}
          >
            <CalendarRange
              color={
                option === 'activities' ? colors.lime[950] : colors.zinc[200]
              }
              size={20}
            />
            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            className="flex-1"
            variant={option === 'details' ? 'primary' : 'secondary'}
            onPress={() => setOption('details')}
          >
            <Info
              color={option === 'details' ? colors.lime[950] : colors.zinc[200]}
              size={20}
            />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou a viagem pode editar."
        visible={modalState === MODAL.UPDATE_TRIP}
        onClose={() => setModalState(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <CalendarIcon color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Quando?"
              value={selectedDates.formatDatesInText}
              onPressIn={() => setModalState(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
              showSoftInputOnFocus={false}
            />
          </Input>
        </View>

        <Button loading={isUpdating} onPress={handleUpdateTrip}>
          <Button.Title>Atualizar</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Escolha a data de início e fim da viagem"
        visible={modalState === MODAL.CALENDAR}
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
              setModalState(MODAL.UPDATE_TRIP);
            }}
          >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
};

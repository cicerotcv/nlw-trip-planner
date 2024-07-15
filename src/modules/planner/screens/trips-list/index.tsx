import dayjs from 'dayjs';
import { ChevronRight, Plus } from 'lucide-react-native';

import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useQueries } from '@tanstack/react-query';

import { Button } from '@/components/buttons';
import { RootStackScreen } from '@/modules/navigation/navigators/root-stack/params';
import { RootStackRoutes } from '@/modules/navigation/navigators/root-stack/routes';
import { colors } from '@/styles/colors';

import { TripDetails, TripService } from '../../services/trip';
import { useTripIds } from '../../store/trip';

const formatTrip = (trip: TripDetails | undefined) => {
  if (!trip) return null;

  const startDate = dayjs(trip.startsAt).date();
  const startMonth = dayjs(trip.startsAt).format('MMMM');
  const endDate = dayjs(trip.endsAt).date();
  const endMonth = dayjs(trip.endsAt).format('MMMM');

  const dates =
    startMonth === endMonth
      ? `${startDate} a ${endDate} de ${startMonth}`
      : `${startDate} de ${startMonth} - ${endDate} de ${endMonth}`;

  return {
    id: trip.id,
    name: trip.destination,
    startDate: trip.startsAt,
    endDate: trip.endsAt,
    dates: dates,
  };
};

export const TripListScreen: RootStackScreen = ({ navigation }) => {
  const tripIdList = useTripIds();

  const trips = useQueries({
    queries: tripIdList.map((tripId) => ({
      queryKey: ['trip-details', tripId],
      queryFn: () => TripService.getById(tripId),
    })),
    combine: (data) => data.map((trip) => formatTrip(trip.data)),
  });

  return (
    <View className="flex-1 px-5 pt-16">
      <View className="py-4 flex-row justify-between items-center gap-2">
        <Text className="text-zinc-100 text-2xl font-semibold flex-1">
          Suas viagens
        </Text>

        <Button onPress={() => navigation.navigate(RootStackRoutes.NewTrip)}>
          <Plus size={20} color={colors.lime[950]} />
          <Button.Title>Nova viagem</Button.Title>
        </Button>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(trip, index) => trip?.id ?? `error-${index}`}
        contentContainerClassName="gap-4 my-4"
        renderItem={({ item: trip }) => (
          <TouchableOpacity
            className="flex-row items-center justify-between gap-2 rounded-lg border border-zinc-800 px-4 py-2 bg-zinc-900"
            activeOpacity={0.8}
            onPress={() => {
              if (!trip?.id) return;

              navigation.navigate(RootStackRoutes.TripDetails, {
                tripId: trip?.id,
              });
            }}
          >
            <View className="">
              <Text className="text-zinc-100 text-lg font-semibold">
                {trip?.name}
              </Text>

              <Text className="text-zinc-400 text-base">{trip?.dates}</Text>
            </View>

            <ChevronRight size={20} color={colors.zinc[400]} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

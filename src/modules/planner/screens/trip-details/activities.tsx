import dayjs from 'dayjs';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusIcon,
  Tag,
} from 'lucide-react-native';

import { useMemo, useState } from 'react';
import { Alert, Keyboard, SectionList, Text, View } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Activity } from '@/components/activity';
import { Button } from '@/components/buttons';
import { Calendar } from '@/components/calendar';
import { Input } from '@/components/input';
import { Loading } from '@/components/loading';
import { Modal } from '@/components/modal';
import { colors } from '@/styles/colors';

import { ActivitiesResponse, ActivityService } from '../../services/activities';
import { TripDetails } from '../../services/trip';

const formatToSectionList = (scheduleByDate: ActivitiesResponse) =>
  scheduleByDate.map((schedule) => ({
    title: {
      dayNumber: dayjs(schedule.date).date(),
      dayName: dayjs(schedule.date).format('dddd').replace('-feira', ''),
    },
    data: schedule.activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      hour: dayjs(activity.occursAt).format('HH[:]mm  [h]'),
      isBefore: dayjs().isAfter(dayjs(activity.occursAt)),
    })),
  }));

enum MODAL {
  NONE = 'NONE',
  CALENDAR = 'CALENDAR',
  NEW_ACTIVITY = 'NEW_ACTIVITY',
}

type Props = {
  details: TripDetails;
};
export const TripActivities: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useState(MODAL.NONE);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDate, setActivityDate] = useState<string>('');
  const [activityHour, setActivityHour] = useState('');

  const activitiesQuery = useQuery({
    queryKey: ['activities', props.details.id],
    queryFn: () => ActivityService.getActivitiesByTripId(props.details.id),
    enabled: !!props.details.id,
  });

  const activities = useMemo(() => {
    if (!activitiesQuery.data) return [];

    return formatToSectionList(activitiesQuery.data);
  }, [activitiesQuery.data]);

  const { mutateAsync: createActivity, isPending: isCreatingActivity } =
    useMutation({
      mutationKey: ['create-activity', props.details.id],
      mutationFn: ActivityService.create,
      onSuccess: async () =>
        Alert.alert('Criar atividade', 'Atividade criada com sucesso', [
          {
            text: 'OK',
            onPress: () => {
              setModalState(MODAL.NONE);
              resetNewActivityField();
              queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes('activities'),
              });
            },
          },
        ]),
      onError: (error) => {
        Alert.alert('Erro', error.message);
      },
    });

  const resetNewActivityField = () => {
    setActivityTitle('');
    setActivityDate('');
    setActivityHour('');
  };

  const handleCreateActivity = async () => {
    if (!activityTitle || !activityDate || !activityHour)
      return Alert.alert('Criar atividade', 'Preencha todos os campos');

    await createActivity({
      title: activityTitle,
      occursAt: dayjs(activityDate)
        .add(Number(activityHour), 'hour')
        .toString(),
      tripId: props.details.id,
    });
  };

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="text-zinc-100 text-2xl font-semibold flex-1">
          Atividades
        </Text>

        <Button onPress={() => setModalState(MODAL.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} size={20} />
          <Button.Title>Nova atividade</Button.Title>
        </Button>
      </View>

      {activitiesQuery.isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Activity data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-48"
          renderSectionHeader={({ section }) => (
            <View className="w-full">
              <Text className="text-zinc-100 text-2xl font-semibold py-2">
                Dia {section.title.dayNumber}{' '}
                <Text className="text-zinc-500 text-base font-regular capitalize">
                  {section.title.dayName}
                </Text>
              </Text>

              {section.data.length === 0 && (
                <Text className="text-zinc-500 font-regular text-sm">
                  Nenhuma atividade para este dia.
                </Text>
              )}
            </View>
          )}
        />
      )}

      <Modal
        title="Nova atividade"
        subtitle="Todos os convidados podem visualizar as atividades."
        visible={modalState === MODAL.NEW_ACTIVITY}
        onClose={() => setModalState(MODAL.NONE)}
      >
        <View className="mb-3 mt-4">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <CalendarIcon color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                onChangeText={(text) =>
                  setActivityHour(text.replace(/\D/g, ''))
                }
                value={
                  activityDate ? dayjs(activityDate).format('DD [de] MMMM') : ''
                }
                onPress={() => {
                  setModalState(MODAL.CALENDAR);
                }}
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário?"
                onChangeText={(text) =>
                  setActivityHour(text.replace(/\D/g, ''))
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={2}
              />
            </Input>
          </View>
        </View>

        <Button onPress={handleCreateActivity} loading={isCreatingActivity}>
          <Button.Title>Criar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Escolha a data da atividade"
        visible={modalState === MODAL.CALENDAR}
        onClose={() => setModalState(MODAL.NEW_ACTIVITY)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={props.details.startsAt}
            maxDate={props.details.endsAt}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={props.details.startsAt}
            onDayPress={(date) => {
              setActivityDate(date.dateString);
              setModalState(MODAL.NEW_ACTIVITY);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

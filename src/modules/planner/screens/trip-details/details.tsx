import { Plus } from 'lucide-react-native';

import { useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/buttons';
import { Input } from '@/components/input';
import { Loading } from '@/components/loading';
import { Modal } from '@/components/modal';
import { Participant } from '@/components/participant';
import { TripLink } from '@/components/trip-link';
import { colors } from '@/styles/colors';

import { LinkService } from '../../services/links';
import { ParticipantService } from '../../services/participants';

enum MODAL {
  NEW_LINK = 'NEW_LINK',
  NONE = 'NONE',
}

type Props = {
  id: string;
};

export const TripDetails: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState(MODAL.NONE);

  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const { mutateAsync: createLink, isPending: isCreatingLink } = useMutation({
    mutationKey: ['links', props.id],
    mutationFn: LinkService.create,
    onSuccess: async () =>
      Alert.alert('Link cadastrado', 'Link cadastrado com sucesso', [
        {
          text: 'OK',
          onPress: () => {
            setModalState(MODAL.NONE);
            handleResetFields();
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey.includes('links'),
            });
          },
        },
      ]),
    onError: () => {},
  });

  const linksQuery = useQuery({
    queryKey: ['links', props.id],
    queryFn: () => LinkService.getLinksByTripId(props.id),
    enabled: !!props.id,
  });

  const participantsQuery = useQuery({
    queryKey: ['participants', props.id],
    queryFn: () => ParticipantService.getByTripId(props.id),
    enabled: !!props.id,
  });

  const handleResetFields = () => {
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleCreateLink = async () => {
    if (!linkTitle.trim() || !linkUrl.trim())
      return Alert.alert('Cadastrar link', 'Preencha todos os campos');

    await createLink({ tripId: props.id, title: linkTitle, url: linkUrl });
  };

  return (
    <View className="flex-1 mt-5">
      <Text className="text-zinc-100 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1">
        {linksQuery.isLoading ? (
          <Loading />
        ) : linksQuery.data?.length ? (
          <FlatList
            data={linksQuery.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link cadastrado. Clique no botão abaixo para adicionar um
            novo link.
          </Text>
        )}

        <Button
          variant="secondary"
          onPress={() => setModalState(MODAL.NEW_LINK)}
        >
          <Plus color={colors.zinc[200]} size={20} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="w-full border-t border-zinc-800 h-0 my-4" />

      <View className="flex-1">
        <Text className="text-zinc-100 text-2xl font-semibold mb-6">
          Convidados
        </Text>

        {participantsQuery.isLoading ? (
          <Loading />
        ) : !!participantsQuery.data?.length ? (
          <FlatList
            data={participantsQuery.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Participant data={item} />}
            contentContainerClassName="gap-4 pb-44"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link cadastrado. Clique no botão abaixo para adicionar um
            novo link.
          </Text>
        )}
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Adicione um link para a viagem. Todos os convidados podem visualizar os links importantes."
        visible={modalState === MODAL.NEW_LINK}
        onClose={() => setModalState(MODAL.NONE)}
      >
        <View className="py-4 gap-2">
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link"
              onChangeText={setLinkTitle}
              value={linkTitle}
            />
          </Input>

          <Input variant="secondary">
            <Input.Field
              placeholder="URL do link"
              onChangeText={setLinkUrl}
              value={linkUrl}
            />
          </Input>
        </View>

        <Button
          variant="primary"
          onPress={handleCreateLink}
          loading={isCreatingLink}
        >
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
};

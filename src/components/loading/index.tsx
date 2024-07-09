import { ActivityIndicator } from 'react-native';

export const Loading = () => {
  return (
    <ActivityIndicator
      className="flex-1 bg-zinc-950 justify-center items-center text-lime-300"
      size={24}
    />
  );
};

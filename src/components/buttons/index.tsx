import clsx from 'clsx';

import { createContext, useContext } from 'react';
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary';

type ButtonProps = TouchableOpacityProps & {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: Variant;
};

const ButtonContext = createContext<{ variant?: Variant }>({});

export const Button = ({
  children,
  variant = 'primary',
  loading,
  className,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={clsx(
        'h-11 flex-row items-center justify-center rounded-lg gap-2 px-2',
        {
          'bg-lime-300': variant === 'primary',
          'bg-zinc-800': variant === 'secondary',
        },
        className,
      )}
      disabled={loading}
      activeOpacity={0.8}
      {...props}
    >
      <ButtonContext.Provider value={{ variant }}>
        {loading ? <ActivityIndicator className="text-lime-950" /> : children}
      </ButtonContext.Provider>
    </TouchableOpacity>
  );
};

type TitleProps = TextProps & {
  children?: React.ReactNode;
};
const Title = ({ children, className, ...props }: TitleProps) => {
  const { variant } = useContext(ButtonContext);

  return (
    <Text
      className={clsx(
        'text-base font-semibold',
        {
          'text-lime-950': variant === 'primary',
          'text-zinc-200': variant === 'secondary',
        },
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
};

Button.Title = Title;

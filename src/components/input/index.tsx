import clsx from 'clsx';

import { Platform, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@/styles/colors';

type Variants = 'primary' | 'secondary' | 'tertiary';

type InputProps = {
  children?: React.ReactNode;
  variant?: Variants;
};

const Input = ({ variant = 'primary', children }: InputProps) => {
  return (
    <View
      className={clsx('w-full h-16 flex-row items-center gap-2', {
        'h-14 px-4 rounded-lg border border-zinc-800': variant !== 'primary',
        'bg-zinc-950': variant === 'secondary',
        'bg-zinc-900': variant === 'tertiary',
      })}
    >
      {children}
    </View>
  );
};
type FieldProps = TextInputProps & {};

const Field: React.FC<FieldProps> = ({ className, ...props }) => {
  return (
    <TextInput
      className={clsx('flex-1 text-zinc-100 font-regular text-lg', className)}
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[100]}
      selectionColor={Platform.OS === 'ios' ? colors.zinc[100] : undefined}
      {...props}
    />
  );
};

Input.Field = Field;

export { Input };

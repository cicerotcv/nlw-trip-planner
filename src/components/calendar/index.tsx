import {
  CalendarProps,
  LocaleConfig,
  Calendar as RNCalendar,
} from 'react-native-calendars';

import { colors } from '@/styles/colors';
import { fonts } from '@/styles/fonts';
import { ptBR } from '@/utils/locale-calendar-config';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

export function Calendar({ ...rest }: CalendarProps) {
  return (
    <RNCalendar
      hideExtraDays
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
      theme={{
        textMonthFontSize: 18,
        selectedDayBackgroundColor: colors.lime[300],
        selectedDayTextColor: colors.zinc[900],
        textDayFontFamily: fonts.regular,
        monthTextColor: colors.zinc[200],
        arrowColor: colors.zinc[400],
        agendaDayNumColor: colors.zinc[200],
        todayTextColor: colors.lime[300],
        textDisabledColor: colors.zinc[500],
        calendarBackground: 'transparent',
        textDayStyle: { color: colors.zinc[200] },
      }}
      {...rest}
    />
  );
}

import { useLocaleState } from 'react-admin';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const RelativeDate = ({ date, ...rest }) => {
  const [locale] = useLocaleState();
  return (
    <Typography title={dayjs(date).locale(locale).format('LLL')} {...rest}>
      {dayjs().locale(locale).from(dayjs(date), true)}
    </Typography>
  );
};

export default RelativeDate;

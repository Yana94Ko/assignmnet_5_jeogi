import * as dayjs from 'dayjs';
import * as locale from 'dayjs/locale/ko';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(locale);
dayjs.tz.setDefault('Asia/Seoul');

export default function day(...args: Parameters<typeof dayjs>) {
  return dayjs(...args);
}

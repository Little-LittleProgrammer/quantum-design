/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, {Dayjs} from 'dayjs';
import {dateFormat} from '@wuefront/shared/enums';
import 'dayjs/locale/zh-cn';

const DATE_TIME_FORMAT = dateFormat.dateTime;
const DATE_FORMAT = dateFormat.date;

export function format_to_date_time(
    date: dayjs.Dayjs |undefined = undefined,
    format = DATE_TIME_FORMAT
): string {
    return dayjs(date).format(format);
}

export function format_to_date(date: dayjs.Dayjs |undefined = undefined, format = DATE_FORMAT): string {
    return dayjs(date).format(format);
}

export const date_util = dayjs;

export {Dayjs}
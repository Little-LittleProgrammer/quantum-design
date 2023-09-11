/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, {Dayjs} from 'dayjs';
import {gDateFormatEnum} from '@quantum-design/shared/enums';

const DATE_TIME_FORMAT = gDateFormatEnum.dateTime;
const DATE_FORMAT = gDateFormatEnum.date;

export function js_utils_format_date_time(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
    return dayjs(date).format(format);
}

export function js_utils_format_date(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
    return dayjs(date).format(format);
}

export const gDateUtil = dayjs;

export { Dayjs };

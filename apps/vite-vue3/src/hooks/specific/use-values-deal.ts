import { isNumber } from '@qmfront/utils';

enum specificDealEnums {
    second_price_ratio,
    discount
}

type Enum = keyof typeof specificDealEnums

export function get_format_decimals_values<T extends Partial<Record<Enum, number>>>(values: T):T {
    for (const key in specificDealEnums) {
        if (values[key as Enum] && isNumber(values[key as Enum])) {
            values[key as Enum]! /= 10000;
        }
    }
    return values;
}

export function set_format_decimals_values<T extends Partial<Record<Enum, number>>>(values: T):T {
    for (const key in specificDealEnums) {
        if (values[key as Enum] && isNumber(values[key as Enum])) {
            values[key as Enum]! *= 10000;
        }
    }
    return values;
}

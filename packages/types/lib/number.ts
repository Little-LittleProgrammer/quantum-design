import type { GetTuple, Pop } from './array';
import type { CheckLeftIsExtendsRight, Not, Or } from './common';
import type { Stringify } from './string';

/**
 *  数字判断
 */
type NumberLike = number | `${number}`

/**
 * number 等于 0
 */
type IsZero<N extends NumberLike> = CheckLeftIsExtendsRight<N, 0 | '0'>

/**
 * number 是否大于0
 */
type IsOverZero<N extends NumberLike> = IsZero<N> extends true ? false: CheckLeftIsExtendsRight<Stringify<N> extends `${'-'}${infer Rest}` ? Rest : never, never>

/**
 * number 是否小于
 */
type IsLessZero<N extends NumberLike> = Not<IsOverZero<N>>

/**
 * 两个number类型是否相等
 * @example
 * type Result = IsEqual<1, 1> // true
 */
type IsEqual<
    L extends NumberLike,
    R extends NumberLike,
    Strict extends boolean = true
> = Strict extends true
    ? CheckLeftIsExtendsRight<L, R>
    : CheckLeftIsExtendsRight<Stringify<L>, Stringify<R>>

/**
 * 两个number类型是否不相等
 * @example
 * type Result = IsNotEqual<1, 2> // true
 */
type IsNotEqual<
    L extends NumberLike,
    R extends NumberLike,
    Strict extends boolean = true
> = Not<IsEqual<L, R, Strict>>

type IntAddSingleHelper<N1 extends number, N2 extends number> = [
    ...GetTuple<N1>,
    ...GetTuple<N2>
]['length']

/**
 *  整数相加
 */
type IntAddSingle<N1 extends number, N2 extends number> = IntAddSingleHelper<N1, N2> extends number ? IntAddSingleHelper<N1, N2>: number

/**
 * 数字大小比较
*/
type Compare<N1 extends number, N2 extends number> = CompareHelper<N1, N2>;

type CompareHelper<
    N1 extends number,
    N2 extends number,
    T1 extends unknown[] = GetTuple<N1>,
    T2 extends unknown[] = GetTuple<N2>>
= IsNotEqual<N1, N2, true> extends true
    ? Or<IsZero<T1['length']>, IsZero<T2['length']>> extends true
        ? IsZero<T1['length']> extends true
            ? false
            : true
        : CompareHelper<Pop<T1>['length'], Pop<T2>['length']>
    : false

/**
 * 减法实现
 */
type IntMinusSingleAbsHelper<
    N1 extends number,
    N2 extends number,
    T1 extends unknown[] = GetTuple<N1>,
    T2 extends unknown[] = GetTuple<N2>>
= IsNotEqual<N1, N2, true> extends true
    ? Or<IsZero<T1['length']>, IsZero<T2['length']>> extends true
        ? IsZero<T1['length']> extends true
            ? T2['length']
            : T1['length']
        : CompareHelper<Pop<T1>['length'], Pop<T2>['length']>
    : 0

export {
    NumberLike,
    IsZero,
    IsOverZero,
    IsLessZero,
    // IsFloat,
    // IsInt,
    IsEqual,
    IsNotEqual,
    // IntIncrease,
    // IntAddSimple,
    // IntMinusSingleAbs,
    Compare,
    // GetHalf,
    // ToNumber,
    // Add,
    // ParseFloat
    IntAddSingle
};

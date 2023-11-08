import { And, CheckLeftIsExtendsRight, IsEqual, Not, Or } from './common';
import { IntAddSingle } from './number';
import {CanStringified} from './string';

/**
 * 构造长度为 Length 的元祖
 */
type GetTuple<Length extends number = 0> = GetTupleHelp<Length>

type GetTupleHelp<Length extends number = 0, R extends unknown[] = []> = R['length'] extends Length ? R : GetTupleHelp<Length, [...R, unknown]>

/**
 * 更改元组中指定索引位的类型
 * @example
 * type Result = ArraySet<[1, 2, 3], 2, 4> // [1, 2, 4]
 */
type ArraySet<T extends unknown[], Index extends number, Value> = SetHelper<T, Index, Value>

type SetHelper<T extends unknown[], Index extends number, Value, Offset extends number = 0, Cache extends unknown[] = []>
= Offset extends T['length'] ? Cache : SetHelper<T, Index, Value, IntAddSingle<Offset, 1>, Push<Cache, Offset extends Index ? Value : T[Offset]>>

/**
 * 从元（数）组类型构造联合类型
 * @example
 * type Result = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3
 */
type TupleToUnion<T extends unknown[]> = T[number]

/**
 * 去掉数组的最后一位
 */
type Pop<T extends unknown[]> = T extends [...infer Left, infer Right] ? Left : never

/**
 * 去掉数组的第一位
 * @example
 * type Result = Shift<[1, 2, 3]> // [2, 3]
 */
type Shift<T extends unknown[]> = T extends [infer First, ... infer RightRest] ? RightRest : never

/**
 * 在元组前面插入一位
 * @example
 * type Result = UnShift<[1, 2, 3], 0> // [0, 1, 2, 3]
 */
type UnShift<T extends unknown[], Item> = [Item, ... T];

type Push<T extends unknown[], Str> = [...T, Str]

/**
 * 合并两个元组类型
 * @example
 * type Result = Concat<[1, 2, 3], [4]> // [1, 2, 3, 4]
 */
type Concat<T extends unknown[], R extends unknown[]> = [...T, ...R]

/**
 * 将元组类型拼接成字符串类型
 * @example
 * type Result = Join<[1, 2, 3], ','> // "1,2,3"
 */
type Join<
    T extends CanStringified[],
    SplitStr extends CanStringified = ''
> = T['length'] extends 0
    ? ''
    : T extends [infer Left, ...infer RightRest]
        ? Left extends CanStringified
            ? RightRest extends CanStringified[]
                ? `${Left}${T['length'] extends 1 ? '' : SplitStr}${Join<
                RightRest,
                SplitStr
                >}`
                : never
            : never
        : never

/**
 * 校验元组中每个类型是否都符合条件
 * @example
 * type Result = Every<[1, 2, 3], number> // true
 */
type Every<T extends unknown[], Check> = T['length'] extends 0 ? false : EveryHelper<T, Check>

type EveryHelper<T extends unknown[], Check, Offset extends number = 0, CacheBool extends boolean = true>
= T['length'] extends Offset ? CacheBool: EveryHelper<T, Check, IntAddSingle<Offset, 1>, And<CheckLeftIsExtendsRight<T[Offset], Check>, CacheBool>>

/**
 * 校验元组中是否有类型符合条件
 * @example
 * type Result = Every<['1', '2', 3], number> // true
 */
type Some<T extends unknown[], Check> = SomeHelper<T, Check>;

type SomeHelper<
    T extends unknown[],
    Check,
    Offset extends number = 0,
    CacheBool extends boolean = false
> = T['length'] extends Offset
    ? CacheBool
    : SomeHelper<T, Check, IntAddSingle<Offset, 1>, Or<CheckLeftIsExtendsRight<T[Offset], Check>, CacheBool>>

/**
 * 以指定类型填充元组类型
 * @example
 * type Result = Fill<['1', '2', 3, any], 1> // [1, 1, 1, 1]
 */
type Fill<T extends unknown[], F = undefined> = FillHelper<T, F>

type FillHelper<T extends unknown[], F, Offset extends number = 0>
= T['length'] extends 0
    ? F[]
    : T['length'] extends Offset
        ? IsEqual<T, F[]> extends true
            ? T
            : F[]
        :FillHelper<Push<Shift<T>, F>, F, IntAddSingle<Offset, 1>>

/**
 * 过滤出元组类型中符合条件的类型
 * @example
 * type Result = Filter<['1', '2', 3, any, 1], 1, true> // [1]
 */
type Filter< T extends unknown[], C, Strict extends boolean = false> = FilterHelper<T, C, Strict>

type FilterHelper<
    T extends unknown[],
    C,
    Strict extends boolean,
    Offset extends number = 0,
    Cache extends unknown[] = []
> = Offset extends T['length']
    ? Cache
    : FilterHelper<
    T,
    C,
    Strict,
    IntAddSingle<Offset, 1>,
    And<Strict, IsEqual<T[Offset], C>>extends true
        ? Push<Cache, T[Offset]>
        : And<Not<Strict>, CheckLeftIsExtendsRight<T[Offset], C>> extends true
            ? Push<Cache, T[Offset]>
            : Cache
    >
/**
 * 将元组类型映射为带索引的元组类型
 * @example
 * type Result = MapWidthIndex<[1, 2]> // [{ item: 1; index: 0;tuple: [1, 2]; }, { item: 2; index: 1;tuple: [1, 2]; }]
 */
type MapWidthIndex<T extends unknown[]> = MapWidthIndexHelper<T>
interface IndexMappedItem<Item, Index extends number, Tuple extends unknown[]> {
    item: Item
    index: Index
    tuple: Tuple
}

type MapWidthIndexHelper<
    T extends unknown[],
    Offset extends number = 0,
    Cache extends unknown[] = []
> = T['length'] extends Offset
    ? Cache
    : MapWidthIndexHelper<
    T,
    IntAddSingle<Offset, 1>,
    Push<Cache, IndexMappedItem<T[Offset], Offset, T>>
    >

/**找到元组类型中第一个符合条件的类型 */
type Find<T extends unknown[], C> = FindHelper<T, C>

type FindHelper<T extends unknown[], C, Offset extends number = 0> = Offset extends T['length'] ? null : CheckLeftIsExtendsRight<T[Offset], C> extends true ? T[Offset] : FindHelper<T, C, IntAddSingle<Offset, 1>>

/**
 * 反转数组
 */
type Reverse<T extends unknown[]> = ReverseHelper<T>

type ReverseHelper<T extends unknown[], Offset extends number = 0, Cache extends unknown[] = []>
= Cache['length'] extends T['length'] ? Cache : ReverseHelper<T, IntAddSingle<Offset, 1>, [T[Offset], ...Cache]>

/**找到元组类型中最后一个符合条件的类型 */
type FindLast<T extends unknown[], C> = Find<Reverse<T>, C>

/**  找到元组类型中第一个符合条件的类型的索引*/
type FindIndex<
    T extends unknown[],
    C,
    Strict extends boolean = false
> = FindIndexHelper<T, C, Strict>

type FindIndexHelper<
    T extends unknown[],
    C,
    Strict extends boolean = false,
    Offset extends number = 0
> = Offset extends IntAddSingle<T['length'], 1>
    ? -1
    : And<IsEqual<T[Offset], C>, Strict> extends true
        ? Offset
        : And<
        CheckLeftIsExtendsRight<T[Offset], C>,
        Not<Strict>
        > extends true
            ? Offset
            : FindIndexHelper<T, C, Strict, IntAddSingle<Offset, 1>>

/**找到元组类型中最后一个符合条件的类型的索引 */
type FindLastIndex<T extends unknown[], C> = FindLastIndexHelper<T, C>
type FindLastIndexHelper<
    T extends unknown[],
    C,
    Item = Find<Reverse<MapWidthIndex<T>>, IndexMappedItem<C, number, T>>
> = Item extends IndexMappedItem<C, number, T> ? Item['index'] : -1

/**扁平化元组 */
type Flat<T extends unknown[]> = FlatHelper<T>
type FlatHelper<
    T extends unknown[],
    Offset extends number = 0,
    Cache extends unknown[] = []
> = Offset extends T['length']
    ? Cache
    : FlatHelper<
    T,
    IntAddSingle<Offset, 1>,
    T[Offset] extends unknown[]
        ? Concat<Cache, T[Offset]>
        : Push<Cache, T[Offset]>
    >

export type {
    GetTuple,
    GetTupleHelp,
    Pop,
    Push,
    Join
};


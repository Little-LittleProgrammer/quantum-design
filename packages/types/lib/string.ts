import { Push } from './array';
import { IsEqual, Compare, IntAddSingle } from './number';
import { Or } from './common';

// 将类型转为字符串有一定的限制，仅支持下面的类型
type CanStringified = string | number | bigint | boolean | null | undefined

// 将支持的类型转化为字符串
type Stringify<T extends CanStringified> = `${T}`

/**
 * @exports
 * 获取模板字符串类型中的字符
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
 * @example
 * type Result = GetChars<'abc'> // 'a' | 'b' | 'c'
 */
type GetChars<S> = GetCharsHelper<S, never>

/**
 * 以 尾递归 tail-recursive 的方式优化 GetChars，不导出为工具类型,
 * 当 S 为空时, 返回Acc
 */
type GetCharsHelper<S, Acc> = S extends `${infer Char}${infer Rest}`
    ? GetCharsHelper<Rest, Char | Acc>
    : Acc

/**
 * 拆分字符串变为一个元组
 * @example
 * type Result = Split<'1,2,3', ','> // [1, 2, 3]
 */
type Split<S extends string, SplitStr extends string = ''> = SplitHelper<S, SplitStr>

type SplitHelper<
    S extends string,
    SplitStr extends string = '',
    T extends string[] = []
> = S extends `${infer Char}${SplitStr}${infer Rest}`
    ? SplitHelper<Rest, SplitStr, Push<T, Char>>
    : S extends string
        ? S extends ''
            ? T
            : Push<T, S>
        : never

/**
 * 获取字符串的长度
 * @example
 * type Result = GetStringLength<"123"> // 3
 */
type GetStringLength<S extends string> = Split<S>['length']

/**
 * 获取字符串在索引位 I 下的 字符
 * @example
 * type Result = CharAt<"123", 1> // "2"
 */
type CharAt<S extends string, I extends number> = Split<S>[I]

/**
 * 拼接两个字符串
 * @example
 * type Result = Concat<"123", "456"> // "123456"
 */
type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`

/**
 * 判断字符串是否包含子串
 * @example
 * type Result = Includes<"123", "12"> // true
 */
type Includes<S1 extends string, S2 extends string> = S1 extends `${infer Left}${S2}${infer Right}` ? true : false

/**
 * 判断字符串是否以子串为起始
 * @example
 * type Result = StartsWith<"123", "12"> // true
 */
type StartsWith<S1 extends string, S2 extends string> = S1 extends `${S2}${infer Other}`? true : false

/**
 * 判断字符串是否以子串为结束
 * @example
 * type Result = EndsWith<"123", "23"> // true
 */
type EndsWith<
    S1 extends string,
    S2 extends string
> = S1 extends `${infer Other}${S2}` ? true : false

/**
 * 从左往右查找子串的位置
 * @example
 * type Result = IndexOf<"123", "23"> // 1
 */
type IndexOf<S1 extends string, S2 extends string> = IndexOfHelper<S1, S2>

type IndexOfHelper<
    S1 extends string,
    S2 extends string,
    Len1 extends number = GetStringLength<S1>,
    Len2 extends number = GetStringLength<S2>
> = Or<
Compare<Len1, Len2>,
IsEqual<Len1, Len2>
> extends true
    ? S1 extends `${infer Left}${S2}${infer Right}`
        ? GetStringLength<Left>
        : -1
    : -1

/**
 * 从右往左查找子串的位置
 * @example
 * type Result = LastIndexOf<"123", "23"> // 1
 */
type LastIndexOf<S1 extends string, S2 extends string> = LastIndexOfHelper<S1, S2>

type LastIndexOfHelper<
    S1 extends string,
    S2 extends string,
    Index extends number = -1, /** 当前从左往右匹配最大的值，匹配不到以后，上一次匹配的索引就是从右往左第一个的索引 */
    AddOffset extends number = 0 /** 每次从左往右匹配并替换成空串后，下次循序需要累加的值 */
> = S1 extends `${infer Left}${S2}${infer Right}`
    ? LastIndexOfHelper<
    Replace<S1, S2, ''>,
    S2,
    IntAddSingle<GetStringLength<Left>, AddOffset>,
    IntAddSingle<AddOffset, GetStringLength<S2>>
    >
    : Index

/**
 * 在字符串中查找并替换一处子串
 * @example
 * type Result = Replace<"23123", "23", "xx"> // "xx123"
 */
type Replace<
    S extends string,
    MatchStr extends string,
    ReplaceStr extends string
> = S extends `${infer Left}${MatchStr}${infer Right}`
    ? `${Left}${ReplaceStr}${Right}`
    : S

/**
 * 在字符串中查找并替换所有子串
 * @example
 * type Result = Replace<"23123", "23", "xx"> // "xx1xx"
 */
type ReplaceAll<
    S extends string,
    MatchStr extends string,
    ReplaceStr extends string
> = Includes<S, MatchStr> extends true
    ? ReplaceAll<Replace<S, MatchStr, ReplaceStr>, MatchStr, ReplaceStr>
    : S

/**
 * 重复 Times 次数的字符串
 * @example
 * type Result = Repeat<"1", 5> // "11111"
 */
type Repeat<S extends string, Times extends number = 1> = RepeatHelper<S, Times>

type RepeatHelper<
    S extends string,
    Times extends number,
    OriginStr extends string = S,
    Offset extends number = 1
> = Times extends 0
    ? ''
    : IsEqual<Times, Offset> extends true
        ? S
        : `${OriginStr}${RepeatHelper<
        S,
        Times,
        OriginStr,
        IntAddSingle<Offset, 1>
        >}`

/**
 * 当字符串不满足给定的长度时，在字符串前面填充使其满足长度
 * @example
 * type Result = PadStart<'0123', 10> // '      0123'
 */
type PadStart<S extends string, N extends number, FillS extends string = ' '> = PadHelper<S, N, FillS>

/**
 * 当字符串不满足给定的长度时，在字符串后面填充使其满足长度
 * @example
 * type Result = PadStart<'0123', 10> // '0123      '
 */
type PadEnd<
    S extends string,
    N extends number = 0,
    FillS extends string = ' '
> = PadHelper<S, N, FillS, false>

type PadHelper<
    S extends string,
    N extends number = 0,
    FillS extends string = ' ',
    IsStart extends boolean = true,
    Len extends number = GetStringLength<S>,
    Offset extends number = Len
> = Compare<N, Len> extends true
    ? IsEqual<N, Offset> extends true
        ? S
        : PadHelper<`${IsStart extends true ? FillS : ''}${S}${IsStart extends false ? FillS : ''}`, N, FillS, IsStart, Len, IntAddSingle<Offset, 1>>
    : S

export type {
    CanStringified,
    Stringify,
    GetChars,
    Split,
    GetStringLength,
    CharAt,
    Concat
};

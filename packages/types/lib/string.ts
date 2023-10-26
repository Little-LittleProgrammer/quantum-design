import { Push } from './array';

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

type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`

export type {
    CanStringified,
    Stringify,
    GetChars,
    Split,
    GetStringLength,
    CharAt,
    Concat
};

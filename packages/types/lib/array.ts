/**
 * 构造长度为 Length 的元祖
 */
type GetTuple<Length extends number = 0> = GetTupleHelp<Length>

type GetTupleHelp<Length extends number = 0, R extends unknown[] = []> = R['length'] extends Length ? R : GetTupleHelp<Length, [...R, unknown]>

/**
 * 去掉数组的最后一位
 */
type Pop<T extends unknown[]> = T extends [...infer Left, infer Right] ? Left : never

type Push<T extends unknown[], Str extends string> = [...T, Str]

export type {
    GetTuple,
    GetTupleHelp,
    Pop,
    Push
};


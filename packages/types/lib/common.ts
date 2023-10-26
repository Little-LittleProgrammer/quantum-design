/**
 * 与, 即 C1, C2 同为真时真, 否则为假
 */
type And<C1 extends boolean, C2 extends boolean> = C1 extends true ? C2 extends true ? true : false : false

type And3<C1 extends boolean, C2 extends boolean, C3 extends boolean> = And<And<C1, C2>, C3>

type And4<
    C1 extends boolean,
    C2 extends boolean,
    C3 extends boolean,
    C4 extends boolean
> = And<And3<C1, C2, C3>, C4>

/**
 * 或, 即 C1, C2 只要其中之一为真,都为真
 */
type Or<C1 extends boolean, C2 extends boolean> = C1 extends true ? true : C2 extends true ? true : false;

type Or3<C1 extends boolean, C2 extends boolean, C3 extends boolean> = Or<Or<C1, C2>, C3>

type Or4<
    C1 extends boolean,
    C2 extends boolean,
    C3 extends boolean,
    C4 extends boolean
> = Or<Or3<C1, C2, C3>, C4>

/**
 * 反转 C 的真假状态
 */
type Not<C extends boolean> = C extends true ? false : true

/**
 * 判断左侧类型是否可以分配给右侧类型
 */
type CheckLeftIsExtendsRight<T, R> = T extends R ? true : false

/**
 * 判断左侧类型是否和右侧类型一致
 */
type IsEqual<A, B> = (<T>() => T extends A ? 1: 2) extends (<T1>() => T1 extends B ? 1:2) ? true : false

/**
 *
 */

export type {
    Not,
    And,
    And3,
    And4,
    // IsAny,
    // IsNever,
    Or,
    Or3,
    Or4,
    CheckLeftIsExtendsRight,
    IsEqual
    // SafeCheck,
    // Diff,
    // SumAggregate,
    // Nullable,
    // Many,
    // UnionToIntersection,
    // UnionToTuple,
    // IsUnion
};

/**
 * 分布式条件类型
 * 分布式条件类型实际上不是一种特殊的条件类型，而是其特性之一（所以说条件类型的分布式特性更为准确）。
 * 我们直接先上概念： 对于属于裸类型参数的检查类型，条件类型会在实例化时期自动分发到联合类型上。
 *
 * 原文: Conditional types in which the checked type is a naked type parameter are called distributive conditional types. Distributive conditional types are automatically distributed over union types during instantiation
 *
 * 关键词
 * 裸类型参数
 * 实例化
 * 分发到联合类型
 *
 */


// 判断并返回类型的名称
type TypeName<T> =
    T extends string ? 'string' :
        T extends number ? 'number' :
            T extends boolean ? 'boolean' :
                T extends undefined ? 'undefined' :
                    T extends Function ? 'function' : 'object'

// string | function
type T1 = TypeName<string | (() => void)>;

//  string | object
type T2 = TypeName<string | string[]>;

// object
type T3 = TypeName<string[] | number[]>;

/**
 * T1、T2 和 T3 都是联合类型（T3 实际上应该是 object | object，只不过结果合并了）
 * 也就是说，条件类型的推导结果都是联合类型
 * 其实就是类型参数被依次进行条件判断后，再使用 | 组合得来的结
 * 对泛型应用条件类型，当泛型指定为联合类型，那么条件类型会变成分布式条件类型，会对联合类型中的每个值进行条件判断，最后使用 | 将结果联合起来
 *
 * 以 T1 为例，
 * TypeName<string | (() => void)> 等价于 TypeName<string> | TypeName<(() => void)>
 * 进行条件判断：string 和 function
 * 将结果联合：string | function
 *
 * 如果不想让条件类型遇到联合类型就变成分布式条件类型呢
 * 那么需要我们在使用条件类型时，需要将 extends 两边的内容用 [] 包裹起来
 *
 */

type Naked<T> = T extends string ? 'Y' : 'N'
type Wrapper<T> = [T] extends [string] ? 'Y' : 'N';

// Y | N
type DistributeType = Naked<string | number>;

// N
type NoDistributeType = Wrapper<string | number>;

/**
 *  DistributeType 是正常的分发流程
 *  而 NoDistributeType 则不会有分发流程，直接进行 [number | boolean] extends [boolean] 的判断，所以结果是 N
 *
 */

/**
 * 现在就可以解释上面提到的几个概念
 *
 * 1. 裸类型参数，就是直接的一个类型，如 string、number，没有额外被 [] 包裹过的，就像被数组包裹后就不能再被称为裸类型参数
 *
 * 2. 实例化，其实就是条件类型的判断过程，就像我们前面说的，条件类型需要在收集到足够的推断信息之后才能进行这个过程。
 *
 * 3. 分发到联合类型：对于 TypeName，它内部的类型参数 T 是没有被包裹过的，
 *    所以 TypeName<string | (() => void)> 会被分发为 TypeName<string> | TypeName<(() => void)>
 *    然后再次进行判断，最后分发为 "string" | "function"
 *
 * 抽象具体过程：
 * 1. 分发联合类型
 *    (A | B | C) extends T ? 'X' : 'Y'
 *    A extends T ? 'X' : 'Y' | B extends T ? 'X' : 'Y' | C extends T ? 'X' : 'Y'
 *
 * 2. 包裹的条件类型，不会进行分发
 *    [A | B | C] extends [T] ? 'X' : 'Y'
 *
 *
 * 总结：没有被 [] 额外包装的联合类型参数，在条件类型进行判定时会将联合类型分发，分别进行判断
 *
 * 两种方式没有好坏之分，分发行为是条件类型遇到联合类型的预期行为，如果不想要这种预期行为，就使用 [] 包裹 extends 两侧的类型
 *
 * 注意，不仅是 extends 左侧，extends 右侧的类型也可进行分布式类型的推断
 *
 *
 */
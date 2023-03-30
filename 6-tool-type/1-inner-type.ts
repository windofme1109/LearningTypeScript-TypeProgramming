/**
 *
 * typescript 常用的内置类型的实现
 *
 * 1. 基础
 *    ?：将某个属性变成可选的
 *    -?：去掉可选修饰符
 *    readonly：指定某个属性为只读的
 *    -readonly：去除只读修饰符
 *
 */

/**
 *
 * 1. Partial
 *
 */

type Partial<T> = {
    [K in keyof T]?: T[K]
}

interface TestPartial {
    a: string;
    b: string;
    c: string;
}
// {
//     a?: string;
//     b?: string;
//     c?: string;
// }
type partialTest = Partial<TestPartial>;


/**
 *
 * Required
 * 将某个类型中的属性变成必要的属性
 *
 */

type Required<T> = {
    [K in keyof T]-?: T[K]
}

interface Test2 {
    a?: string;
    b?: string;
    c?: string;
}
// {
//     a: string;
//     b: string;
//     c: string;
// }
type RequiredTest2 = Required<Test2>;


/**
 *
 * Readonly
 * 将某个类型中的属性变成只读的属性
 *
 */

type Readonly<T> = {
    readonly [K in keyof T]: T[K]
}
// {readonly a: string, readonly b: string, readonly c: string}
type ReadonlyTest = Readonly<TestPartial>;

//
function myPick<T extends object, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key]);
}

/**
 *
 * Pick
 * 接收一个类型和 key
 * 返回只包含 key 的类型
 */

type Pick<T, K extends keyof T> = {
    // 将 K 约束为 T 的键值组成的联合类型，如果 K 不是 T 的键，则会报错
    // 映射类型的映射源是传入给 Pick 的类型参数K
    [P in K]: T[P]
}

// {a: string, b: string}
type PickTestType = Pick<TestPartial, 'a' | 'b'>;

/**
 *
 * Omit
 * 从一个指定的类型中移除一些属性，与 Pick 相反
 *
 * 要实现 Omit，需要先实现 Exclude
 *
 * Exclude 的字面含义是排除，那么在类型中，怎么才算排除呢，答案是将某个属性设置为 never 类型
 * 前面说了。never 是任何类型的子类型，是底层类型，通常被用来将收窄联合类型或是接口，或者作为条件类型判断的兜底。
 *  never extends otherType 永远返回 true
 *  因为 never 没有子类，所以不会有任何值被赋予为 never 类型，所以，一个类型是 never，表示它再也不会出现
 *  因此，可以将某个类型赋值为 never，表示将其移除
 *  Exclude<1 | 2 | 3 | 4 | 5, 1 | 3> => 2 | 4 | 5
 *
 * 字面意思看起来是排除，那么第一个参数应该是要进行筛选的类型，第二个应该是筛选条件，即是筛选的 key
 * 这里实际上使用到了分布式条件类型的特性，联合类型会使用分布式条件类型
 * 假设 Exclude 接收 T U 两个类型参数，T 联合类型中的类型会依次与 U 类型进行判断，如果这个类型参数在 U 中，就剔除掉它（赋值为 never）
 * 因此，我们需要判断 T 中的每个 key 是不是在 U 中
 * 
 * 举个例子：T 类型的 key 组成的联合类型是 1 | 2 | 3 | 4，U 是 2 | 3
 * 则需要这样判断过程：
 * T extends U ? never | T
 * 1 extends 2 | 3 => false -> 1
 * 2 extends 2 | 3 => true -> never
 * 3 extends 2 | 3 => true -> never
 * 4 extends 2 | 3 => false -> 4
 * 最终结果就是 1 | 4
 */

// Exclude
type MyExclude<T, U> = T extends U ? never : T;

// 4
type ExcludeTest = MyExclude<1 | 2 | 4, 1 | 2>;

/**
 * 那么 Omit 就是在 Exclude 的基础上，进一步处理
 *
 * 先移除指定的 key，然后遍历剩下的 key，并从原始类型中挑出与 key 对应的类型
 */

//
type MyOmit<T, K extends keyof any> = {
    // MyExclude<keyof T, K> 拿到移除 K 后剩下的 T 剩下的 key 组成的联合类型
    [U in MyExclude<keyof T, K>]: T[U]
}

type OmitTestType = MyOmit<TestPartial, 'a' | 'b'>



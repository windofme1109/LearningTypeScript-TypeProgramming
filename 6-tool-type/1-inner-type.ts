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

import * as node

/**
 *
 * 1. Partial
 *
 */

type MyPartial<T> = {
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
type partialTest = MyPartial<TestPartial>;


/**
 *
 * Required
 * 将某个类型中的属性变成必要的属性
 *
 */

type MyRequired<T> = {
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
type RequiredTest2 = MyRequired<Test2>;


/**
 *
 * Readonly
 * 将某个类型中的属性变成只读的属性
 *
 */

type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}
// {readonly a: string, readonly b: string, readonly c: string}
type ReadonlyTest = MyReadonly<TestPartial>;

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

type MyPick<T, K extends keyof T> = {
    // 将 K 约束为 T 的键值组成的联合类型，如果 K 不是 T 的键，则会报错
    // 映射类型的映射源是传入给 Pick 的类型参数K
    [P in K]: T[P]
}

// {a: string, b: string}
type PickTestType = MyPick<TestPartial, 'a' | 'b'>;

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

/**
 *
 * 对上面的 MyOmit 进行优化，实际上是 Pick 和 Exclude 的结合
 *
 */

type MyOmit2<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;

// {c: string}
type OmitTestType = MyOmit<TestPartial, 'a' | 'b'>;

// {c: string}
type OmitTestType2 = MyOmit2<TestPartial, 'a' | 'b'>;


/**
 *
 * 几乎所有使用条件类型的生成的新类型，如果将判断后的赋值语句反一下，就会有新的场景
 * 例如 Exclude 是排除，那么交换赋值就是 Include ，即保留，示例如下：
 *
 */
type MyInclude<T, K> = T extends K ? T : never;

/**
 *
 * Record<K, T>
 * 构建一个以 K 中的键名为键名，T 为其属性的新类型
 *
 * K 一般是一个联合类型，或者是属性的联合类型，T 为类型
 *
 * type Nav = 'a' | 'b' | 'c'
 *
 * interface NavProps {
 *     name: string;
 *     to: string
 * }
 *
 * type newNavType = Record<Nav, NavProps>
 *
 * {
 *     a: {
 *         name: string;
 *         to: string
 *     };
 *     b: {
 *         name: string;
 *         to: string
 *     };
 *     c: {
 *         name: string;
 *         to: string
 *     };
 * }
 *
 *
 */


type MyRecord<K extends keyof any, T> = {
    // K extends keyof any 约束 K 必须为联合类型
    // 将 K 中的每个值拿出来，依次进行赋值
    [P in K]: T
}

type Nav = 'a' | 'b' | 'c';

interface NavProps {
    name: string;
    to: string
}

type newNavType = MyRecord<Nav, NavProps>;

// Record 支持 Record<string, number> 这种形式，因为 keyof any 一定是 string 组成的联合类型（string | number | symbol），所以 string extends keyof any 也是成立的
type KeyofStringType = MyRecord<string, number>

// string | number | symbol
type KeyofAny = keyof any;

// string
type StringType = string extends keyof any ? string : never;


/**
 *
 * ReturnType
 *
 * 用来获取函数返回值
 *
 * 主要是使用 infer 进行推断
 *
 */

type MyReturnType<T extends (...arg: any[]) => any> = T extends (...arg: any[]) => infer R ? R : never;

const getName = (name: string) => {
    return name;
}

// string
type GetNameReturnType = MyReturnType<typeof getName>;

// 不能直接传 getName 这个函数，因为 getName 是值，不是类型，所以需要使用 typeof 获取 getName 的类型


/**
 *
 * 如果 将 infer 放到参数的位置，就可获取函数的入参类型
 * T 是一个函数类型，如果 T extends (...arg: infer P) => any 成立
 *
 * 则 infer P 占位的实际上是 any[] 的这种形式，也就是一个数组，其数组元素是入参类型
 *
 * 所以推断出来的参数形式是：[...]
 *
 *
 */
type MyParameters<T extends (...args) => any> = T extends (...arg: infer P) => any ? P : never;

// [string]
type  GetNameParameters = MyParameters<typeof getName>;

function add(x: number, y: number) {
    return x + y;
}

// [number, number]
type AddParametersType = MyParameters<typeof add>;

function getParams(v: TestPartial, a: string) {

}

// [TestPartial, string]
type GetParamsType = MyParameters<typeof getParams>;


type a = Record<string, string>
/**
 *
 * 提取构造函数的参数
 * 将 infer 放到构造函数的入参处，就可以提取构造函数的入参类型
 *
 *
 */

/**
 * new (args: any) => any
 * 在一个函数的定义类型前加上 new 关键字来使其成为可实例化类型声明，即此处约束泛型为类
 *
 * 要使用这个类型推断构造函数的参数，需要使用接口形式的类的定义
 * 如官网中给的例子，FunctionConstructor 是函数构造函数的接口定义
 * type T1 = ConstructorParameters<FunctionConstructor>;
 *
 */
type MyConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;


/**
 * 去构建一个约束类的接口
 *
 */
interface TestClass {
    new(age: number, name: string): Test2
}

interface Test2 {
    age: number;
    name: string
}

let Person: TestClass;

const p1 = new Person(100, 'curry');

// string[]
type T1 = ConstructorParameters<FunctionConstructor>;

// [age: number, name: string]
type ClassTestConstructorParams = MyConstructorParameters<TestClass>;

/**
 *
 * InstanceType
 *
 * 将 infer 放到其构造函数的返回值的类型的位置，new 一个函数，返回的是一个类实例，所以可以获取类实例
 *
 */

type MyInstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : never;

// Function
type FunctionInstanceType = InstanceType<FunctionConstructor>;
// Test2
type PersonInstanceType = MyInstanceType<TestClass>;

/**
 *
 * 上面实际上是实现了官方提供的工具类型
 * Partial
 * Pick
 * Omit
 * Record
 * Required
 * Exclude
 * Extract
 * ReturnType
 * Parameters
 * ConstructorParameters
 * InstanceType
 *
 *
 *
 */




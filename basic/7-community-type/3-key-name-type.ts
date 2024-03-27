/**
 *
 * 返回键名的工具类型
 *
 * 之前我们是对类型进行进行操作
 *
 * 有些场景下我们需要一个工具类型，它返回接口字段键名组成的联合类型，然后用这个联合类型进行进一步操作（比如给 Pick 或者 Omit 这种使用）
 *
 *
 * 一般键名会符合特定条件，比如：
 *
 * 可选/必选/只读/非只读的字段
 * （非）对象/（非）函数/类型的字段
 *
 */

/**
 * 从一个类型中提取函数类型的 key
 */
type FunctionTypeKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends Function ? K : never
}[keyof T]

interface PersonTest {
    name: string;
    age: number;
    getName: () => void;
    getAge: () => void
}

// getName | getAge
type PersonFunctionType = FunctionTypeKeys<PersonTest>

/**
 *
 * 以 PersonTest 为例，解释一下 FunctionTypeKeys 的工作流程
 *
 * [K in keyof T]-?: T[K] extends Function ? K : never
 *
 * 遍历 T 的 key 值，判断每个 key 对应的类型 T[K] 是不函数 类型，如果是，就返回 key，不是就返回 never
 *
 * 所以这一步，拿到的是一个新类型：
 * type Person1 = {
 *     name: never;
 *     age: never;
 *     getName: 'getName';
 *     getAge: 'getAge
 *
 * }
 *
 * 第二步：{
 *     ...
 * }[keyof T]
 * 等同于 Person1[keyof PersonTest]
 * keyof PersonTest = "name" | "age" | "getName" | "getAge"
 * 所以 Person1[keyof PersonTest] =  Person1["name"] | Person1["age"] | Person1["getName"] | Person1["getAge"]
 * 最终结果是：never | never | getName | getAge
 * never 类型会被踢出，只保留 key 值
 * 即 Person1[keyof PersonTest] = getName | getAge
 *
 * 因此
 * FunctionTypeKeys<T extends object> = {
 *     [K in keyof T]-?: T[K] extends Function ? K : never
 * }[keyof T]
 *
 * 就可以获取类型为函数的键名组成的联合类型
 *
 */

/**
 *
 * 提取非函数类型
 *
 */
type NonFunctionTypeKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];

// "name" | "age"
type NonPersonFunctionType = NonFunctionTypeKeys<PersonTest>;

/**
 *
 * 剔除可选字段，保留必填字段
 * RequiredKeys
 *
 *
 *
 */

type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface AnimalTest {
    name?: string;
    age?: number;
    color: string
}

// color
type RequiredAnimalTestKey = RequiredKeys<AnimalTest>;

/**
 * RequiredKeys 的实现思路
 * [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
 *
 * 关键在于
 * {} extends Pick<T, K>
 *
 *
 * 举个例子
 * type A1 = {} extends {a: string} ? 'X' ? 'Y'
 * type A2 = {} extends {a?: string} ? 'X' ? 'Y'
 *
 * 第一个条件类型中，因为 a 是必填项，所以要求对象中必须要有 a 这个属性，所以 {} 不能赋值给 {a: string}，因此 A1 = 'Y'
 * 第二个条件类型中，因为 a 不是必填项，所以 {} 可以赋值给 {a?: string}，因此 A1 = 'X'
 *
 * Pick<T, K> 得到就是一个只有 K 一个属性的类型，{K: ...}
 * 如果 K 是可选的，那么表达式为真，取 never
 * 如果 K 是必填的，那么表达式为真，取 K
 * 生成一个新的类型：T 中可选的属性其类型为 never，不可选的属性其类型为属性名
 *
 * {...}[keyof T] 取出不为 never 的类型，即保留了必填类型
 *
 *
 *
 *
 */

/**
 *
 * 保留可选的，去掉必填项
 * OptionalKeys
 *
 */

type OptionalKeys<T> = {
    [K in keyof T]: {} extends Pick<T, K> ? K : never;
}[keyof T];

// "name" | "age"
type OptionalAnimalTestKey = OptionalKeys<AnimalTest>;


/**
 *
 * 保留非只读类型，去除只读类型
 *
 * 思路是：
 * 1. 将只读类型设置为 never，可变类型（非只读）设置为 key 值
 * 2. 剔除 never 类型，剩下就是可变类型的 key
 *
 *
 */

/**
 * 首先定义一个 Equal 类型
 *
 * Equal 接收 四个泛型：X、Y、A、B，其中 A 和 B 就是用来占位的
 *
 * <T>() => T extends X ? 1 : 2
 * <T>() => T extends Y ? 1 : 2
 * 这两个条件类型实际上是用来判断 X 和 X 是不是完全相等
 * T extends X 为真，即 T 能赋值给 X，得到 1
 * T extends Y 为真，即 T 能赋值给 X，得到 1
 * 说明 T 能同时分配给 X 和 Y，所以 X 和 Y 相等，即 X 和 Y 的类型相同
 * 如果 X 和 Y 的 类型相同，则 返回 A，否则 返回 B
 *
 *
 */
type Equal<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

/**
 *
 * 如何使用 Equal 呢
 * 首先，X 是我们的原始接口
 * Y 是去除了只读属性的接口
 * A 是 key 值
 *
 * 前面我们说了，只有 X 和 Y 完全一致，Equal 中两个函数值同时为真，返回 A
 * 那么 X 现在是原始接口，Y 是去除了只读属性的接口，这两个接口中的属性一一对比：
 *    X 中只读型的属性，与 Y 中对应的是非只读型属性，显然会被过滤
 *    X 中非只读型的属性，与 Y 中同样是非只读型属性，显然会被保留
 * 这样就过滤掉了只读型属性
 *
 *  注意
 *  泛型 P 在这里不会实际使用，只是映射类型的字段占位。
 *   X 、 Y 同样存在着分布式条件类型， 来依次比对字段去除 readonly 前后
 */

type MutableKeys<T extends object> = {
    [K in keyof T]-?: Equal<{[P in K]: T[K]}, {-readonly [P in K]: T[K]}, K, never>
}[keyof T];




interface MyDog {
    readonly name: 'wangwang';
    age: number;
    color: string;
}

// age | color
type MutableDogKeys = MutableKeys<MyDog>;

/**
 *
 * 保留只读属性，去除可变属性
 * ImmutableKeys
 *
 */

type ImmutableKeys<T extends object> = {
    [K in keyof T]: Equal<{ [P in K]: T[K] }, {-readonly [P in K]: T[K]}, never, K>
}[keyof T];

// name
type ImmutableDogKeys = ImmutableKeys<MyDog>;





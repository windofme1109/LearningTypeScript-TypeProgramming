/**
 * 
 * 索引类型
 * 
 */

/**
 * 基础：从 obj 对象中取出 key 对应的值，key 为 obj 中的键
 */
// function pickSingleValue(obj, key) {
//     return obj[key];
// }


interface Foo {
    a: string;
    b: string;
}

// 'a' | 'b'
type FooKey = keyof Foo;

/**
 * 使用泛型约束 obj
 * keyof 是 **索引类型查询 **的语法， 它会返回后面跟着的类型参数的键值组成的字面量联合类型，通常用来获取某个接口中定义的键值
 * @param obj
 * @param key
 */
function pickSingleValue<T>(obj: T, key: keyof T): T[keyof T] {
    return obj[key];
}

/**
 * 实际上，我们也可以像从对象中取值一样，从接口中取出某给属性的类型
 *
 */
interface T {
    a: string;
    b: number;
    c: boolean
}

// 'a' | 'b' | 'c'
type TKey = keyof T;

// string
type PropA = T['a'];
// number
type PropB = T['b'];
// boolean
type PropC = T['c'];

/**
 * 对上面的 pickSingleValue 进行改进：
 * pickSingleValue 存在两个问题：
 * 1. keyof出现了两次
 * 2. 以及泛型 T 其实应该被限制为对象类型
 *
 * 对于第一点，就像我们平时编程会做的那样：用一个变量把多处出现的存起来，记得，在类型编程里，泛型就是变量
 *
 */

function pickSingleValue<T extends object, U extends keyof T>(obj: T, key: U): T[U] {
    return obj[key];
}

/**
 * extends 这里表示一种约束关系
 * T extends object 表示 T 被限制为对象类型
 * U extends keyof T 表示，U 必然是 T 的键名组成的联合类型，以字面量类型的形式，比如 T 这个对象的键名包括a b c，那么U的取值只能是"a" "b" "c"之一，即 "a" | "b" | "c"
 *
 *
 */

/**
 * 假设说，现在不取一个 key 对应的值，想同时取多个 key 对应的值，即 key 为数组，则返回值也是数组
 * 所以可以这样写类型约束：
 */

function pickMultiVal<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
    return keys.map(key => obj[key]);

}

/**
 * 上面的例子是对类型的一个组合
 * keys 指定为 U[]，U 是泛型 T 的键名组成的联合类型，那么 U[] 表示由联合类型组成的一个数组，数组的每一项必然是 T 的键
 * 返回值为 T[U][]，T[U] 好理解，表示获取的是 T 中每个属性的类型。所以 T[U][] 表示由这个属性组成的数组
 */

/**
 *
 * 索引签名 Index Signature
 * 在JavaScript中，我们通常使用 arr[1] 的方式索引数组，使用 obj[key] 的方式索引对象。
 * 索引就是你获取一个对象成员的方式，而在类型编程中，索引签名用于快速建立一个内部字段类型相同的接口
 *
 */

interface Foo2 {
    [key: string]: string
}

/**
 *
 * Foo 等价于属性的类型全部为 string、不限制属性名称的接口
 * 等同于 Record<string, string>
 *
 *
 * 值得注意的是，由于 JS 可以同时通过数字与字符串访问对象属性，因此 keyof Foo 的结果会是string | number
 *
 */

// string | number
type FooKeys = keyof Foo2;

const o: Foo2 = {
    1: 'curry'
}

// true
// o[1] === o['1'];

/**
 * 注意：一旦某个接口的索引签名类型为number，那么使用它的对象就不能再通过字符串索引访问，如o['1']，将会抛出错误，
 * 元素隐式具有 "any" 类型，因为索引表达式的类型不为 "number"
 *
 * 索引签名最好是字符串
 *
 */
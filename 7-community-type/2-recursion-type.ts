/**
 *
 * 递归类型
 *
 * 在 typescript 中，类型也是可以使用递归的，即定义的一个类型，可以自己调用自己，实现对深层次类型的访问
 *
 */

/**
 *
 * 举个例子
 * 前面我们写了个 Partial、Readonly、Required 等几个对接口字段进行修饰的工具类型，
 * 但实际上都有局限性，如果接口中存在着嵌套呢
 * 也就是说，接口字段不是基本类型，而是另外一个接口
 * 如果我们想把所有这个接口中，所有的字段都修饰一下，那么就需要借助递归
 *
 * 基本流程
 * 1. 遍历接口字段
 * 2. 接口字段是基本数据类型，进行修饰
 * 3. 接口字段是对象类型（接口），遍历这个对象内部的字段，并重复上面的操作
 *
 *
 */

type DeepPartial<T extends object> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}

interface Person {
    name: string;
    age: number;
    info: {
        location: string;
         work: string;
         id: number;
    }
}

type PersonPartial = DeepPartial<Person>;

let p1: PersonPartial = {
    name: 'curry',
    info: {
        id: 10085
    }
}

/**
 *
 * DeepReadonly
 *
 */

type DeepImmutable<T> = {
    readonly [ K in keyof T]: T[K] extends object ? DeepImmutable<T[K]> : T[K]
}

/**
 *
 * DeepMutable
 *
 */
type DeepMutable<T> = {
    -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K]
}

/**
 *
 * DeepRequired
 *
 */
type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

/**
 *
 * 上面几种工具类型是 utility-type 中的
 * utility-types 内部的实现实际比这个复杂，还考虑了数组的情况，这里为了便于理解做了简化，后面的工具类型也同样存在此类简化。
 *
 */
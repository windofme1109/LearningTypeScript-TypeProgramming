/**
 *
 * 映射类型
 *
 * 数组的 map 方法可以从一个数组中按照某种映射关系映射出一个新的数组
 *
 * 映射类型与 map 方法类似，只不过从数组变成了类型
 *
 * 会从一个类型定义（包括但不限于接口、类型别名）映射得到一个新的类型定义。通常会在旧有类型的基础上进行改造，如：
 *
 * 修改原接口的键值类型
 * 为原接口键值类型新增修饰符，如 readonly 与可选 ?
 * 
 * 实现映射类型的关键是 in
 * 
 * in 关键字可以用来遍历一个类型
 * 
 * 可以使用 in 关键字，遍历一个类型，取出原类型中的键，然后给这个键值赋予新的类型约束
 * 
 */

interface A {
    a: boolean;
    b: string;
    c: number
}

/**
 * 有一个新类型，key 和接口 A 完全相同，但是其中的类型全部是 string，现在有两种方式生成这个新类型：
 * 1. 新建一个类型，key 与 A 完全相同，类型均赋值为 string
 * 2. 从 A 中映射出新的类型
 * 显然第二种方式更高效一些
 *
 */

type B<T> = {
    [K in keyof T]: string
}

/**
 * [K in keyof T]
 * 有点类似于使用 for in / for of 遍历一个对象，for in 遍历对象，就是取出原对象的 key，拿到这个 key，就可以做一些操作，比如说复制对象，对原对象中每个 key 对应的 value 进行修改然后放到新对象中
 *
 *
 *
 */

/**
 *
 * 复制接口 A
 *
 */

type CopiedInterface<T> = {
    [K in keyof T]: T[K]
}

type CopiedA = CopiedInterface<A>;

/**
 *
 * 将某个接口下的字段变成可选的
 * typescript 提供给的 Partial 工具类型的底层实现
 */

type MyPartial<T> = {
    [K in keyof T]?: T[K]
}

type PartialA = MyPartial<A>;




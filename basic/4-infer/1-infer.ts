/**
 *
 * infer 关键字
 *
 * infer 是 inference 的缩写，表示推断，即可以从其他类型中推到出具体的类型
 *
 * 举个例子
 * T extends Array<PrimitiveType> ? "foo" : "bar"
 * 我们不能从作为条件的 Array<PrimitiveType> 中获取到 PrimitiveType 的实际类型
 *
 * 进一步的，比如 Promise、数组、函数返回值类型等，我们都不能直接获取其内部值类型，因此都需要进行推导
 *
 * infer 通常的使用方式是用于修饰作为类型参数的泛型，
 * 如： infer R，R表示待推断的类型
 * 通常 infer 不会被直接使用，而是与条件类型一起，被放置在底层工具类型中。
 * 如果说条件类型提供了延迟推断的能力，那么加上 infer 就是提供了基于条件进行延迟推断的能力。
 *
 *
 */

/**
 *
 * 举一个例子：从函数中推断其返回值类型
 *
 */

function foo(): string {
    return 'foo';
}

type ReturnedType<T> = T extends (...arg: any[]) => infer R ? R : never;

// string
type FooReturnedType = ReturnedType<typeof foo>;

/**
 *
 * (...args: any[]) => infer R 是一个整体，这里函数的返回值类型的位置被 infer R 占据了。
 *
 *
 * 当 ReturnType 被调用，类型参数 T 、R 被显式赋值
 * T为 typeof foo，infer R 被整体赋值为 string，即函数的返回值类型
 * 如果 T 满足条件类型的约束，就返回 infer 完毕的 R 的值，在这里 R 即为函数的返回值实际类型
 *
 * infer R 可以理解为是一个占位符，会被一个具体的类型取代
 *
 *
 *
 */

/**
 *
 * 实际上为了严谨，应当约束泛型T为函数类型
 *
 */

type NewReturnedType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

// string
type NewFooReturnedType = NewReturnedType<typeof foo>;

/**
 *
 *  infer 关键字使用的时候，有几个需要注意的地方
 *  1. infer 只能用在 extends 的右侧
 *  2. 条件为 true 时，返回 infer 推导出的值
 *
 *
 */
/**
 * 
 * 几个特殊的例子的说明
 * 
 */

/**
 * 1. isEqual
 * 
 * 
 */

type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type IsEqualRes = IsEqual<true, 1>;
type IsEqualRes2 = IsEqual<true, true>;
type IsEqualRes3 = IsEqual<any, 1>;

// 解释一下：
// 对于条件类型的处理，源码中有这样一段注释：
// 如果是两个条件类型 T1 extends U1 ? X1 : Y1 和 T2 extends U2 ? X2 : Y2 相关的话，那 T1 和 T2 相关、X1 和 X2 相关、Y1 和 Y2 相关，而 U1 和 U2 相等

// 注意，这里 U1 和 U2 是相等的，不是相关
// 如果是判断相关性的话，任意类型 extends any 都是 true，但通过构造两个条件类型判断相关性
// 就可以利用 extends 右边部分相等的性质来判断两个类型是否 equal

// 比如 any 和 1，判断相关性的话，肯定是 true，但是判断相等的话，就是 false 了
// 不过 TS 没有暴露判断相等的方式，只有 extends 这个来判断类型相关性的语法

// 这就是为什么我们要这样判断两个类型相等，就是利用了两个条件类型判断相关性的时候会判断右边部分是否相等的这个性质
// 算是一种 hack 的写法。答案要从源码找

type T1<A> = <T>() => T extends A ? 1 : 2;

type R1 = T1<true>;
type R2 = T1<2>;

type R3 = (<T>() => T extends true ? 1 : 2) extends (<T>() => T extends 2 ? 1 : 2) ? true : false;
type R4 = (<T>() => T extends true ? 1 : 2) extends (<T>() => T extends true ? 1 : 2) ? true : false;
type R5 = (<T>() => T extends 10 ? 1 : 2) extends (<T>() => T extends 10 ? 1 : 2) ? true : false;

// 创建两个条件类型
// 在 typescript 编译器处理过程中，会对着两个条件类型进行相关性判断：
// (<T>() => T extends true ? 1 : 2) 和 (<T>() => T extends 2 ? 1 : 2) 显然不具备相关性，即不是同一个类型
// 所以 U1 不等于 U2，这里返回 false

// (<T>() => T extends true ? 1 : 2) 和 (<T>() => T extends true ? 1 : 2) 显然是相关的，所以 U1 = U2，这里返回 true

// 通过是否具有相关性，进而反推出 U1 是否等于 U2



// 泛型 T 如果不约束，则推导出来的默认就是 unknown
declare function func<T>(params: T): void
declare function func2<T extends number>(params: T): void

// FuncParams = [params: unknown]
type FuncParams = Parameters<typeof func>;
type FuncParams2 = Parameters<typeof func2>;

// 几个条件类型的特殊情况
type Test<T> = T extends number ? 1 : 2;

type res1 = Test<1 | 'a'>;

type Test2<T> = T extends true ? 1 : 2;

type res2 = Test2<boolean>;

type Test3<T> = T extends true ? 1 : 2;

type res3 = Test3<any>;

type Test4<T> = T extends true ? 1 : 2;

type res4 = Test4<never>;

// res1 的结果是 1 | 2，没什么好说的，触发了分布式条件类型

// res2 的结果也是 1 | 2，这是因为 boolean 也是联合类型，是 true | false，所以也会触发分布式条件类型
// 这个可以从源码的注释中找到说明，感兴趣也可以调试下源码，判断下 flags

// 第三个是条件类型中 any 的特殊处理，如果左边是 any，则会返回 trueType 和 falseType 的联合类型：

// 第四个其实严格来说也是分布式条件类型的一种情况，ts 处理分布式条件类型的时候对 Union 和 Never 都做了特殊处理
// 在typescript 源码中，遇到 never 类型，直接就返回了，所以当条件类型左边是 never 的时候，就会直接返回 never

// 总结：
// 判断相等是根据“两个条件类型如果相关，那么 extendsType 部分是相等的”这个特性。

// 类型参数默认推导出的是类型约束的类型。

// 条件类型中，联合类型、any、never、boolean 都比较特殊：

// 联合类型有分布式条件类型的特性，会分发传入
// boolean 也是联合类型
// any 会直接返回 trueType 和 falseType 的联合类型
// never 会直接返回 never，严格来说这个也是分布式条件类型的一种情况
/**
 * TypeScript 中内置的高级类型
 * 
 * 
 */

/**
 * Parameters
Parameters 用于提取函数类型的参数类型
 * 
 */

// Parameters 源码实现
// 类型参数 T 为待处理的类型，通过 extends 约束为函数，参数和返回值任意
// 通过 extends 匹配一个模式类型，提取参数的类型到 infer 声明的局部变量 P 中返回


type MyParameters<T extends (...args: any) => any> = 
    T extends (...args: infer P) => any ? P : never;


function test(a: string, b: number) {
    return '';
}

type TestFuncParams = Parameters<typeof test>;

/**
 * 
 * ReturnType
 * ReturnType 用于提取函数类型的返回值类型
 * 
 * 
 */

// ReturnType 源码
// 类型参数 T 为待处理的类型，通过 extends 约束为函数类型，参数和返回值任意
// 用 T 匹配一个模式类型，提取返回值的类型到 infer 声明的局部变量 R 里返回
type MyReturnType<T extends (...args: any) => any> = 
    T extends (...args: any) => infer R ? R : any;

type TestFuncReturn = ReturnType<() => 'beijing'>;

/**
 * 
 * ConstructorParameters
 * 构造器类型和函数类型的区别就是可以被 new
 * Parameters 用于提取函数参数的类型，而 ConstructorParameters 用于提取构造器参数的类型
 * 
 * 
 */

// ConstructorParameters 源码
// 类型参数 T 是待处理的类型，通过 extends 约束为构造器类型，加个 abstract 代表不能直接被实例化（其实不加也行）
// 用 T 匹配一个模式类型，提取参数的部分到 infer 声明的局部变量 P 里，返回 P


type MyConstructorParameters<T extends abstract new (...args: any) => any> = 
    T extends abstract new (...args: infer R) => any ? R : never;



class Fruit {

}

interface FruitConstructor {
    new(color: string): Fruit
}

type ConstructorParametersRes = ConstructorParameters<FruitConstructor>;

/**
 * 
 * InstanceType
 * 提取构造器返回值的类型
 * 
 * 
 */

// 提取的是返回值
type MyInstanceType<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: any) => infer R ? R : never;


type InstanceTypeRes = InstanceType<FruitConstructor>;


type Person = {
    name: 'Beijing'
}

// 函数的参数中，第一个参数必须是一个this 对象，这样才能使用 ThisParameterType 进行提取
function hello(this: Person) {
    console.log(this.name);
}

// Argument of type '{}' is not assignable to parameter of type 'Person'.
//   Property 'name' is missing in type '{}' but required in type 'Person'.
// hello.call({});

// this 的类型也可以提取出来，通过 ThisParameterType 这个内置的高级类型
type ThisParameterTypeRes = ThisParameterType<typeof hello>;

/**
 * ThisParameterType
 * 提取 this 参数类型
 * 
 * 
 */

// 类型参数 T 为待处理的类型
// 用 T 匹配一个模式类型，提取 this 的类型到 infer 声明的局部变量 U 里返回
type MyThisParameterType<T> = 
    T extends (this: infer U, ...args: any) => any ? U : unknown;

/**
 * 
 * OmitThisParameter
 * hisParameter 用于提取 this 参数所表示的类型
 * 自然可以构造一个新的类型，用于提取除了 this 之外的参数类型
 * 
 */

// 类型参数 T 为待处理的类型
// 用 ThisParameterType 提取 T 的 this 类型，如果提取出来的类型是 unknown 或者 any
// 那么 unknown extends ThisParameterType 就成立，也就是没有指定 this 的类型，所以直接返回 T
// 否则，就通过模式匹配提取参数和返回值的类型到 infer 声明的局部变量 A 和 R 中，用它们构造新的函数类型返回
type MyOmitThisParameter<T> = 
    unknown extends ThisParameterType<T> ?
       T : T extends (this: infer U, ...args: infer A) => infer R ? (...args: A) => R : T;


function say(this: Person, age: number, country: string) {
    console.log(this.name);
    return this.name + age;
}

type SayType = typeof say;
type SayThisParameterType = ThisParameterType<SayType>;

type OmitSayThisParameters = MyOmitThisParameter<SayType>;
type OmitSayThisParameters2 = OmitThisParameter<typeof say>;

/**
 * Partial
 * 
 * 索引类型可以通过映射类型的语法做修改，比如把索引变为可选
 * 
 */

// 类型参数 T 为待处理的类型
// 通过映射类型的语法构造一个新的索引类型返回，索引 Key 是来源于之前的 T 类型的索引，也就是 Key in keyof T
// 索引值的类型也是之前的，也就是 T[Key]
// 在遍历每个字段的时候，把每个字段变成可选的
type MyPartial<T> = {
    [Key in keyof T]?: T[Key]
}


type PartialResult = MyPartial<{name: string; age: number}>
type PartialResult2 = Partial<{name: string; age: number}>

/**
 * Required
 * 将可选字段变成必选
 * 
 * 
 */

// 类型参数 T 为待处理的类型。
// 通过映射类型的语法构造一个新的索引类型，索引取自之前的索引，也就是 Key in keyof T
// 但是要去掉可选，也就是 -?，值的类型也是之前的，就是 T[Key]
type MyRequired<T> = {
    [Key in keyof T]-?: T[Key]
}

type RequiredResult = MyRequired<{name?: string; age?: number}>
type RequiredResult2 = Required<{name?: string; age?: number}>

/**
 * Readonly
 * 将字段变成只读的
 * 
 */

// 通过映射类型的语法构造一个新的索引类型返回，索引和值的类型都是之前的
// 也就是 Key in keyof T 和 T[Key]，但是要加上 readonly 的修饰
type MyReadonly<T> = {
    readonly [Key in keyof T]: T[Key]
}

type ReadonlyResult = MyReadonly<{name: 'qqq'; age: 18}>
type ReadonlyResult2 = Readonly<{name: 'qqq'; age: 18}>


/**
 * Pick
 * 挑选出指定的类型
 * 
 */

// 类型参数 T 为待处理的类型，类型参数 K 为要过滤出的索引，通过 extends 约束为只能是 T 的索引的子集
// 构造新的索引类型返回，索引取自 K，也就是 P in K，值则是它对应的原来的值，也就是 T[P]
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

type PickResult = MyPick<{name: 'qqq'; age: 18, cc: 0}, 'age'>
type PickResult2 = Pick<{name: 'qqq'; age: 18, cc: 0}, 'name' | 'age'>



/**
 * Record
 * 创建索引类型，传入 key 和值的类型
 * 
 */

// 这里很巧妙的用到了 keyof any，它的结果是 string | number | symbol
// 用 keyof any 是动态获取的，比直接写死 string | number | symbol 更好
// 它用映射类型的语法创建了新的索引类型，索引来自 K，也就是 P in K，值是传入的 T
type MyRecord<K extends keyof any, T> = {
    [P in K]: T
}
// string | number | symbol
type keyofAnyRes = keyof any;

type MyRecordResult = MyRecord<'a' | 'b' | 100, number>;
type MyRecordResult2 = Record<'a' | 'b' | 100, number>;
type MyRecordResult3 = Record<string, number>;

/**
 * 
 * Exclude
 * 
 * 从一个联合类型中去掉一部分类型
 * 
 * 
 */

// 联合类型当作为类型参数出现在条件类型左边时，会被分散成单个类型传入，这叫做分布式条件类型
// 所以写法上可以简化， T extends U 就是对每个类型的判断
// 过滤掉 U 类型，剩下的类型组成联合类型。也就是取差集
type MyExclude<T, U> = T extends U ? never : T;


// 'a' | 'b' | 'c' | 'd' extends 'a' | 'b' 触发分布式条件类型：
// 'a' extends 'a' | 'b' -> never
// 'b' extends 'a' | 'b' -> never
// 'c' extends 'a' | 'b' -> 'c'
// 'd' extends 'a' | 'b' -> 'd'
// 最后将结果组合起来：never | never | 'c' | 'd' -> 'c' | 'd'
type ExcludeResult = MyExclude<'a' | 'b' | 'c' | 'd', 'a' | 'b'>
type ExcludeResult2 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'b'>

/**
 * 
 * Extract
 * 从一个联合类型中保留（提取）一部分类型
 * 
 */
type MyExtract<T, U> = T extends U ? T : never;

type ExtractResult = MyExtract<'a' | 'b' | 'c' | 'd', 'a' | 'b'>
type Extractesult2 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'b'>
/**
 * 
 * Omit
 * 移除索引类型中的指定部分索引并构造出新的类型
 * 
 */

type MyOmit<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P]
}

// 类型参数 T 为待处理的类型，类型参数 K 为索引允许的类型（string | number | symbol 或者 string）
// 通过 Pick 取出一部分索引构造成新的索引类型，这里用 Exclude 把 K 对应的索引去掉，把剩下的索引保留
type MyOmit2<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type OmitResult = MyOmit<{name: 'qqq'; age: 18, cc: 0}, 'age'>
type OmitResult2 = Omit<{name: 'qqq'; age: 18, cc: 0}, 'cc'>
type OmitResult3 = MyOmit2<{name: 'qqq'; age: 18, cc: 0}, 'name'>




/**
 * 
 * Awaited
 * 提取 Promise 的 ValueType
 */



// 类型参数 T 是待处理的类型
// 如果 T 是 null 或者 undefined，就返回 T
// 如果 T 是对象并且有 then 方法，那就提取 then 的参数，也就是 onfulfilled 函数的类型到 infer 声明的局部变量 F
// 继续提取 onfullfilled 函数类型的第一个参数的类型，也就是 Promise 返回的值的类型到 infer 声明的局部变量 V
// 递归的处理提取出来的 V，直到不再满足上面的条件
type MyAwaited<T> = 
    T extends null | undefined 
    ? T
    : T extends object & {then: (onfulfilled: infer F) => any}
        ? F extends (value: infer V, ...args: any) => any 
            ? MyAwaited<V> 
            : never 
        : T

// Awaited 实现依赖于 Promise 对象的结构：
// (new Promise(() => {})).then((val) => {})
// 即每个 Promise 对象内部都有 then 方法
// then 方法接收的第一个参数是 onfulfilled 回调函数
// onfulfilled 回调函数接收的参数，才是 Promise 对象由 Pending 状态变成 Resolved 状态得到的值
// 所以 Awaited 的匹配逻辑是：先匹配是不是有 then 方法，然后匹配 then 方法的第一个参数，再判断这个参数是不是函数，最后取出这个函数的参数
type AwaitedResult = MyAwaited<Promise<Promise<Promise<Promise<{a: string, b: number}>>>>>
type AwaitedResult2 = Awaited<Promise<Promise<Promise<Promise<{a: string, b: number}>>>>>
/**
 * 
 * NonNullable
 * 
 * 用于判断是否为非空类型，也就是不是 null 或者 undefined 的类型的
 * 
 */

type MyNonNullable<T> = T extends null | undefined ? never : T;


type NonNullableResult = MyNonNullable<null>;
type NonNullableResult2 = MyNonNullable<undefined>;
type NonNullableResult3 = NonNullable<{name: 'wei'}>;

/**
 * 
 * Uppercase
 * 字母大写
 * Lowercase
 * 字母小写
 * Capitalize
 * 首字母大写
 * Uncapitalize
 * 去掉首字母大写
 * 
 */

type UppercaseResult = Uppercase<'beijing'>
type LowercaseResult = Lowercase<'BEIJING'>
type CapitalizeResult = Capitalize<'beijing'>
type UncapitalizeResult = Uncapitalize<'Beijing'>

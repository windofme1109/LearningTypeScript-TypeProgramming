import { RestTypeNode } from "typescript";

type ParseQueryString<Str extends string>  = 
    Str extends `${infer First}&${infer Rest}` 
    ? MergeParams<ParseParams<First>, ParseQueryString<Rest>>
    : ParseParams<Str>

/**
 * 
 * 解析 a=b 这种形式的字符串，将其转换为 {a: 'b'}
 * 
 */
type ParseParams<Str extends string> = 
    Str extends `${infer K}=${infer V}` 
    ? {
        [P in K]: V
      } : Record<string, any>


/**
 * 
 * 合并两个对象，key 相同的，value 合并为数组
 * 
 */
type MergeParams<OneParams extends Record<string, any>, OtherParams extends Record<string, any>> = {
    readonly [Key in keyof OneParams | keyof OtherParams]: 
        Key extends keyof OneParams
            ? Key extends keyof OtherParams 
                ? MergeValues<OneParams[Key], OtherParams[Key]>
                :  OneParams[Key] 
            : Key extends keyof OtherParams
                ? OtherParams[Key]
                : never
};

type MergeValues<One, Two> = 
      One extends Two ?
          One : Two extends unknown[] ?
              [One, ...Two] : [One, Two] 
                

function parseQueryString<Str extends string>(queryStr: Str): ParseQueryString<Str>

function parseQueryString(queryStr: string) {
    if (!queryStr || !queryStr.length) {
        return {};
    }
    const queryObj = {};
    const items = queryStr.split('&');
    items.forEach(item => {
        const [key, value] = item.split('=');
        if (queryObj[key]) {
            if(Array.isArray(queryObj[key])) {
                queryObj[key].push(value);
            } else {
                queryObj[key] = [queryObj[key], value]
            }
        } else {
            queryObj[key] = value;
        }
    });
    return queryObj;
}

type ParseQueryStringResult = ParseQueryString<'a=1&b=2&c=3&a=10'>

const res = parseQueryString('a=1&b=2&c=3&a=10')

console.log(res);


/**
 * Promise.all 和 Promise.race 的函数定义
 * 
 * 
 */


interface PromiseConstructor {
    // 类型参数 T 是待处理的 Promise 数组，约束为 unknown[] 或者空数组 []
    // 这个类型参数 T 就是传入的函数参数的类型
    // 返回一个新的数组类型，也可以用映射类型的语法构造个新的索引类型（class、对象、数组等聚合多个元素的类型都是索引类型）
    // 新的索引类型的索引来自之前的数组 T，也就是 P in keyof T，值的类型是之前的值的类型
    // 但要做下 Promise 的 value 类型提取，用内置的高级类型 Awaited，也就是 Awaited<T[P]>
    // 同时要把 readonly 的修饰去掉，也就是 -readonly
    all<T extends unknown[] | []> (value: T): Promise<{
        -readonly [P in keyof T]: Awaited<T[P]>
    }>

    // 类型参数 T 是待处理的参数的类型，约束为 unknown[] 或者空数组 []
    // 返回值的类型可能是传入的任何一个 Promise 的 value 类型，那就先取出所有的 Promise 的 value 类型，也就是 T[number]
    // 因为数组类型也是索引类型，所以可以用索引类型的各种语法
    // 用 Awaited 取出这个联合类型中的每一个类型的 value 类型，也就是 Awaited<T[number]>，这就是 race 方法的返回值的类型
    // 最后 race 返回值的类型是一个联合类型
    race<T extends unknown[] | []> (value: T): Promise<Awaited<T[number]>>
}

const p1 = Promise.all([Promise.resolve(1), Promise.resolve(2),Promise.resolve(3)])
const p2 = Promise.race([Promise.resolve(1), Promise.resolve(2),Promise.resolve(3)])
const p3 = Promise.race([Promise.resolve(1), Promise.resolve('a'),Promise.resolve({age: 20})])

// 上面在定义 T 的类型的时候，使用了 unknown[] | [] 方式，原因是：
// T 约束为 unknown[] | []，相当于使用 as const 
// 也就是将 T 推导为常量字面量形式，而不是基础类型，举个例子：

// 不加 as const
const arr = [1, 2, 3];
const obj = {
    a: 1,
    b: 'age'
};
// number[]
type ArrType1 = typeof arr;
// {
    // a: number;
    // b: string;
// }
type ObjType1 = typeof obj;

// 加 as const
const arr2 = [1, 2, 3] as const;
const obj2 = {
    a: 1,
    b: 'age'
} as const;
// readonly [1, 2, 3]
type ArrType2 = typeof arr2;
// {
//     readonly a: 1;
//     readonly b: "age";
// }
type ObjType2 = typeof obj2;

declare function ttt1<T extends unknown[]>(value: T): T
declare function ttt2<T extends unknown[] | []>(value: T): T

const res1 = ttt1([1, 2, 3])
const res2 = ttt2([1, 2, 3])


/**
 * 
 * Currying
 * 柯里化函数类型
 * 
 * 将多参数函数转换为单参数函数
 * 
 * 
 */
const func = (a: string, b: number, c: boolean) => {};
// 返回的函数应该为：
const curriedFn = (a: string) => (b: number) => (c: boolean) => {}

// 定义 Curried 函数类型
// 传入的是函数类型，可以用模式匹配提取参数和返回值的类型来，构造成新的函数类型返回
// 每有一个参数就返回一层函数，具体层数（参数个数）是不确定的，所以要用递归


// curried 函数有一个类型参数 Func，由函数参数的类型指定
// 返回值的类型要对 Func 做一些类型运算，通过模式匹配提取参数和返回值的类型，传入 CurriedFunc 来构造新的函数类型
// 构造的函数的层数不确定，所以要用递归，每次提取一个参数到 infer 声明的局部变量 Arg，其余参数到 infer 声明的局部变量 Rest
// 用 Arg 作为构造的新的函数函数的参数，返回值的类型继续递归构造
// 这样就递归提取出了 Params 中的所有的元素，递归构造出了柯里化后的函数类型

// Params 是函数的参数，Return 是函数的返回值
// 一个一个地从 Params 取出参数，与 Return 组合成函数返回 
type CurriedFunc<Params, Return> = 
    Params extends [infer Arg, ...infer Rest] 
        ? (arg: Arg) => CurriedFunc<Rest, Return> 
        : Return;

// 对 Func 进行匹配，提取出 Func 的参数 Params 和返回值 Result
// 将Params 和 Result 传入 CurriedFunc 构造柯里化函数返回值类型
declare function curried<Func>(fn: Func):
    Func extends (...args: infer Params) => infer Result ? CurriedFunc<Params, Result> : never;

function fn(a: string, b: number, c: boolean) {}
// (arg: string) => (arg: number) => (arg: boolean) => never
const curriedFuncType = curried(fn);
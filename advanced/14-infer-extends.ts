/**
 * 
 * 新语法 infer extends
 * 
 * 
 */

import { NodeVisitor } from "typescript";

type Last<Arr extends unknown[]> = 
    Arr extends [...infer First, infer Rest] ?
        Rest : never;

type ReturnType<func extends Function> = 
    func extends (...args: any[]) => infer Return ?
        Return : never

// 模式匹配就是通过一个类型匹配一个模式类型，需要提取的部分通过 infer 声明一个局部变量，这样就能从局部变量里拿到提取的类型
// infer 存在一个问题：从 string 数组中提取的元素，默认会推导为 unknown 类型，这就导致了不能直接把它当 string 用

// 例如
// Type 'Rest' is not assignable to type 'string | number | bigint | boolean'
type TestLast<Arr extends string[]> = 
    Arr extends [...infer First, infer Rest] ?
        `The Last is ${Rest}` : never;
    
// 解决方法是对 Rest 进行判断：
type TestLast2<Arr extends string[]> = 
    Arr extends [...infer First, infer Rest] ?
        `The Last is ${Rest & string}` : never;

type TestLast3<Arr extends string[]> = 
        Arr extends [...infer First, infer Rest] ?
            Rest extends string ?
                `The Last is ${Rest & string}` 
                : never
            : never;

/**
 * 
 * 新语法 infer extends
 * 
 * 
 */

// TS 也知道有这个问题，所以在 4.7 就引入了新语法：infer extends
// 现在我们可以这样写：

type TestLast4<Arr extends string[]> = 
        Arr extends [...infer First, infer Rest extends string] ?
            `The Last is ${Rest & string}` 
            : never;

// infer 的时候加上 extends 来约束推导的类型，这样推导出的就不再是 unknown 了，而是约束的类型

// 4.8 版本又进一步完善了：
type NumberInfer<Str> = 
        Str extends `${infer Num extends number}` ?
            Num : Str;

// 如果 extends 的是基础类型，会推导出字面量类型。 
type NumberInferResult1 = NumberInfer<'123'>
type NumberInferResult2 = NumberInfer<'100'>


// 提取枚举值的类型
enum Code {
    a = 111,
    b = 222,
    c = "abc"
}

// "abc" | "111" | "222"
// 将枚举值中的数字也变成字符串
type CodeResult = `${Code}`;

type StrToNum<Str> = 
    Str extends `${infer Num extends number}` ?
        Num : Str;

// 111 | 222 | "abc"
type CodeResult2 = StrToNum<`${Code}`>;

// 字符串转布尔值
type StrToBoolean<Str> = 
    Str extends `${infer Bool extends boolean}` ?
    Bool : Str;

type TestStrToBoolean = StrToBoolean<'true'>
type TestStrToBoolean2 = StrToBoolean<'false'>

// 字符串转 null
type StrToNull<Str> = 
    Str extends `${infer N extends null}` ?
        N : Str;

    // 字符串转 undefined
type StrToUndefined<Str> = 
    Str extends `${infer Un extends undefined}` ?
        Un : Str;

type TestStrToUndefined = StrToUndefined<'undefined'>
type TestStrToNull = StrToNull<'null'>

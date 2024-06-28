/**
 * 类型编程 复习
 * 
 * 类型体操顺口溜
 * 模式匹配做提取，重新构造做变换
 * 递归复用做循环，数组长度做计数
 * 联合分散可简化，特殊特性要记清
 * 基础扎实套路熟，类型体操可通关
 * 
 * 
 */

/**
 * 
 * 模式匹配做提取
 * 就像字符串可以通过正则提取子串一样，TypeScript 的类型也可以通过匹配一个模式类型来提取部分类型到 infer 声明的局部变量中返回
 * */ 
/**
 * 提取函数返回值类型
 * 
 */

type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType ? 
    ReturnType : never;

type ReturnTypResult = GetReturnType<(name: string) => 100>;

/**
 * 
 * 重新构造做变换
 * TypeScript 类型系统可以通过 type 声明类型变量，通过 infer 声明局部变量
 * 类型参数在类型编程中也相当于局部变量，但是它们都不能做修改，想要对类型做变换只能构造一个新的类型，在构造的过程中做过滤和转换
 * 
 * 
 */

/**
 * 
 * 将对象索引值变成大写
 * 
 */
type UppercaseKey<Obj extends Record<string, any>> = {
    [key in keyof Obj as Uppercase<key & string>]: Obj[key]
}

type UppercaseKeyResult = UppercaseKey<{name: 'jerry', age: 25}>


/**
 * 
 * 递归复用做循环
 * 在 TypeScript 类型编程中，遇到数量不确定问题时，
 * 就要条件反射的想到递归，每次只处理一个类型，剩下的放到下次递归，直到满足结束条件，就处理完了所有的类型。
 * 
 */

/**
 * 
 * 将长度不确定的字符串转换为联合类型
 * 
 */
type StringToUnion<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
        First | StringToUnion<Rest> : never;

type StringToUnionResult = StringToUnion<'abcd'>;

/**
 * 
 * 数组长度做计数
 * TypeScript 类型系统没有加减乘除运算符
 * 但是可以构造不同的数组再取 length 来得到相应的结果。这样就把数值运算转为了数组类型的构造和提取
 * 
 */


/**
 * 
 * 构建指定长度的数组
 * 
 */

type BuildArray<
    Length extends number,
    Ele = unknown,
    Arr extends unknown[] = []
    > = 
    Arr['length'] extends Length ?
        Arr : BuildArray<Length, Ele, [Ele, ...Arr]>;


/**
 * 
 * 实现减法
 * 
 */

type Subtract<Num1 extends number, Num2 extends number> = 
    BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest] ?
        Rest['length'] : never;


type SubtractResult1 = Subtract<19, 2>;

/**
 * 
 * 联合分散可简化
 * TypeScript 对联合类型做了特殊处理
 * 当遇到字符串类型或者作为类型参数出现在条件类型左边的时候
 * 会分散成单个的类型传入做计算，最后把计算结果合并为联合类型
 * 
 */

type UppercaseA<Item extends string> = 
    Item extends 'a' ? Uppercase<Item> : Item;


type UppercaseAUnionResult = UppercaseA<'a' | 'b' | 'c'>;

// 对于联合类型的判断
// 联合类型做为类型参数直接出现在条件类型左边的时候就会触发 distributive 特性，如果不是直接出现在左边的时候不会触发
// 所以， A 是单个类型、B 是整个联合类型。通过比较 A 和 B 来判断联合类型
type IsUnion<A, B = A> = 
    A extends A ?
        [B] extends [A] ?
            false : true 
            : never;

type IsUnionResult1 = IsUnion<'a'>;
type IsUnionResult2 = IsUnion<'a' | 'b' | 'c'>;

/**
 * 
 * 特殊特性要记清
 * 会了提取、构造、递归、数组长度计数、联合类型分散这 5 个套路以后
 * 各种类型体操都能写，但是有一些特殊类型的判断需要根据它的特性来，所以要重点记一下这些特性
 * 
 */

// 判断 any 类型
// any 和任何类型交叉都是 any，可以利用这个特性判断
type IsAny<T> = 'dong' extends ('guang' & T) ? true : false;

type IsAnyResult = IsAny<any>;
type IsAnyResult2 = IsAny<100>;

// 比如说，对象中的索引一般是 string，而可索引签名不是，可以根据这个来过滤掉可索引签名
type RemoveIndexSignature<Obj extends Record<string, any>> = {
    [
        Key in keyof Obj as Key extends `${infer Str}` ? Str : never
    ] : Obj[Key]
}

type RemoveIndexSignatureResult = RemoveIndexSignature<{[key: string]: any, sleep: () => void, age: string, name: string}>



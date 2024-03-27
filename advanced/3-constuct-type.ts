/**
 * 
 * TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造
 * 
 * 
 * 
 */

/**
 * 
 * 数组类型的重新构建
 * 
 */

/**
 * Push
 * 
 * 向元组类型添加新的类型
 * 
 * 
 */

// type 定义的类型是不可以修改的，如果我想往 tuple 中添加新的类型，那么需要重新生成一个类型
type tuple = [1, 2, 3];

// 类型参数 Arr 是要修改的数组/元组类型，元素的类型任意，也就是 unknown
// 返回值是 Arr 已有的元素加上 Ele 构造的新的元组类型
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];

type PushResult = Push<tuple, 4>;

/**
 * 
 * Unshift
 * 向元组类型添加新的类型
 * 
 */

type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr];

type UnshiftResult = Unshift<[1, 2, 3], 0>;


/**
 * Zip
 * 
 * 将两个元组类型合并
 * 
 * type tuple1 = [1,2];
 * type tuple2 = ['guang', 'dong'];
 * 
 * 合并为：
 * type tuple = [[1, 'guang'], [2, 'dong']]
 * 
 */

// 两个类型参数 One、Other 是两个元组，类型是 [unknown, unknown]，代表 2 个任意类型的元素构成的元组。

// 通过 infer 分别提取 One 和 Other 的元素到 infer 声明的局部变量 OneFirst、OneSecond、OtherFirst、OtherSecond 里
// 最后将局部变量组合起来成为一个新的元组
type Zip<One extends [unknown, unknown], Other extends [unknown, unknown]> = 
    One extends [infer OneFirst, infer OneSecond] ?
        Other extends [infer OtherFirst, infer OtherSecond] ?
            [[OneFirst, OtherFirst], [OneSecond, OtherSecond]] :
                [] :
                []


type ZipResult = Zip<[1, 2], ['guang', 'dong']>;


// 对于任意长度的元组，需要使用递归
// 先提取一个，将剩余的元素进行递归处理

// 类型参数 One、Other 声明为 unknown[]，也就是元素个数任意，类型任意的数组。

// 每次提取 One 和 Other 的第一个元素 OneFirst、OtherFirst，剩余的放到 OneRest、OtherRest 里

// 用 OneFirst、OtherFirst 构造成新的元组的一个元素，剩余元素继续递归处理 OneRest、OtherRest
type Zip2<One extends unknown[], Other extends unknown[]> = 
    One extends [infer OneFirst, ...infer OneRest] ?
        Other extends [infer OtherFirst, ...infer OtherRest] ?
            [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>] :
                [] :
                []


type Zip2Result = Zip2<[1, 2, 3, 4, 5], ['h', 'e', 'l', 'l', 'o']>;


/**
 * 
 * 字符串类型的重新构造
 * 
 */

/**
 * CapitalizeStr
 * 将字符串的首字母大写
 * 从已有的字符串类型中提取出一些部分字符串，经过一系列变换，构造成新的字符串类型
 */

// 我们声明了类型参数 Str 是要处理的字符串类型，通过 extends 约束为 string
// 通过 infer 提取出首个字符到局部变量 First，提取后面的字符到局部变量 Rest
// 然后使用 TypeScript 提供的内置高级类型 Uppercase 把首字母转为大写，加上 Rest，构造成新的字符串类型返回。
type CapitalizeStr<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
         `${Uppercase<First>}${Rest}` : Str


type CapitalizeStrResult = CapitalizeStr<'typescript'>;

type Str2Array<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
    [First, ...Str2Array<Rest>] : [];


type Str2ArrayResult = Str2Array<'hello'>


/**
 * 
 * CamelCase
 * 将下划线命名转换为小驼峰命名
 * 
 */

// 类型参数 Str 是待处理的字符串类型，约束为 string。

// 提取 _ 之前和之后的两个字符到 infer 声明的局部变量 Left 和 Right（这里是非贪婪匹配，Right 为 _ 右侧的第一个字符），剩下的字符放到 Rest 里

// 然后把右边的字符 Right 大写，和 Left 构造成新的字符串，剩余的字符 Rest 要继续递归的处理
type CamelCase<Str extends string> = 
    Str extends `${infer Left}_${infer Right}${infer Rest}` ?
    `${Left}${Uppercase<Right>}${CamelCase<Rest>}` : Str;

type CamelCaseResult = CamelCase<'hello_world_my_love'>;


/**
 * 
 * 函数类型的重新构造
 * 
 * 提前函数参数 -> 加入新的参数 -> 构造新的类型
 * 
 */

/**
 * AppendArgument
 * 给函数添加新的参数
 * 
 */

// 类型参数 Func 是待处理的函数类型，通过 extends 约束为 Function，NewArg 是要添加的参数类型
// 通过模式匹配提取参数到 infer 声明的局部变量 Args 中，提取返回值到局部变量 ReturnType 中
// 用 Args 数组添加 NewArg 构造成新的参数类型，结合 ReturnType 构造成新的函数类型返回
type AppendArgument<Func extends Function, NewArg> = 
    Func extends (...args: infer Args) => infer ReturnType ? 
        (...arg: [...Args, NewArg]) => ReturnType : never


type NewFuncType = AppendArgument<(name: string) => number, {age: number}>;


/**
 * 
 * 索引类型的重新构造
 * 索引类型是聚合多个元素的类型，class、对象等都是索引类型，比如这就是一个索引类型：
 * 
 * 
 */

type obj = {
    name: string;
    age: number;
    gender: boolean;
}

/**
 * Mapping
 * 
 * 使用 in 语法取出索引类型 obj 的 key，使用 obj[key] 取出对应的类型，然后就可以进行相应的操作了
 * 
 * 
 * 
 */

// 类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object
// 用 keyof 取出 Obj 的索引，作为新的索引类型的索引，也就是 Key in keyof Obj
// 值的类型可以做变换，这里我们用之前索引类型的值 Obj[Key] 构造成了三个元素的元组类型 [Obj[Key], Obj[Key], Obj[Key]]
type Mapping<Obj extends object> = {
   [key in keyof Obj]: [Obj[key], Obj[key], Obj[key]]
}

type MappingResult = Mapping<{a: 1, b: 2, c: 3}>;

/**
 * UppercaseKey
 * 
 * 除了可以对 Value 做修改，也可以对 Key 做修改，使用 as，这叫做重映射
 * 比如把索引类型的 Key 变为大写
 * 
 * 
 */


// 类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object
// 新的索引类型的索引为 Obj 中的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的
// 通过 Uppercase 把索引 Key 转为大写，因为索引可能为 string、number、symbol 类型，而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分。
// value 保持不变，也就是之前的索引 Key 对应的值的类型 Obj[Key]
type UppercaseKey<Obj extends object> = {
    [Key in keyof Obj  as Uppercase<Key & string>]: Obj[Key]
}

type UppercaseKeyResult = UppercaseKey<{age: 35, no: 10089}>;

// Record 可以用来创建索引类型，那么我们可以使用 Record 创建索引类型，取代 object，实现更加精准的约束

// 约束类型参数 Obj 为 key 为 string，值为任意类型的索引类型
type UppercaseKey2<Obj extends Record<string, any>> = {
    [Key in keyof Obj  as Uppercase<Key & string>]: Obj[Key]
}

type UppercaseKey2Result = UppercaseKey2<{1: 'num'}>;


/**
 * 
 * ToReadonly
 * 索引类型的索引可以添加 readonly 的修饰符，代表只读
 * 那我们就可以实现给索引类型添加 readonly 修饰的高级类型
 * 
 * 
 */


// 通过映射类型构造了新的索引类型，给索引加上了 readonly 的修饰，其余的保持不变
// 索引依然为原来的索引 Key in keyof T，值依然为原来的值 T[Key]
type ToReadonly<T> = {
    readonly [Key in keyof T]: T[Key]
}

type ToReadOnlyResult = ToReadonly<{a: string, b: number}>;


/**
 * 
 * ToPartial
 * 索引类型还可以添加可选修饰符
 * 
 * 
 * 
 */

// 给索引类型添加了 ? 可选修饰符，其余保持不变
type ToPartial<T> = {
    [Key in keyof T]?: T[Key]
}

type PartialResult = ToPartial<{a: string, b: number}>;

/**
 * 
 * ToMutable
 *  
 * 去掉索引类型的只读属性
 * 
 */

type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}

type MutableResult =  ToMutable<{
    readonly name: string;
    age: number;
}>;

/**
 * ToRequired
 * 去掉可选修饰符
 * 
 * 
 */

// 使用 - 符号去掉 ? 的修饰
type ToRequired<T> = {
    [Key in keyof T]-?: T[Key]
}

type RequiredResult = ToRequired<{a?: string, b: number}>;

/**
 * 
 * FilterByValueType
 * 在构造新索引类型的时候根据值的类型做下过滤
 * 
 * 
 */


// 类型参数 Obj 为要处理的索引类型，通过 extends 约束为索引为 string，值为任意类型的索引类型 Record<string, any>

// 类型参数 ValueType 为要过滤出的值的类型

// 构造新的索引类型，索引为 Obj 的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的部分
// 如果原来索引的值 Obj[Key] 是 ValueType 类型，索引依然为之前的索引 Key
// 否则索引设置为 never，never 的索引会在生成新的索引类型时被去掉
// 值保持不变，依然为原来索引的值，也就是 Obj[Key]
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
    [
        Key in keyof Obj as
            Obj[Key] extends ValueType ? Key : never
    ]: Obj[Key]
}

interface Person {
    name: string;
    age: number;
    hobby: string[]
}

type FilterResult = FilterByValueType<Person, string | number>
/**
 * TypeScript 类型系统不支持循环，但支持递归
 * 当处理数量（个数、长度、层数）不固定的类型的时候，
 * 可以只处理一个类型，然后递归的调用自身处理下一个类型
 * 直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果
 * 
 * 
 */

/**
 * Promise 递归调用
 * 
 * 
 * DeepPromiseValueType
 * 
 * 实现一个提取不确定层数的 Promise 中的 value 类型的高级类型
 * 
 */

type TTT = Promise<Promise<Promise<Promise<Record<string, any>>>>>;


// 类型参数 P 是待处理的 Promise，通过 extends 约束为 Promise 类型，value 类型不确定，设为 unknown
// 每次只处理一个类型的提取，也就是通过模式匹配提取出 value 的类型到 infer 声明的局部变量 ValueType 中
// 然后判断如果 ValueType 依然是 Promise类型，就递归处理，因为 DeepPromiseValueType 要求接收的类型就 Promise，所以需要提前处理
// 结束条件就是 ValueType 不为 Promise 类型，那就处理完了所有的层数，返回这时的 ValueType
type DeepPromiseValueType<P extends Promise<unknown>> = 
    P extends Promise<infer ValueType> ?
        ValueType extends Promise<unknown> ? 
            DeepPromiseValueType<ValueType> 
                : ValueType
                    : never

type DeepPromiseResult = DeepPromiseValueType<TTT>;

// 这个高级类型可以进一步简化，就是不限制接收的类型必须为 Promise：
type DeepPromiseValueType2<P> = 
P extends Promise<infer ValueType> ? 
    DeepPromiseValueType2<ValueType> : P


type DeepPromiseResult2 = DeepPromiseValueType2<TTT>;


/**
 * 
 * 数组类型的递归
 * 
 * 
 */

// 将一个数组反转过来：
type arr = [1, 2, 3, 4, 5];
type arr2 = [5, 4, 3, 2, 1];

type ReverseArr<Arr extends unknown[]> = 
    Arr extends [infer one, infer two, infer three, infer four, infer five] ?
    [five, four, three, two, one] : never;

type ReverseArrResult = ReverseArr<arr>;

// 如果数组的长度不确定，那么就需要使用递归
// 类型参数 Arr 为待处理的数组类型，元素类型不确定，也就是 unknown
// 每次只处理一个元素的提取，放到 infer 声明的局部变量 First 里，剩下的放到 Rest 里
// 用 First 作为最后一个元素构造新数组，其余元素递归的取
// 结束条件就是取完所有的元素，也就是不再满足模式匹配的条件，这时候就返回 Arr
type ReverseArr2<Arr extends unknown[]> = 
    Arr extends [...infer Rest, infer Last] ?
        [Last, ...ReverseArr2<Rest>] : Arr;

type ReverseArr2Result = ReverseArr2<[1, 2, 3, 4, 5, 6, 7]>;

/**
 * 
 * Includes
 * 使用递归完成数组中是否包含某个特定元素
 * 
 * 
 */

// 类型参数 Arr 是待查找的数组类型，元素类型任意，也就是 unknown。FindItem 待查找的元素类型
// 每次提取一个元素到 infer 声明的局部变量 First 中，剩余的放到局部变量 Rest
// 判断 First 是否是要查找的元素，也就是和 FindItem 相等，是的话就返回 true，否则继续递归判断下一个元素
// 直到结束条件也就是提取不出下一个元素，这时返回 false
// 相等的判断就是 A 是 B 的子类型并且 B 也是 A 的子类型
// 这样就完成了不确定长度的数组中的元素查找，用递归实现了循环

type Includes<Arr extends unknown[], FindItem> = 
    Arr extends [infer First, ...infer Rest] ?
        IsEqual<First, FindItem> extends true ? true 
            : Includes<Rest, FindItem> 
                : false;


// 判断两个类型是不是相等： A 是 B 的子类型并且 B 也是 A 的子类型
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);

type IncludesResult = Includes<[1, 3, 5, 6], 6>;
type IncludesResult2 = Includes<[1, 3, 5, 6], 0>;


/**
 * RemoveItem
 * 删除数组中指定的元素
 * 
 * 
 */

// 移除与查找类似，首先要找到元素，查找则直接返回 true，而移除则要返回剩下的数组
// 所以，整体思路也是递归查找元素，然后对剩余数组进行拼接

// 参数：
//    1. 类型参数 Arr 是待处理的数组，元素类型任意，也就是 unknown[]
//    2. 类型参数 Item 为待查找的元素类型
//    3. 类型参数 Result 是构造出的新数组，默认值是 []
// 通过模式匹配提取数组中的一个元素的类型，如果是 Item 类型的话就删除，也就是不放入构造的新数组，直接返回之前的 Result
// 否则放入构造的新数组，也就是再构造一个新的数组 [...Result, First]
// 直到模式匹配不再满足，也就是处理完了所有的元素，返回这时候的 Result
// 这样我们就完成了不确定元素个数的数组的某个元素的删除
type RemoveItem<Arr extends unknown[], Item, Result extends unknown[] = []> = 
    Arr extends [infer First, ...infer Rest] ?
        IsEqual<First, Item> extends true ? 
            RemoveItem<Rest, Item, [...Result]>
            : RemoveItem<Rest, Item, [...Result, First]>
                : Result;


type RemoveResult = RemoveItem<[1, 3, 5, 6], 6>;
type RemoveResult2 = RemoveItem<[1, 2, 3, 3, 5, 3, 6], 3>;


/**
 * BuildArray
 * 
 * 使用递归构造一个指定长度和指定元素的数组
 * 
 */

// 参数
//    1. 类型参数 Length 为数组长度，约束为 number
//    2. 类型参数 Ele 为元素类型，默认值为 unknown
//    3. 类型参数 Arr 为构造出的数组，默认值是 []。
// 每次判断下 Arr 的长度是否到了 Length，是的话就返回 Arr，否则在 Arr 上加一个元素，然后递归构造
type BuildArray<
    Length extends number, 
    Ele = unknown, 
    Arr extends unknown[] = []
    > = Arr['length'] extends Length ?
        Arr :
        BuildArray<Length, Ele, [...Arr, Ele]>


type BuildArrReult = BuildArray<5, 1>;


/**
 * 字符串类型的递归
 * 
 * 
 */


// type ReplaceStr<Str extends string, From extends string, To extends string> =
//     Str extends `${infer Prefix}${From}${infer Suffix}` ?
//         `${Prefix}${To}${Suffix}` : Str; 


/**
 * 
 * ReplaceAll
 * 替换字符串中全部的找到的字符
 * 
 */


// 类型参数 Str 是待处理的字符串类型，From 是待替换的字符，To 是替换到的字符
// 通过模式匹配提取 From 左右的字符串到 infer 声明的局部变量 Left 和 Right 里
// 用 Left 和 To 构造新的字符串，剩余的 Right 部分继续递归的替换。
// 结束条件是不再满足模式匹配，也就是没有要替换的元素，这时就直接返回字符串 Str
type ReplaceAll<Str extends string, From extends string, To extends string> = 
    Str extends `${infer Left}${From}${infer Right}` ? 
        `${Left}${To}${ReplaceAll<Right, From, To>}` : Str

// 也就是从左向右依次进行匹配，将匹配到的字符进行替换，同时对匹配字符的右侧进行递归匹配处理
// 将匹配字符的左侧与替换后的字符加上递归处理匹配字符右侧内容组合到一起，就完成了所有匹配字符的替换
// 递归终止条件是：没有可匹配的内容

type ReplaceAllResult = ReplaceAll<'go go go, my love', 'go', 'Go'>;


/**
 * 
 * StringToUnion
 * 把字符串字面量类型的每个字符都提取出来组成联合类型，
 * 例如 'dong' 转为 'd' | 'o' | 'n' | 'g'
 * 
 */

// 如果字符串已知长度，可以逐一进行处理：
type StringToUnion1<Str extends string> = 
    Str extends `${infer One}${infer Two}${infer Three}${infer Four}` ?
        One | Two | Three | Four : never;

type StringToUnion1Result = StringToUnion1<'dong'>;

// 字符串长度不固定，则需要使用递归处理
// 类型参数 Str 为待处理的字符串类型，通过 extends 约束为 string
// 通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余的字符放到局部变量 Rest
// 用 First 构造联合类型，剩余的元素组成的字符串 Rest 继续进行递归处理
type StringToUnion<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
        First|StringToUnion<Rest> : never;

// todo 联合类型的顺序与字符串不同，需要探究是为什么
type StringToUnionResult = StringToUnion<'hello'>;
type StringToUnionResult2 = StringToUnion<'yellow'>;
type StringToUnionResult3 = StringToUnion<'world'>;
type StringToUnionResult4 = StringToUnion<'dong'>;

/**
 * ReverseStr
 * 
 * 反转字符串
 * 
 */

type ReverseStr<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
    `${ReverseStr<Rest>}${First}` : Str;


type ReverseStrResult = ReverseStr<'hello'>
type ReverseStrResult2 = ReverseStr<'hello world'>

// 类型参数 Str 为待处理的字符串。类型参数 Result 为构造出的字符，默认值是空串
// 通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余字符放到 Rest
// 用 First 和之前的 Result 构造成新的字符串，把 First 放到前面，因为递归是从左到右处理，那么不断往前插就是把右边的放到了左边，完成了反转的效果
// 以 hello 为例说明匹配过程：
    // 第一次匹配：hello -> First = h，Rest = ello -> ReverseStr2<'ello', 'h'>
    // 第二次匹配：ello -> First = e，Rest = llo -> ReverseStr2<'llo', 'eh'>
    // 第三次匹配：llo -> First = l，Rest = lo -> ReverseStr2<'lo', 'leh'>
    // 第四次匹配：lo -> First = l，Rest = o -> ReverseStr2<'o', 'lleh'>
    // 第五次匹配：o -> First = o，Rest = '' -> ReverseStr2<'', 'olleh'>
    // 第六次匹配：'' -> 模式匹配不满足 -> 返回 Result -> olleh

// 直到模式匹配不满足，就处理完了所有的字符
type ReverseStr2<Str extends string, Result extends string = ''> =
    Str extends `${infer First}${infer Rest}` ?
        ReverseStr2<Rest, `${First}${Result}`> : Result


type ReverseStrResult3 = ReverseStr2<'hello'>
type ReverseStrResult4 = ReverseStr2<'hello world'>

/**
 * 
 * 对象类型的递归
 * DeepReadonly
 * 对象类型的递归，也可以叫做索引类型的递归
 * 
 */

// 将对象属性变为只读属性，但是无法应用于多层对象
type ToReadonly<T> =  {
    readonly [Key in keyof T]: T[Key];
}

type DeepObj = ToReadonly<{a: {b: {c: string}}}>

// 对于层数不确定的索引类型，需要使用递归去处理每个层级的属性
// 类型参数 Obj 是待处理的索引类型，约束为 Record<string, any>，也就是索引为 string，值为任意类型的索引类型
// 索引映射自之前的索引，也就是 Key in keyof Obj，只不过加上了 readonly 的修饰
// 值要做下判断，如果是 object 类型并且还是 Function，那么就直接取之前的值 Obj[Key]
// 如果是 object 类型但不是 Function，那就是说也是一个索引类型，就递归处理 DeepReadonly<Obj[Key]>
// 否则，值不是 object 就直接返回之前的值 Obj[Key]
type DeepReadonly<Obj extends Record<string, any>> = {
    readonly [Key in keyof Obj]: 
        Obj[Key] extends object
            ? Obj[Key] extends Function 
                ? Obj[Key] 
                : DeepReadonly<Obj[Key]>
            : Obj[Key]
}

type obj2 = {
    a: {
        b: {
            c: {
                f: () => 'dong',
                d: {
                    e: {
                        guang: string
                    }
                }
            }
        }
    }
}


type DeepReadonlyResult = DeepReadonly<obj2['a']>;

// 因为 ts 的类型只有被用到的时候才会做计算,
// 所以默认情况下，DeepReadonly 只对第一层进行计算
// 所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，从而触发计算
// Obj extends any 还有额外的好处就是能处理联合类型
type DeepReadonly2<Obj extends Record<string, any>> = 
    Obj extends any ?
    {
        readonly [Key in keyof Obj]: 
            Obj[Key] extends object
                ? Obj[Key] extends Function 
                    ? Obj[Key] 
                    : DeepReadonly2<Obj[Key]>
                : Obj[Key]
    } : never


    type DeepReadonly2Result = DeepReadonly2<obj2>;

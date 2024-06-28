/**
 * 
 * 类型编程 - 综合实战
 * 
 * 
 */

/**
 * 
 * KebabCaseToCamelCase
 * 连字符命名风格的变量名称转换为小驼峰风格的名称
 * 
 * 即：aa-bb-cc 转换为 aaBbCc
 * 
 */

// 类型参数 Str 是待处理的字符串类型，约束为 string
// 通过模式匹配提取 Str 中 - （连字符）分隔的两部分，前面的部分放到 infer 声明的局部变量 First 里，后面的放到 infer 声明的局部变量 Rest 里
// 提取的第一个单词不大写，后面的字符串首字母大写，使用内置类型 Capitalize 将剩余的字符串的首字母大写，将处理后的字符串传入 KebabCaseToCamelCase 中，递归处理
// 如果模式匹配不满足，就返回 Str
type KebabCaseToCamelCase<Str extends string> = 
    Str extends `${infer First}-${infer Rest}` ?
        `${First}${KebabCaseToCamelCase<Capitalize<Rest>>}` 
        : Str

type KebabCaseToCamelCaseResult1 = KebabCaseToCamelCase<'aa-bb-cc'>;
type KebabCaseToCamelCaseResult2 = KebabCaseToCamelCase<'top-level'>;

/**
 * 
 * CamelCaseToKebabCase
* 小驼峰风格的名称转换为连字符命名风格的变量名称
 * 
 * 即：aaBbCc 转换为 aa-bb-cc
 */

// 类型参数 Str 为待处理的字符串类型
// 通过模式匹配提取首个字符到 infer 声明的局部变量 First，剩下的放到 Rest
// 判断下当前字符是否是小写，如果是的话就不需要转换，递归处理后续字符，也就是 `${First}${CamelCaseToKebabCase}`。
// 如果是大写，那就找到了要分割的地方，转为 - 分割的形式，然后把 First 小写，后面的字符串递归的处理，也就是 `-${Lowercase}${CamelCaseToKebabCase}`
// 如果模式匹配不满足，就返回 Str
// 以 topBi 为例，处理流程是：
// 第一次：First = t，Rest = opBi，First 为小写，则进入第一个分支，不对 First 进行处理，对 Rest 进行递归处理，结果是：`${t}${CamelCaseToKebabCase<Rest>}`
// 第二次：First = o，Rest = pBi，First 为小写，则进入第一个分支，不对 First 进行处理，对 Rest 进行递归处理，结果是：`${o}${CamelCaseToKebabCase<Rest>}`
// 第三次：First = p，Rest = Bi，First 为小写，则进入第一个分支，不对 First 进行处理，对 Rest 进行递归处理，结果是：`${p}${CamelCaseToKebabCase<Rest>}`
// 第四次：First = B，Rest = i，First 为大写，则进入第二个分支，对 First 小写处理，对 Rest 进行递归处理，结果是：`-${b}${CamelCaseToKebabCase<Rest>}`
// 第五次：Str 不符合 `${infer First}${infer Rest}` 匹配模式，直接返回 Str，即 i 这个字符串，整体递归结束
// 依次返回每一次递归的结果：top-bi
type CamelCaseToKebabCase<Str extends string> = 
    Str extends `${infer First}${infer Rest}` ?
        First extends Lowercase<First> ?
            `${First}${CamelCaseToKebabCase<Rest>}`
            : `-${Lowercase<First>}${CamelCaseToKebabCase<Rest>}`
        : Str;

type CamelCaseToKebabCaseResult1 = CamelCaseToKebabCase<'topLevel'>;
type CamelCaseToKebabCaseResult2 = CamelCaseToKebabCase<'aaBbCcDddd'>;

/**
 * 
 * Chunk
 * 希望实现这样一个类型：
 * 对数组做分组，比如 [1, 2, 3, 4, 5] 的数组，每两个为 1 组，那就可以分为 1、2 和 3、4 以及 5 这三个 Chunk
 * 
 * 
 */


// 类型参数 Arr 为待处理的数组类型，约束为 unknown。类型参数 ItemLen 是每个分组的长度
// 后两个类型参数是用于保存中间结果的：类型参数 CurItem 是当前的分组，默认值 []，类型参数 Res 是结果数组，默认值 []
// 通过模式匹配提取 Arr 中的首个元素到 infer 声明的局部变量 First 里，剩下的放到 Rest 里
// 通过 CurItem 的 length 判断是否到了每个分组要求的长度 ItemLen

// 如果CurItem 中的元素数量够了，就把 CurItem 加到当前结果 Res 里，也就是 [...Res, CurItem]，然后开启一个新分组，也就是 [First]
// 如果没到，那就继续构造当前分组，也就是 [...CurItem, First]，当前结果不变，也就是 Res
// 这样递归的处理，直到不满足模式匹配，那就把当前 CurItem 也放到结果里返回，也就是 [...Res, CurItem]

// 以 [1, 2, 3]，分组长度 2 为例：
// 第一次：First = 1，rest = [2, 3]，CurItem 为空，长度为 0，所以需要构建分组，即走入第二分支。此时传入 Chunk 的内容为：Chunk<[2, 3], 2, [1], []>
// 第二次：First = 2，rest = [3]，CurItem = [1]，长度为 1，小于指定的分组长度，继续往 CurItem 中添加元素，即走入第二分支。此时传入 Chunk 的内容为：Chunk<[3], 2, [1, 2], []>
// 第三次：First = 3，rest = []，CurItem = [1, 2]，长度为 2，等于指定的分组长度，走第一个分支。需要构建一个新的 CurItem，所以将 First 的放到一个新数组内，将 原来的 CurItem 与 Res 组合成新的 Res，此时传入 Chunk 的内容为：Chunk<[], 2, [3], [[1, 2]]>
// 第四次：因为 Arr = []。匹配不成立，所以直接返回 [...Res, CurItem]，即 [[1, 2], [3]]
type Chunk<
    Arr extends unknown[],
    ItemLen extends number,
    CurItem extends unknown[] = [],
    Res extends unknown[] = [  ]
    > = 
    Arr extends [infer First, ...infer Rest] ?
        CurItem['length'] extends ItemLen ?
            Chunk<Rest, ItemLen, [First], [...Res, CurItem]> 
            : Chunk<Rest, ItemLen, [...CurItem, First], Res>
        : [...Res, CurItem]
    

type MyChunk<
    Arr extends unknown[],
    ItemLen extends number> = Chunk<Arr, ItemLen, [], []>;

type ChunkRes = Chunk<[1, 2, 3], 2, [], []>;
type ChunkRes2 = MyChunk<[1, 2, 3, 4, 5], 3>;


/**
 * 
 * TupleToNestedObject
 * 
 * 根据数组类型，比如 [‘a’, ‘b’, ‘c’] 的元组类型，再加上值的类型 'xxx'，构造出这样的索引类型：
 * 
 * {
 *    a: {
 *        b: {
 *            c: 'xxx'
 *         }
 *     }
 * }
 * 
 * 
 * 
 */

// 类型参数 Tuple 为待处理的元组类型，元素类型任意，约束为 unknown[]。类型参数 Value 为值的类型
// 通过模式匹配提取首个元素到 infer 声明的局部变量 First，剩下的放到 infer 声明的局部变量 Rest
// 用提取出来的 First 作为 Key 构造新的索引类型，也就是 Key in First，值的类型为 Value，如果 Rest 还有元素的话就递归的构造下一层
// 为什么后面还有个 as Key extends keyof any ? Key : never 的重映射呢
// 因为比如 null、undefined 等类型是不能作为索引类型的 key 的，就需要做下过滤，如果是这些类型，就返回 never，否则返回当前 Key
// 不能作为索引的类型会被过滤掉，因此其后面的值便不会出现了
type TupleToNestedObject<Tuple extends unknown[], Value> = 
    Tuple extends [infer First, ...infer Rest] ?
        {
            [Key in First as Key extends keyof any ? Key : never]: 
                Rest extends unknown[] ? 
                    TupleToNestedObject<Rest, Value> : Value
        }
        : Value;


type TupleToNestedObjectRes = TupleToNestedObject<[1, 2, 3], 'string'>
type TupleToNestedObjectRes2 = TupleToNestedObject<['a', 'b', 'c', 'd'], 100>
type TupleToNestedObjectRes3 = TupleToNestedObject<['a', 'b', number, 'd'], 100>
type TupleToNestedObjectRes4 = TupleToNestedObject<['a', 'b', 'c', string], 100>
type TupleToNestedObjectRes5 = TupleToNestedObject<['a', 'b', 'c', undefined], 100>
type TupleToNestedObjectRes6 = TupleToNestedObject<['a', 'b', null, 'd'], 100>


/**
 * 
 * PartialObjectPropByKeys
 * 
 * 我们想实现这样一个功能：
 * 把一个索引类型的某些 Key 转为 可选的，其余的 Key 不变，
 * 比如
 * interface Dong {
 *     name: string
 *     age: number
 *     address: string
 * }
 * 把 name 和 age 变为可选之后就是这样的：
 * 
 * interface Dong2 {
 *     name?: string
 *     age?: number
 *     address: string 
 * }
 * 
 * 
 * 
 * 
 */

// 使用内置的类型实现 PartialObjectPropByKeys
// 1. Partial 可以将某个索引类型中的 Key 变成可选的
// 2. Pick 可以从某个索引类型中挑选出指定的 Key
// 3. Extract 从联合类型中，提取出指定的值
// 4. Omit 忽略索引类型中的某些 Key
// 4. & 合并两个索引类型


// Extract 是用于从 T 的所有索引 keyof T 里取出 Key 对应的索引的，这样能过滤掉一些 T 没有的索引
// 提取出指定的 Key 以后，使用 Pick 将其从 T 中挑选出来，最后 使用 Partial 将其变成可选的
// Omit 则是直接忽略 T 中指定的 Key，T 剩下的，就是不需要变动的
// 最后将两个类型合并，就得到了将部分 Key 变成可选的最终类型
type PartialObjectPropByKeys<T extends Record<string, any>, K extends keyof any> = 
Partial<Pick<T, Extract<keyof T, K>>> & Omit<T, K>

interface Dong {
    name: string;
    age: number;
    address: string
}

// keyof Dong 可以获取 Dong 这个类型的所有 key，
// Extract 用于提取指定的 key，这样能过滤掉一些 Dong 没有的索引，因此，location 就被过滤掉了
type ExtractDongKey = Extract<keyof Dong, 'name' | 'age' | 'location'>

// 因为 ts 的类型只有在用到的的时候才会去计算，这里并不会去做计算
type PartialObjectPropByKeysResult = PartialObjectPropByKeys<Dong, 'name' | 'age' >

type Copy<T extends Record<string, any>> = {
    [K in keyof T]: T[K]
}

// 使用 Copy 这个类型再做一层映射，当构造新的索引类型的时候，TS 就会做计算：
type PartialObjectPropByKeysResult2 = Copy<PartialObjectPropByKeys<Dong, 'name' | 'age' >>

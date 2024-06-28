/**
 * 函数重载
 * 
 * 
 */

// 使用 declare 声明函数
declare function func(name: string): string;
declare function func(name: number): number;


// 如果有函数的实现，那就不需要使用 declare 关键字
function add(a: string, b: string): string;
function add(a: number, b: number): number;
function add(a: any, b: any) {
    return a + b;
}

const res1 = add(1, 2);
const res2 = add('a', 'b');

// 使用 interface 定义函数重载

interface Func {
    (name: string): string; 
    (name: number): number; 
}

declare const func2: Func;

func2('test');
func2(1);


// 函数类型可以取交叉类型，也就是多种类型都可以，其实也是函数重载

type Func2 = ((name: string) => string) & ((name: number) => number);

declare const func3: Func2;

func3('apple');
func3(100);

/**
 * 
 * UnionToTuple
 * 联合类型转换为元组
 * 
 * 
 */

// ReturnType 获取重载函数返回值
// 取重载函数的 ReturnType 返回的是最后一个重载的返回值类型
type RturnTypeRes1 = ReturnType<typeof func>;
type RturnTypeRes2 = ReturnType<Func>;
type RturnTypeRes3 = ReturnType<Func2>;

// 联合类型转交叉类型
// U extends U 是触发分布式条件类型，构造一个函数类型，通过模式匹配提取参数的类型，利用函数参数的逆变的性质，就能实现联合转交叉
// 因为函数参数的类型要能接收多个类型，那肯定要定义成这些类型的交集，所以会发生逆变，转成交叉类型
type UnionToIntersection<U> = 
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
        ? R
        : never

// 我们对联合类型 T 做下处理，用 T extends any 触发分布式条件类型的特性
// 它会把联合类型的每个类型单独传入做计算，最后把计算结果合并成联合类型
// 把每个类型构造成一个函数类型传入
type UnionToFuncIntersection<T> = UnionToIntersection<T extends any ? () => T : never>;

type UnionToIntersectionResult = UnionToIntersection<'a' | 'b'>;
type UnionToIntersectionResult2 = UnionToIntersection<{a: 100} | {b: 200}>;


type UnionToFuncIntersectionResult = UnionToFuncIntersection<{a: 100} | {b: 200}>;
type UnionToFuncIntersectionResult2 = UnionToFuncIntersection<'apple' | 'banana'>;

type ReturnTypeRes4 = ReturnType<UnionToFuncIntersectionResult>;
type ReturnTypeRes5 = ReturnType<UnionToFuncIntersectionResult2>;

type UnionToTuple<T> = 
    UnionToIntersection<T extends any ? () => T : never> extends () => infer ReturnType ?
        [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType] : [];


type UnionToTupleResult = UnionToTuple<1 | 2 | 3>;
type UnionToTupleResult2 = UnionToTuple<'a' | 'b' | 'c'>;
type UnionToTupleResult3 = UnionToTuple<'a' | 'b' | 'c' | 100>;

/**
 * Join
 * 
 * 有这样一个 join 函数，它是一个高阶函数，第一次调用传入分隔符，返回一个函数，第二次传入多个字符串，然后返回它们 join 之后的结果
 * join('-')('guang', 'and', 'dong') // guang-and-dong
 * 
 * 构造一个 Join 函数的类型，要求精准提示返回值的类型
 * 
 */


// 类型参数 Delimiter 是第一次调用的参数的类型，约束为 string
// join 的返回值是一个函数，也有类型参数
// 类型参数 Items 是返回的函数的参数类型
// 返回的函数类型的返回值是 JoinType 的计算结果，传入两次函数的参数 Delimiter 和 Items
// 这里的 JoinType 的实现就是根据字符串元组构造字符串，用到提取和构造，因为数量不确定，还需要递归
declare function join<Delimiter extends string>(delimiter: Delimiter): <Items extends string[]>(...args: Items) => JoinType<Items, Delimiter>


// 类型参数 Items 和 Delimiter 分别是字符串元组和分割符的类型
// Result 是用于在递归中保存中间结果的
// 通过模式匹配提取 Items 中的第一个元素的类型到 infer 声明的局部变量 First，后面的元素的类型到 Rest
// 构造字符串就是在之前构造出的 Result 的基础上，加上新的一部分 Delimiter 和 First，然后递归的构造。这里提取出的 First 是 unknown 类型，要 & string 转成字符串类型
// 如果不满足模式匹配，也就是构造完了，那就返回 Result，但是因为多加了一个 Delimiter，要去一下
type JoinType<
    Items extends any[], 
    Delimiter extends string,
    Result extends string = ''
    > = Items extends [infer First, ...infer Rest] ?
    JoinType<Rest, Delimiter, `${Result}${Delimiter}${First & string}`> : RemoveFirstDelimiter<Result>

type JoinType2<
    Items extends any[], 
    Delimiter extends string,
    Result extends string = ''
    > = Items extends [infer First, ...infer Rest] ?
    `${First & string}${Delimiter}${JoinType2<Rest, Delimiter, Result>}` : Result;



type JoinType2Result = JoinType2<['a', 'b', 'c', 'd'], '-'>


type RemoveLastDelimiterResult = RemoveLastDelimiter<JoinType2<['a', 'b', 'c', 'd', ], '-'>>

// 去掉字符串的最后一个字符
type RemoveLastDelimiter<Str extends string, Result extends string = ''> = 
    Str extends `${infer First}${infer Rest}` ? Rest extends '' ?  Result : RemoveLastDelimiter<Rest, `${Result}${First}`> : Str;

// 直接去掉字符串的第一个字符
type RemoveFirstDelimiter<Str extends string> = 
    Str extends `${infer _}${infer Rest}` ?
        Rest : Str;




let joinRes = join('-')('a', 'b', 'c')
let joinRes2 = join('/')('a', 'b', 'c')
let joinRes3 = join('~')('a', 'b', 'c')

/**
 * 
 * DeepCamelize
 * 
 * 递归的把索引类型的 key ，由 KebabCase 转成 CamelCase 的
 * 
 * 
 * 
 */

// 举例：
type obj = {
    aaa_bbb: string;
    bbb_ccc: [
        {
            ccc_ddd: string;
        },
        {
            ddd_eee: string;
            eee_fff: {
                fff_ggg: string;
            }
        }
    ]
}

// 转换为：
type DeepCamelizeRes = {
    aaaBbb: string;
    bbbCcc: [{
        cccDdd: string;
    }, {
        dddEee: string;
        eeeFff: {
            fffGgg: string;
        };
    }];
}


// 类型参数 Obj 为待处理的索引类型，约束为 Record<string, any>
// 判断下是否是数组类型，如果是的话，用 CamelizeArr 处理
// 否则就是索引类型，用映射类型的语法来构造新的索引类型
// Key 为之前的 Key，也就是 Key in keyof Obj，但要做一些变化，也就是 as 重映射之后的部分
// 这里的 KebabCase 转 CamelCase 就是提取 _ 之前的部分到 First，之后的部分到 Rest，然后构造新的字符串字面量类型，对 Rest 部分做首字母大写，也就是 Capitialize
// 值的类型 Obj[Key] 要递归的处理，也就是 DeepCamelize<Obj[Key]>
// 其中的 CamelizeArr 的实现就是递归处理每一个元素
type DeepCamelize<Obj extends Record<string, any>> =
    Obj extends unknown[]
        ? CamelizeArr<Obj> 
        : {
            [Key in keyof Obj as Key extends `${infer First}_${infer Rest}` ? `${First}${Capitalize<Rest>}` : Key]: DeepCamelize<Obj[Key]> 
        }


// 通过模式匹配提取 Arr 的第一个元素的类型到 First，剩余元素的类型到 Rest
// 处理 First 放到数组中，剩余的递归处理
type CamelizeArr<Arr> = 
    Arr extends [infer First, ...infer Rest] ?
         [DeepCamelize<First>, ...CamelizeArr<Rest>] : [];
    

type CamelizeArr2<Arr> = 
    Arr extends [infer First, ...infer Rest] ?
              [DeepCamelize2<First>, ...CamelizeArr2<Rest>] : [];
         
     

type DeepCamelize2<Obj extends Record<string, any>> = 
        Obj extends unknown[] ?
            CamelizeArr2<Obj> : Obj extends Record<string, any> ?
            {
                [Key in keyof Obj as KebabCaseToCamelCase<Key & string>]: DeepCamelize2<Obj[Key]>
            } :
            Obj;

type KebabCaseToCamelCase<Str extends string> = 
        Str extends `${infer First}_${infer Rest}` ?
        `${First}${KebabCaseToCamelCase<Capitalize<Rest>>}` : Str;

type KebabCaseToCamelCaseResult = KebabCaseToCamelCase<'aa_bb_cc'>
type DeepCamelizeResult = DeepCamelize<obj>

type obj2 = {
    aa_bb_cc: string;
    dd_ee_aa: {
        f_a_q: {
            fdsfsd: string
        }
    },
    gg_mm_jj: [
        {
            ccc_ddd: string;
        },
        {
            ddd_eee: string;
            eee_fff: {
                fff_ggg: string;
            }
        }
    ]
}

type DeepCamelizeResult2 = DeepCamelize2<obj>
type DeepCamelizeResult3 = DeepCamelize2<obj2>

// type DeepCamelizeResult4 = DeepCamelize2<string>


/**
 * 
 * AllKeyPath
 * 需求是拿到一个索引类型的所有 key 的路径
 * 
 * 
 */

// 现在有这样一个对象：
type Obj = {
    a: {
        b: {
            b1: string
            b2: string
        }
        c: {
            c1: string;
            c2: string;
        }
    },
}

// 期望拿到这样的路径结果：
type res = 'a.b.b1' | 'a.b.b2' | 'a.c.c1' | 'a.c.c2';


// 参数 Obj 是待处理的索引类型，通过 Record<string, any> 约束 
// 用映射类型的语法，遍历 Key，并在 value 部分根据每个 Key 去构造以它为开头的 path
// 因为推导出来的 Key 默认是 unknown，而其实明显是个 string，所以 Key extends string 判断一下，后面的分支里 Key 就都是 string 了
// 如果 Obj[Key] 依然是个索引类型的话，就递归构造，否则，返回当前的 Key
// Key | `${Key}.${AllKeyPath<Obj[Key]>}` 的意义是：将每个 以联合的形式，将 Key 的所有可能路径组合起来
// 我们最终需要的是 value 部分，所以取 [keyof Obj] 的值。keyof Obj 是 key 的联合类型，那么传入之后得到的就是所有 key 对应的 value 的联合类型

// 举个例子：
// obj = {
//     a: {
//         b: {
//             c: string
//         }
//     }
// }

// obj 是一个对象，遍历 obj 的 Key：
// Key = a，Key 为 string，而 obj[Key] 仍然为对象，所有走这个分支： Key | `${Key}.${AllKeyPath<Obj[Key]>}` = a | `a.${AllKeyPath<Obj[a]>}`
// Obj[a] = {
//         b: {
//             c: string
//         }
//     }
// Key = b，Key 为 string，而 obj[Key] 仍然为对象，所以走这个分支： Key | `${Key}.${AllKeyPath<Obj[Key]>}` = b | `b.${AllKeyPath<Obj[b]>}`

//  Obj[b] = {
//      c: string
//  }
// Key = c，Key 为 string，而 obj[Key] 为 string，所以走这个分支：直接返回 Key 值 c

// AllKeyPath 最后一次递归的结果是：
// {
//     c: 'c'
// }[c]
// 结果是：'c'

// 继续向上回溯：
// // {
//     b: 'b' | 'b.c'
// }[b]
// 结果是：'b' | 'b.c'

// 继续向上回溯：
// // {
//     a: 'a' | 'a.b.c'
// }[a]
// 结果是：'a' | 'a.b.c'
// 
// AllKeyPath 中，递归处理对象类型中的每个 Key，其关键是 {...}[keyof obj]，以联合类型的形式，取出构造的对象中的值
// 因为这个值是字符串，所以可以去构造新的字符串：`${Key}.${AllKeyPath<Obj[Key]>}`
// 因此递归才能成立
// 类型编程中，需要递归处理的，需要返回值是统一类型的
type AllKeyPath<Obj extends Record<string, any>> = {
    [Key in keyof Obj]:
        Key extends string ?
            Obj[Key] extends Record<string, any> ?
                Key | `${Key}.${AllKeyPath<Obj[Key]>}` 
                : Key
            : never
}[keyof Obj];


type Obj2 = {
    a: {
        b: {
            b1: string
            b2: string
        }
        c: {
            c1: string;
            c2: string;
        }
    },
    f: {
        g: string
    }
}
type AllKeyPathResult = AllKeyPath<Obj>;
type AllKeyPathResult2 = AllKeyPath<Obj2>;

/**
 * 
 * Defaultize
 * Defaultize 是这样一个高级类型：
 * 对 A、B 两个索引类型做合并，如果是只有 A 中有的不变，如果是 A、B 都有的就变为可选，只有 B 中有的也变为可选
 * 
 * 
 * 
 */

type TypeA = {
    aaa: 111,
    bbb: 222,
    eee: 666
}


type TypeB = {
    aaa: 999,
    bbb: 222,
    ccc: 333
}

// 1. 提取出只有 A 中有的 Key
type TypeAUnique = Pick<TypeA, Exclude<keyof TypeA, keyof TypeB>>;
// 2. 提取出只有 B 中有的 Key
type TypeBUnique = Pick<TypeB, Exclude<keyof TypeB, keyof TypeA>>;
// 3. 将只有 B 中有的 Key 变成可选的
type PartialTypeBUnique = Partial<TypeBUnique>;

// 3. 提取出 A、B 中都有的 Key
type TypeAB1 = Pick<TypeA, Extract<keyof TypeA, keyof TypeB>>;
type TypeAB2 = Pick<TypeB, Extract<keyof TypeB, keyof TypeA>>;

// 4. 将 A 和 B 都有的 Key，变成可选的
type PartialTypeAB1 = Partial<TypeAB1>
type PartialTypeAB2 = Partial<TypeAB2>

// 5. 合并
type DefaultizeType = TypeAUnique & TypeBUnique & PartialTypeAB1 & PartialTypeAB2;

type Copy<T extends Record<string, any>> = {
    [K in keyof T]: T[K]
}

type CopyDefaultizeType = Copy<DefaultizeType>

type Defaultize<A extends Record<string, any>, B extends Record<string, any>>  = 
    Pick<A, Exclude<keyof A, keyof B>> & 
    Partial<Pick<A, Extract<keyof A, keyof B>>> & 
    Partial<Pick<B, Exclude<keyof B, keyof A>>>

type DefaultizeResult = Defaultize<TypeA, TypeB>
type CopyDefaultizeResult = Copy<Defaultize<TypeA, TypeB>>
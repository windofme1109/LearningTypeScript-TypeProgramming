/**
 * 
 * 分布式条件类型
 * 当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候
 * TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。
 * 
 */

type Union = 'a' | 'b' | 'c';

// 把其中的 a 大写，可以这样：
type UppercaseA<Item extends string> = 
    Item extends 'a' ? Uppercase<Item> : Item;


// 我们类型参数 Item 约束为 string，条件类型的判断中也是判断是否是 a，但传入的是联合类型
// 这就是 TypeScript 对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并
type Result = UppercaseA<Union>;


// 对于联合类型的处理，我们无需考虑把每个选项都提取出来递归处理，而是直接按照单一类型进行处理
// TypeScript 会把联合类型中的每个选项进行处理，最后合并这些处理结果，形成一个新的类型

type str = `${Union}~~`;

/**
 * Camelcase
 * 
 * 将下划线命名转换为大驼峰命名
 * 
 */

// 根据下划线对字符串进行划分，提取出下划线左边的单词 Left 和右边的第一个字母 Right，剩下的内容放到 Rest 中
// Left 不变放入新的字符串中，  Right 转换为大写并放入新字符串中，与 Left 进行拼接
// 对于 Rest，则继续进行递归，做相同的处理，直到传入 Camelcase 的字符串不匹配，则直接返
type Camelcase<Item extends string> = 
    Item extends `${infer Left}_${infer Right}${infer Rest}` ?
    `${Left}${Uppercase<Right>}${Camelcase<Rest>}` : Item;


type CamelcaseResult1 = Camelcase<'hello_world_ww'>
type CamelcaseResult2 = Camelcase<'hello'>

// 如果是数组，只需要对数组中的每个元素进行递归处理

type CamelcaseArr<Arr extends unknown[]> = Arr extends [infer First, ...infer Rest] ?
    [Camelcase<First & string>, ...CamelcaseArr<Rest>] : Arr;

type CamelcaseArrResult = CamelcaseArr<['aa_bb_ccc', 'ddd_eee_fff']>

// 对于联合类型的处理和单个字符是一样的
type CamelcaseUnion<Item extends string> = 
    Item extends `${infer Left}_${infer Right}${infer Rest}` ?
    `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}` : Item;


type CamelcaseUnionResult = CamelcaseUnion<'aa_bb_cc' | 'dd_ee' | 'ff_gg'>

// 判断一个类型是不是联合类型
type IsUnion<A, B = A> = 
    A extends A ?
        [B] extends [A] ?
             false : 
             true : 
        never;


// 传入联合类型的时候，返回值为 true
type IsUnionResult = IsUnion<'a' | 'b' | 'c'>
type IsUnionResult2 = IsUnion<['a' | 'b' | 'c']>

// 一个测试
type TestUnion<A, B = A> = A extends A ? {a: A, b: B} : never;

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>;

// 实际上，TestUnionResult 的结果是：
// type TestUnionResult = {
//     a: "a";
//     b: "a" | "b" | "c";
// } | {
//     a: "b";
//     b: "a" | "b" | "c";
// } | {
//     a: "c";
//     b: "a" | "b" | "c";
// }

// 虽然 A 和 B 都是联合类型，但是 属性 a 和属性 b 的值缺不一样
// 这是因为条件类型的左边如果是联合类型，会把每个元素单独传入做计算，而右边的不会
// 因为 A 在条件类型的左边，所以会把联合类型的每个元素单独传入做计算，而 B 就会这样处理
// 所以 A 是 'a' 的时候，B 是 'a' | 'b' | 'c'， A 是 'b' 的时候，B 是 'a' | 'b' | 'c' ...

// 所以，上面对于联合类型的判断就很明确了：
// type IsUnion<A, B = A> =
// A extends A
// ? [B] extends [A]
//     ? false
//     : true
// : never

// 类型参数 A、B 是待判断的联合类型，B 默认值为 A，也就是同一个类型
// A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入
// [B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，那么 B 就是整个联合类型
// B 是联合类型整体，而 A 是单个类型，自然不成立，而其它类型没有这种特殊处理，A 和 B 都是同一个，怎么判断都成立

// 以 type TestUnionResult = TestUnion<'a' | 'b' | 'c'>; 为例。判断流程是：
// 'a' extends 'a' 成立，['a' | 'b' | 'c'] extends ['a'] 不成立，返回 true
// 'b' extends 'b' 成立，['a' | 'b' | 'c'] extends ['b'] 不成立，返回 true
// 'c' extends 'c' 成立，['a' | 'b' | 'c'] extends ['c'] 不成立，返回 true

// type TestUnionResult = true | true | true = true

// 当 A 是联合类型时：
// A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义
// A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型

/**
 * 
 * BEM
 * bem 是 css 命名规范，用 block__element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式
 * 
 * 
 */

// 我们可以构造这样一个类型，传入 block、element、modifier，生成符合 BEM 格式的 class 名称
// 其中，element 和 modifier 是数组
// type bemResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']>;
// 它的实现就是三部分的合并，但传入的是数组，要递归遍历取出每一个元素来和其他部分组合，这样要判断的条件和递归的内容比较多
// 而如果是联合类型就不用递归遍历了，因为联合类型遇到字符串也是会单独每个元素单独传入做处理

// 这里需要把数组转换成联合类型
// 数组转联合类型可以这样做：
type union = ['aaa', 'bbb'][number];

// 类型参数 Block、Element、Modifiers 分别是 bem 规范的三部分，其中 Element 和 Modifiers 都可能多个，约束为 string[]
// 构造一个字符串类型，其中 Element 和 Modifiers 通过索引访问来变为联合类型，这一步操作很关键，将数组转换为联合类型，这样可以触发分布式条件类型的特性
// 字符串类型中遇到联合类型的时候，会每个元素单独传入计算
type BEM<Block extends string, Element extends string[], Modifier extends string[]> = 
    `${Block}__${Element[number]}--${Modifier[number]}`


type BEMTestResult = BEM<'container', ['title', 'text'], ['success', 'warning']>;

/**
 * 
 * AllCombinations
 * 我们再来实现一个全组合的高级类型，也是联合类型相关的：
 * 希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'
 * 这种全组合问题的实现思路就是两两组合，组合出的字符串再和其他字符串两两组和：
 * 比如 'A' | 'B' | 'c'，就是 A 和 B、C 组合，B 和 A、C 组合，C 和 A、B 组合。然后组合出来的字符串再和其他字符串组合
 * 
 * 实际上，是一个全排列
 * 
 * 
 */

// 先实现一个两个全排列的类型：
// A 和 B 的全排列：A | B | AB |BA

type Combination<A extends string, B extends string> = 
    A | B | `${A}${B}` | `${B}${A}`


type TestCombination = Combination<'a', 'b'>;

// 类型参数 A、B 是待组合的两个联合类型，B 默认是 A 也就是同一个
// A extends A 的意义就是让联合类型每个类型单独传入做处理，这样就实现了单独处理联合类型中的每个元素
// A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 Combination<A, B 去掉 A 以后的所有组合>
// 而 B 去掉 A 以后的所有组合就是 AllCombinations<Exclude<B, A>>，所以全组合就是 Combination<A, AllCombinations<Exclude<B, A>>>
// A 是单独的一个元素，B 是联合类型，所以可以使用 Exclude<B, A> 获取除了 A 以外的联合类型
// 那么能实现全排列的高级类型就是：
// 
type AllCombinations<A extends string, B extends string = A> = 
    A extends A ?
        Combination<A, AllCombinations<Exclude<B, A>>> :
        never;


type AllCombinationsResult = AllCombinations<'a' | 'b' | 'c' | 'd'>

// 联合类型中的每个类型都是相互独立的
// TypeScript 对它做了特殊处理
//  也就是遇到字符串类型、条件类型的时候会把每个类型单独传入做计算，最后把每个类型的计算结果合并成联合类型。
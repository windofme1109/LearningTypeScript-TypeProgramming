/**
 * 使用数组长度进行计数
 * 
 * ts 类型系统本身没有加减乘除运算符，怎么做数值运算呢
 * ts 类型系统提供了获取数组长度的方式
 * 那么实际上，可以通过构造指定长度的数组，然后对数组进行操作，如拼接、截取等，最后获取新的数组的长度，从而实现对数值的操作
 * 
 */

type num1 = [unknown, unknown]['length'];
type num2 = [unknown, unknown, unknown]['length'];
type num3 = [unknown, unknown, unknown, unknown]['length'];


// TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造

/**
 * 数组长度实现加减乘除
 * 
 * 
 */

/**
 * 
 * Add
 * 我们知道了数值计算要转换为对数组类型的操作，那么加法的实现很容易想到：
 * 构造两个数组，然后合并成一个，取 length
 * 比如 3 + 2，就是构造一个长度为 3 的数组类型，再构造一个长度为 2 的数组类型，然后合并成一个数组，取 length
 * 
 * 
 */

// 先实现构造指定长度的数组

type BuildArray2<Length extends number, Ele = unknown, Result extends unknown[] = []> =
    Result['length'] extends Length ?
        Result : BuildArray2<Length, Ele, [Ele, ...Result]>


type arr1 = BuildArray2<5>

// 构造 Add
type Add<Num1 extends number, Num2 extends number> = 
    [...BuildArray2<Num1>, ...BuildArray2<Num2>]['length']


type AddResult1 = Add<10, 30>

/**
 * 
 * Subtract
 * 减法是从数值中去掉一部分，可以通过数组类型的提取来实现
 * 比如 3 是 [unknown, unknown, unknown] 的数组类型，提取出 2 个元素之后，剩下的数组再取 length 就是 1
 * 这样就实现了 3 - 2 = 1
 * 
 */


// 类型参数 Num1、Num2 分别是被减数和减数，通过 extends 约束为 number
// 构造 Num1 长度的数组，通过模式匹配提取出 Num2 长度个元素，剩下的放到 infer 声明的局部变量 Rest 里
// 取 Rest 的长度，就是最终的结果
// 要求：Num1 >= Num2
type Subtract<Num1 extends number, Num2 extends number> = 
    BuildArray2<Num1> extends [...BuildArray2<Num2>, ...infer Rest] ?
        Rest['length'] : never;


type SubtractResult = Subtract<18, 5>;

/**
 * 
 * Multiply
 * 
 * 将乘法转换为累加
 * 
 */

// 类型参数 Num1 和 Num2 分别是被加数和加数
// 因为乘法是多个加法结果的累加，我们加了一个类型参数 ResultArr 来保存中间结果，默认值是 []，相当于从 0 开始加
// 每加一次就把 Num2 减一，直到 Num2 为 0，就代表加完了
// 加的过程就是往 ResultArr 数组中放 Num1 个元素
// 这样递归的进行累加，也就是递归的往 ResultArr 中放元素
// 最后取 ResultArr 的 length 就是乘法的结果
// 注意： Num1 和 Num2 必须为 大于正整数
type Multiply<Num1 extends number, Num2 extends number, ResultArr extends unknown[] = []> =
    Num2 extends 0 ?
        ResultArr['length'] : Multiply<Num1, Subtract<Num2, 1>, [...BuildArray2<Num1>, ...ResultArr]>


type MultiplyResult = Multiply<5, 6>;
type MultiplyResult2 = Multiply<50, 6>;
type MultiplyResult3 = Multiply<12, 8>;

/**
 * 
 * Divide
 * 乘法是加法的累计
 * 那么除法也可以看做是减法的累计
 * 例如：9 ➗ 3，可以理解为是 9 不断减 3，直到为 0，一共减了多少次，就是我们最终需要的结果
 * 
 * 
 */

// 类型参数 Num1 和 Num2 分别是被减数和减数
// 类型参数 CountArr 是用来记录减了几次的累加数组
// 如果 Num1 减到了 0 ，那么这时候减了几次就是除法结果，也就是 CountArr['length']
// 否则继续递归的减，让 Num1 减去 Num2，并且 CountArr 多加一个元素代表又减了一次
// 当 Num1 为 0 的时候，CountArr 的长度就是除法的最终结果
// 注意：Num1 为被除数，Num2 为除数，只能实现整除
type Divide<
    Num1 extends number,
    Num2 extends number,
    CountArr extends unknown[] = []
> = 
    Num1 extends 0 ?
        CountArr['length'] : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>

type   DivideResult1 = Divide<9, 3>
type   DivideResult2 = Divide<12, 3>
type   DivideResult3 = Divide<100, 10>


/**
 * 
 * 数组长度实现计数
 * 
 * StrLen
 * 数组长度可以取 length 来得到，但是字符串类型不能取 length，所以我们来实现一个求字符串长度的高级类型
 * 字符串长度不确定，明显要用递归。每次取一个并计数，直到取完，就是字符串长度
 * 
 * 
 * 
 * 
 */

// type StrLen<Str extends string, ResultArr extends unknown[] = []> = 
//     Str extends `${infer First}${infer Rest}` ?
//         StrLen<Rest, [unknown, ...ResultArr]> : ResultArr['length']

// 类型参数 Str 是待处理的字符串。类型参数 CountArr 是做计数的数组，默认值 [] 代表从 0 开始
// 每次通过模式匹配提取去掉一个字符之后的剩余字符串，并且往计数数组里多放入一个元素。递归进行取字符和计数
// 如果模式匹配不满足，代表计数结束，返回计数数组的长度 CountArr['length']
type StrLen<Str extends string, CountArr extends unknown[] = []> = 
    Str extends `${string}${infer Rest}` ?
        StrLen<Rest, [unknown, ...CountArr]> : CountArr['length']



type StrLenResult1 = StrLen<''>
type StrLenResult2 = StrLen<'hello'>

/**
 * 
 * GreaterThan
 * 比较大小
 * 一个数组类型中不断放入元素取长度，如果先到了 A，那就是 B 大，否则是 A 大
 * 
 */


// 类型参数 Num1 和 Num2 是待比较的两个数
// 类型参数 CountArr 是计数用的，会不断累加，默认值是 [] 代表从 0 开始
// 如果 Num1 extends Num2 成立，代表相等，直接返回 false
// 否则判断计数数组的长度，如果先到了 Num2，说明 Num2 小，则 Num1 比 Num2 大，返回 true
// 反之，如果先到了 Num1，那么就是 Num2 大，返回 false
// 如果都没到就往计数数组 CountArr 中放入一个元素，继续递归
// 这样就实现了数值比较
// 注意，只能实现整数之间的比较
type GreaterThan<
    Num1 extends number,
    Num2 extends number,
    CountArr extends unknown[] = []
> = 
    Num1 extends Num2 ?
        false : CountArr['length'] extends Num2 ?
            true : CountArr['length'] extends Num1 ?
                false : GreaterThan<Num1, Num2, [unknown, ...CountArr]>

type GreaterThanResult1 = GreaterThan<4, 5>
type GreaterThanResult2 = GreaterThan<10, 5>
type GreaterThanResult3 = GreaterThan<4, 4>


/**
 * Fibonacci
 * 斐波那契数列
 * 
 * Fibonacci 数列是 1、1、2、3、5、8、13、21、34、…… 这样的数列，有当前的数是前两个数的和的规律
 * 
 * 递推公式为：
 *     F(0) = 0，F(1) = 1, 
 *     F(n) = F(n - 1) + F(n - 2)（n ≥ 2，n ∈ N*）
 * 注意 0 不是第一项，而是第 0 项
 * 也就是递归的加法，在 TypeScript 类型编程里用构造数组来实现这种加法
 * 
 * 
 */


// 类型参数 PrevArr 是代表之前的累加值的数组。类型参数 CurrentArr 是代表当前数值的数组
// 类型参数 IndexArr 用于记录 index，每次递归加一，默认值是 []，代表从 0 开始
// 类型参数 Num 代表求数列的第几个数
// 判断当前 index 也就是 IndexArr['length'] 是否到了 Num，到了就返回当前的数值 CurrentArr['length']
// 否则求出当前 index 对应的数值，用之前的数加上当前的数 [...PrevArr, ... CurrentArr]
// 然后继续递归，index + 1，也就是 [...IndexArr, unknown]
type FibonacciLoop<
    PrevArr extends unknown[], 
    CurrentArr extends unknown[], 
    IndexArr extends unknown[] = [], 
    Num extends number = 1,
>  = IndexArr['length'] extends Num ?
        CurrentArr['length'] :
            FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [unknown, ...IndexArr], Num>



type FibLoop<Prev extends unknown[], Cur extends unknown[], IndexArr extends unknown[] = [], Num extends number = 1> =
    IndexArr['length'] extends Num ?
        Cur['length'] : FibLoop<Cur, [...Cur, ...Prev], [unknown, ...IndexArr], Num>


/**
 * 
 * 由 js 递归求斐波那契数列转换而来的方式
 * 
 */
type FibLoop2<Prev extends unknown[], Cur extends unknown[], IndexArr extends unknown[], Num extends number = 1> =
    Num extends 0 ? 0
        : Num extends 1 ? 1
            : IndexArr['length'] extends Num ?
                Cur['length'] : FibLoop2<Cur, [...Cur, ...Prev], [...IndexArr, unknown], Num>
    

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;


// 这里给 Prev 设置 1 的原因是：
// 对于斐波那契数列而言，n = 0，Fib(0) = 0，n = 1，Fib(1) = 1，n = 2，Fib(2) = 1
// 我们必须兼容 0 和 1 这两种情况
// 因为用来计数的 IndexArr 起始长度为 0，Cur 表示当前的数字，即需要返回的数字
// 那么当 Num 为 0 的时候, IndexArr 的长度与 Num 匹配，则直接返回 Cur，Cur 得为 0，所以 Cur 的默认值需要为 []
// 而 Num 为 1 时，IndexArr 的长度与 Num 不匹配，所以需要进行递归，而这一次递归传入的 Cur 为 [...Prev, ...Cur]
// 而经过一次递归以后，IndexArr 的长度为 1，与 Num 匹配，则需要返回当前 Cur 的结果，也就是 1
// 而初始化的 Cur 为 []，为了保证这一次递归返回的结果为 1，则需设置 Prev 初始值为 [1]，则 [...Prev, ...Cur] = [1]
type Fibonacci2<Num extends number> = FibLoop<[1], [], [], Num>;

// 对 n 为 0 和 n 为 1 的情况进行特殊处理，递归从索引为 2 开始，所以，需要设置 IndexArr 为 [unknown]，长度为 1，保证从 2 开始进行递归
// 而 Prev 和 Cur 分别设置为 [] 和 [1]，即设置 n = 0，Fib(0) = 0，n = 1，Fib(1) = 1
// 从 n = 2 开始，即可应用公式：F(n) = F(n - 1) + F(n - 2)
type Fibonacci3<Num extends number> = FibLoop2<[], [1], [unknown], Num>;

// 1 1 2 3 5 8 13 21 34 55
type FibonacciLoopResult1 = Fibonacci<2>

type FibonacciLoopResult2 = Fibonacci2<10>

type FibonacciLoopResult3 = Fibonacci3<10>

// 上面使用 递归方式计算斐波那契数列类似于下面这种方式：
let prev  = 0;
let current = 1;
let next = current;
for (let i = 1; i <= 8; i++) {
    let temp = current;
    current = current + prev;
    prev = temp;
   
}



console.log(current)

function fib(n) {
    if (n <= 1) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
}
/**
 * 模式匹配
 * 
 * Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，
 * 结果保存到通过 infer 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型
 */

type GetValueType<P> = P extends Promise<infer Value> ? Value : never;

type GetValueResult1 = GetValueType<Promise<'qin'>>;
type GetValueResult2 = GetValueType<Promise<{a: string, b: number}>>;


/**
 * 
 * 数组类型
 * 1. 提取数组的第一个元素 First
 * 
 */

// Arr extends unknown[] 表示 Arr 只能是数组
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never;
// type TestArr = [1, 2, 3];
type TestArr = [{a: 100}, 2, 3];
type FirstType = GetFirst<TestArr>;
type FirstType2 = GetFirst<[]>;


// any 可以接收任意类型
let uncertain: any = 'Hello world'!;
uncertain = 5;
uncertain = { hello: () => 'Hello world!' };
uncertain = [1, 2, 3]

// any 可以赋值给任意类型（除了 never）
let a: string = uncertain;
let b: number = uncertain;
let f: unknown = uncertain;

// any 使用属性访问、元素访问、函数调用
// uncertain.hello();
// uncertain[8];


// 任何类型可以分配给 unknown（可以接收任意类型）
let unkonwnVal: unknown = 'Hello World';
unkonwnVal = 5;

// 不能把 unkonwn 赋值给其他类型（除了 any）
// let c: string = unkonwnVal;
// let d: object = unkonwnVal;
let e: any = unkonwnVal;
// unknown 在未进行类型收窄时，不能使用属性访问、元素访问、函数调用
// unkonwnVal.hello();

// unkonwn 比 any 更安全
// 类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量。

/**
 * 提取最后一个元素
 * 
 */
type GetLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last] ? Last : never;

type Arr2 = [1, 4, 5];

type Last = GetLast<Arr2>;

/**
 * 
 * 提取数组的剩余元素
 * 
 */

// 1. Arr 是空数组，直接返回（这里对空数据进行了单独判断）
// 2. Arr 不是空数组，匹配除了最后一个元素以外的元素
type PopArr<Arr extends unknown[]> = 
    Arr extends [] ? [] 
        : Arr extends [...infer Rest, unknown] ? Rest : never;

// type PopArr<Arr extends unknown[]> = Arr extends [...infer Rest, unknown] ? Rest : [];


type PopResult = PopArr<[1, 2, 3]>;
type PopResult2 = PopArr<[]>;
// 类型错误
// type PopResult3 = PopArr<{}>;

type ShiftArr<Arr extends unknown[]> = 
    Arr extends [] ? [] 
        : Arr extends [unknown, ...infer Rest] ? Rest : never;

type ShiftResult = ShiftArr<[1, 2, 3, 4]>;
type ShiftResult2 = ShiftArr<[]>;

/**
 * 字符串类型匹配
 * 字符串类型也同样可以做模式匹配，匹配一个模式字符串，把需要提取的部分放到 infer 声明的局部变量里
 * 
 */

/**
 * 
 * StartsWith
 * 判断字符串是否以某个前缀开头
 * 
 */

// 需要声明字符串 Str、匹配的前缀 Prefix 两个类型参数，它们都是 string
// 用 Str 去匹配一个模式类型，模式类型的前缀是 Prefix，后面是任意的 string，如果匹配返回 true，否则返回 false
// Str 只要在 Prefix 的位置匹配 Prefix 即可
type StartsWith<Str extends string, Prefix extends string> = 
    Str extends `${Prefix}${string}` ? true : false;

// 匹配
type StartsWithResut = StartsWith<'gogogogogogo','gogo'>;
// 不匹配
type StartsWithResut2 = StartsWith<'gogogogogogo','ggo'>;

/**
 * 字符串可以匹配一个模式类型，提取想要的部分，自然也可以用这些再构成一个新的类型
 * 
 */

/**
 * Replace
 * 
 * 字符串内容替换
 * 
 */

// 参数：
// 1. 声明要替换的字符串 Str
// 2. 待替换的字符串 From
// 3. 替换成的字符串 To

// 用 Str 去匹配模式串，模式串由 From 和之前之后的字符串构成
// 把之前之后的字符串放到通过 infer 声明的局部变量 Prefix、Suffix 里

// 用 Prefix、Suffix 加上替换到的字符串 To 构造成新的字符串类型返回

// 核心是 infer 推断 From 前后的内容，优先匹配 From，然后再去推断 From 前后的内容
type Replace<Str extends string, From extends string, To extends string> = 
    Str extends `${infer Prefix}${From}${infer Suffix}` ?
    `${Prefix}${To}${Suffix}` : Str;

// 匹配
type ReplaceResult = Replace<'Welcome To China', 'China', 'Beijing'>;
type ReplaceResult2 = Replace<'Welcome To China', 'To', '2'>;

// 不匹配
type ReplaceResult3 = Replace<'test', 'b', 'a'>;

/**
 * 
 * Trim
 * 去除字符串中的空白
 * 因为我们不知道有多少个空白字符，所以只能一个个匹配和去掉，需要递归
 * 
 */

/**
 * TrimRight
 * 
 * 先匹配右侧
 * 
 */

// 参数：类型参数 Str 是要 Trim 的字符串

// 如果 Str 匹配字符串 + 空白字符 (空格、换行、制表符)，那就把字符串放到 infer 声明的局部变量 Rest 里
// 把 Rest 作为类型参数递归 TrimRight，直到不匹配，这时的类型参数 Str 就是处理结果
// 匹配到右侧的一个空白字符，对剩下的部分 Rest 继续进行 TrimRight 操作 
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? 
TrimStrRight<Rest> : Str;

type TrimRightResult = TrimStrRight<'go       '>;

/**
 * TrimStrLeft
 * 
 */
type TrimStrLeft<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? 
TrimStrLeft<Rest> : Str;

type TrimLeftResult = TrimStrLeft<'       Go'>;


// 将 TrimRight 和 TrimLeft 结合就是 Trim：

type TrimStr<Str extends string> = TrimStrLeft<TrimStrRight<Str>>;

type TrimStrResult = TrimStr<'  ggg '>;


/**
 
 * 函数
 * 函数类型进行类型匹配
 * 
 */

/**
 * GetParameters
 * 提取函数参数类型
 * 
 * 函数类型可以通过模式匹配来提取参数类型
 * 
 */

// 类型参数 Func 是要匹配的函数类型，通过 extends 约束为 Function
// Func 和模式类型做匹配，参数类型放到用 infer 声明的局部变量 Args 里，返回值可以是任何类型，用 unknown
// 返回提取到的参数类型 Args

type GetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never;

// 得到的参数类型是一个元祖
type TestParametersResult = GetParameters<(a: string, b: Promise<string>) => number>

/**
 * GetReturnType
 * 提取函数的返回值类型
 * 
 * 
 */

// Func 和模式类型做匹配，提取返回值到通过 infer 声明的局部变量 ReturnType 里返回。
// 参数类型可以是任意类型，也就是 any[]

type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType ? ReturnType : never;

type TestFuncRetrunType = GetReturnType<() => 'sky'>
type TestFuncRetrunType2 = GetReturnType<() => {a: string, b: Promise<number>}>


/**
 * 
 * GetThisParameterType
 * 获取类实例（this）的类型
 * 
 */

class Dong {
    name: string;

    constructor() {
        this.name = "dong";
    }

    hello(this: Dong) {
        return 'hello, I\'m ' + this.name;
    }
}

const dong = new Dong();
dong.hello();

// 可以通过 call、apply、bind 手动改变函数的 this 指向
// 调用的时候，this 就变了，但这里却没有被检查出来 this 指向的错误
// 我们希望在编译的时候检查出 this 指向的错误，解决方法是：
// 在类内部的方法生命中指定 this 的类型
// 注意：需要开启 strictBindCallApply 的编译选项，这个是控制是否按照原函数的类型来检查 bind、call、apply
// dong.hello.call({xxx: 100});

// 对于这种 this 类型，我们也可以提取出来：
// 类型参数 T 是待处理的类型，T 是一个类函数类型，需要使用 typeof 提取
// type tt = typeof dong.hello;
// 则 tt = (this: Dong) => string
// 用 T 匹配一个模式类型，提取 this 的类型到 infer 声明的局部变量 ThisType 中
// 其余的参数是任意类型，也就是 any，返回值也是任意类型
type GetThisParameterType<T> = 
    T extends (this: infer ThisType, ...args: any[]) => any ?
    ThisType : unknown;

type HelloType = GetThisParameterType<typeof dong.hello>;

class Fruit {
    color: string;
    constructor() {
        this.color = '';
    }

    name(size: number) {
        console.log(`fruit\'s color is ${this.color} and size is ${size}`)
    }
}

// GetThisParameterType 只能提取无参数类型的类函数
const fr = new Fruit();
type FrTFuncType = typeof fr.name;
type FrType = GetThisParameterType<typeof fr.name>;

/**
 * 
 * 构造器
 * 构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。
 * 同样，我们也可以通过模式匹配提取构造器的参数和返回值的类型：
 * 
 */

/**
 * 
 * GetInstanceType
 * 构造器类型可以用 interface 声明，使用 new(): xx 的语法
 * 
 */

interface Person {
    name: string
}

// 构造器类型可以通过 interface 声明，使用 new(): xx 的语法
// PersonConstructor 返回的是 Person 类型的实例对象
interface PersonConstructor {
    new(name: string): Person
}

// 类型参数 ConstructorType 是待处理的类型，通过 extends 约束为构造器类型
// 用 ConstructorType 匹配一个模式类型
// 提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType
type GetInstanceType<ConstructorType extends new(...args: any) => any> = 
    ConstructorType extends new(...args: any) => infer InstanceType ?
        InstanceType : any;

interface FruitConstructor {
    new(): Fruit
}


type PersonInstanceType = GetInstanceType<PersonConstructor>;
type FruitInstanceType = GetInstanceType<FruitConstructor>;

/**
 * 
 * GetConstructorParameters
 * GetInstanceType 是提取构造器返回值类型，那同样也可以提取构造器的参数类型
 * 
 */


// 类型参数 ConstructorType 为待处理的类型，通过 extends 约束为构造器类型
// 用 ConstructorType 匹配一个模式类型，然后对 new 函数的参数进行匹配
// 提取参数的部分到 infer 声明的局部变量 ParametersType 里，返回 ParametersType。
type GetConstructorParameters<ConstructorType extends new(...args: any) => any> = 
    ConstructorType extends new(...args: infer ParametersType) => any ?
    ParametersType : any;

type PersonConstructorParamsType = GetConstructorParameters<PersonConstructor>;

/**
 * 索引类型
 * 
 * 索引类型也同样可以用模式匹配提取某个索引的值的类型
 * 
 */

/**
 * 
 * GetRefProps
 * 
 * 提取组件中的 Ref 属性的类型
 * 
 */

// Props 为 待处理的参数类型
// 通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。

// 为什么要做这个判断，是因为：在 ts3.0 里面如果没有对应的索引，Obj[Key] 返回的是 {} 而不是 never，所以这样做下兼容处理
// 如果有 ref 这个索引，就通过 infer 进行提取，然后返回
type GetRefProps<Props> = 
    'ref' extends keyof Props ?
        Props extends {ref?: infer Value | undefined} ?
            Value : 
            never : 
            never


type GetRefPropsResult = GetRefProps<{ref?: 1, name: 'kkk'}>
type GetRefPropsResult2 = GetRefProps<{ref?: undefined, name: 'kkk'}>
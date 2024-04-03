/**
 * 特殊类型的特性
 * TypeScript 类型系统中有些类型比较特殊，比如 any、never、联合类型，比如 class 有 public、protected、private 的属性，比如索引类型有具体的索引和可索引签名，索引还有可选和非可选等等
 * 如果给我们一种类型让我们判断是什么类型，应该怎么做呢？
 * 类型的判断要根据它的特性来，比如判断联合类型就要根据它的 distributive 的特性
 * 
 * 
 */

/**
 * 
 * 判断一个类型是不是 any
 * any 的特性：any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any
 * 
 */

// 这里的 'dong' 和 'guang' 可以换成任意两个不同的类型
// 'guang' & any 一定是 any，那么 任何类型都可分配给 any，即 'dong' extends any 始终成立
type IsAny<T> = 'dong' extends ('guang' & T) ? true : false;

type IsAnyResult = IsAny<any>;
type IsAnyResult2 = IsAny<1>;
type IsAnyResult3 = IsAny<string>;

/**
 * 
 * IsEqual
 * 
 * 
 */

// 之前的判断两个类型是否相等：
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

// 如果我们传入的类型有 any，IsEqual 也会返回 true

type IsEqualAnyResult = IsEqual<1, any>;

// 因为 any 可以是任何类型，任何类型也都是 any，所以当这样写判断不出 any 类型来

// 因此需要换一种类型的写法：
// 注意：这是因为 TS 对这种形式的类型做了特殊处理，是一种 hack 的写法，它的解释要从 TypeScript 源码找答案了
type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type IsEqual2AnyResult = IsEqual2<1, any>;


/**
 * 
 * 
 * IsUnion
 * 
 */

type IsUnion2<A, B = A> = 
    A extends A ?
        [B] extends [A] ?
            false 
            : true 
        : never



type IsUnionResult = IsUnion2<'a' | 'b' | 'c'>
type IsUnionResult2 = IsUnion2<123>

/**
 * 
 * 
 * IsNever
 * 
 * 
 */

type TestNever<T> = T extends number ? 1 : 2;

// T 为 never 的时候，直接返回的就是 never
type TestNeverResult = TestNever<never>

// never 类型可以这样判断
type IsNever<T> = [T] extends [never] ? true : false;

// any 在条件类型中也比较特殊，如果类型参数为 any，会直接返回 trueType 和 falseType 的合并
type TestAny<T> = T extends number ? 1 : 2;

type TestAnyResult = TestNever<any>


/**
 * 
 * IsTuple
 * 
 * 
 */

// 元组类型的 length 是数字字面量，而数组的 length 是 number
type len = [1, 2, 3]['length'];
type len2 = number[]['length'];

// 因此，可以根据 length 属性的类型进行判断
// 类型参数 T 是要判断的类型
// 首先判断 T 是否是数组类型，如果不是则返回 false
// 如果是继续判断 length 属性是否是 number
// 如果是数组并且 length 不是 number 类型，那就代表 T 是元组
type IsTuple<T> = 
    T extends [... params: infer Arr] ?
         NotEqual<Arr['length'], number> 
         : false
        

//  A 是 B 类型，并且 B 也是 A 类型，那么就是同一个类型，返回 false，否则返回 true
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? false : true;


type IsTupleResult = IsTuple<[1, 2, 3]>;
type IsTupleResult2 = IsTuple<Array<number>>;
type IsTupleResult3 = IsTuple<string[]>;

/**
 * 
 * UnionToIntersection
 * 
 * 联合类型转交叉类型
 * 
 */

// 类型之间是有父子关系的，更具体的那个是子类型，比如 A 和 B 的交叉类型 A & B 就是联合类型 A | B 的子类型，因为更具体  
// 如果允许父类型赋值给子类型，就叫做逆变
// 如果允许子类型赋值给父类型，就叫做协变

// 在 TypeScript 中,函数参数是有逆变的性质的，也就是如果参数可能是多个类型，参数类型会变成它们的交叉类型
// 将更范围更大(泛泛)的,转换为范围更小(具体)的

// 类型参数 U 是要转换的联合类型
// U extends U 是为了触发联合类型的 distributive 的性质，让每个类型单独传入做计算，最后合并
// 利用 U 做为参数构造个函数，通过模式匹配取参数的类型
// 结果就是交叉类型
type UnionToIntersection<U> = 
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ?
        R : never;

type UnionToIntersectionResult = UnionToIntersection<{guang: 1} | {dong: 2}>
type UnionToIntersectionResult2 = UnionToIntersection<'a' | 'b'>

// type FuncUnionToIntersection<Func extends Function> = 
//     Func extends (...args: infer P) => any ? P : never;


// type FuncUnionToIntersectionResult = FuncUnionToIntersection<(x: {guang: 1} | {dong: 2}, y: 'a' | 'b') => any>

// 注意：函数参数的逆变性质一般就联合类型转交叉类型会用

/**
 * 
 * 
 * GetOptional
 * 获取索引类型中的可选类型
 * 
 */

// 提取索引类型中的可选索引，主要利用可选索引的特性：可选索引的值为 undefined 和值类型的联合类型
// 例如：
type newObj = {
    name: string;
    age?: number
}

// 那么我们需要构建一个新的索引类型，从中筛选出类型中包含可选字段：
// 类型参数 Obj 为待处理的索引类型，类型约束为索引为 string、值为任意类型的索引类型 Record<string, any>
// 用映射类型的语法重新构造索引类型，索引是之前的索引也就是 Key in keyof Obj，但要做一些过滤，也就是 as 之后的部分
// as 相当于是对 Key 进行判断，符合条件的
// 过滤的方式就是单独取出该索引之后，判断空对象是否是其子类型
type GetOptional<Obj extends Record<string, any>> = 
    {
        [
            Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never
        ]: Obj[Key]
    }
// Pick 是 typescript 内置的一个高级类型，用来从索引类型中挑选出指定的字段
// 可选的意思是这个索引可能没有，没有的时候，那 Pick<Obj, Key> 就是空的，所以 {} extends Pick<Obj, Key> 这个判断成立，这样就能过滤出可选索引
// 值的类型依然是之前的，也就是 Obj[Key]
// 这样，就能过滤出所有可选索引，构造成新的索引类型
type testPick = Pick<newObj, 'age'> extends {} ? true : false;
type testPick2 = Pick<newObj, 'name'>;

type GetOptionalResult = GetOptional<newObj>
type GetOptionalResult2 = GetOptional<{a?: string, b: number, c?: boolean}>;

/**
 * 
 * GetRequired
 * 获取索引类型中的必选字段
 * 
 */

// 如果这个索引是空的，即为 {}，说明这个索引为可选的，那么就将这个字段剔除
type isRequired<Key extends keyof Obj, Obj> = {} extends Pick<Obj, Key> ? never : Key;

type GetRequired<Obj extends Record<string, any>> = {
    [
        Key in keyof Obj as isRequired<Key, Obj>
    ]: Obj[Key]
}

type GetRequiredResult = GetRequired<newObj>;

/**
 * 
 * RemoveIndexSignature
 * 
 * 移除索引类型中，索引签名类型
 * 
 */

// 什么是索引签名呢，举个例子：

// 这里的 sleep 是具体的索引，[key: string]: any 就是可索引签名，代表可以添加任意个 string 类型的索引
type Dong2 = {
    [key: string]: any;
    sleep: () => void;
    age: number
}

// 如果想删除索引类型中的可索引签名呢？
// 同样根据它的性质，索引签名不能构造成字符串字面量类型，因为它没有名字，而其他索引可以
// 删除索引签名可以这样写：
type RemoveIndexSignature<Obj extends Record<string, any>> = 
    {
        [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key]
    }
// 类型参数 Obj 是待处理的索引类型，约束为 Record<string, any>
// 通过映射类型语法构造新的索引类型，索引是之前的索引 Key in keyof Obj，但要做一些过滤，也就是 as 之后的部分
// 如果索引是字符串字面量类型，那么就保留，否则返回 never，代表过滤掉
// 值保持不变，也就是 Obj[Key]


type RemoveIndexSignatureResult = RemoveIndexSignature<Dong2>

/**
 * 
 * ClassPublicProps
 * 提取类中的公共属性
 * 
 */

// 如何过滤出 class 的 public 的属性呢？
// 也同样是根据它的特性：keyof 只能拿到 class 的 public 索引，private 和 protected 的索引会被忽略
// 例如：
class Dong {
    public name: string;
    protected age: number;
    private hobbies: string[];

    constructor() {
        this.name = 'dong';
        this.age = 20;
        this.hobbies = ['sleep', 'eat'];
  }
}

// keyof 只能拿到 name 这个公共属性
type publicKeys = keyof Dong;

// 可以根据这个特性实现对类的公共属性的过滤
// 类型参数 Obj 为带处理的索引类型，类和对象都是索引类型，约束为 Record<string, any>
// 构造新的索引类型，索引是 keyof Obj 过滤出的索引，也就是 public 的索引
// 值保持不变，依然是 Obj[Key]
// 这样就能过滤出 public 的属性
type ClassPublicProps<Obj extends Record<string, any>> = {
    [Key in keyof Obj]: Obj[Key]
}


type ClassPublicPropsResult = ClassPublicProps<Dong>;


/**
 * 
 * as const
 * 将一些类型声明为字面量类型
 * 
 */

// TypeScript 默认推导出来的类型并不是字面量类型

// 例如：
const testObj = {
    a: 1,
    b: 2
}

type testObjType = typeof testObj;
// 推导出来的结果是：
// type testObjType = {
    // a: number;
    // b: number;
// }

const testArr = [1, 2, 3];
type testArrType = typeof testArr;
// 推导出来的结果是：
// type testArrType = number[]

// 但是类型编程很多时候是需要推导出字面量类型的，这时候就需要用 as const
const testObj2 = {
    a: 1,
    b: 2
} as const;

type testObjType2 = typeof testObj2 ;
// 加上了 as const 以后，推导出来的类型就变成了：
// type testObjType2 = {
//     readonly a: 1;
//     readonly b: 2;
// }

// 每个属性前面加了一个 readonly 修饰

const testArr2 = [1, 2, 3] as const;
type testArrType2 = typeof testArr2;
// 推导出来的 testArrType2 类型是：
// type testArrType2 = readonly [1, 2, 3]

// const 是常量的意思，也就是说这个变量首先是一个字面量值，而且还不可修改
// 有字面量和 readonly 两重含义。所以加上 as const 会推导出 readonly 的字面量类型


// 加上 as const 之后推导出来的类型是带有 readonly 修饰的，所以再通过模式匹配提取类型的时候也要加上 readonly 的修饰才行
// 例如：

// testArrType2 带有 readonly 标识，那么对 testArrType2 进行模式匹配的时候，需要加上 readonly 修饰符，否则无法匹配：

// 不加 readonly 修饰符：
type ReverseArr<Arr> = Arr extends [infer A, infer B, infer C] ? [C, B, A] : never;
// 匹配失败，返回 never
type ReverseArrResult = ReverseArr<testArrType2>;


// 加上 reaonly 修饰符
type ReverseArr2<Arr> = Arr extends readonly [infer A, infer B, infer C] ? [C, B, A] : never;
// 匹配成功
type ReverseArrResult2 = ReverseArr2<testArrType2>;


// 总结：
// 1. any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any，可以用这个特性判断 any 类型
// 2. 联合类型作为类型参数出现在条件类型左侧时，会分散成单个类型传入，最后合并
// 3. never 作为类型参数出现在条件类型左侧时，会直接返回 never
// 4. any 作为类型参数出现在条件类型左侧时，会直接返回 trueType 和 falseType 的联合类型
// 5. 元组类型也是数组类型，但 length 是数字字面量，而数组的 length 是 number。可以用来判断元组类型
// 6. 函数参数处会发生逆变，可以用来实现联合类型转交叉类型
// 7. 可选索引的索引可能没有，那 Pick 出来的就可能是 {}，可以用来过滤可选索引，反过来也可以过滤非可选索引
// 8. 索引类型的索引为字符串字面量类型，而可索引签名不是，可以用这个特性过滤掉可索引签名
// 9. keyof 只能拿到 class 的 public 的索引，可以用来过滤出 public 的属性
// 10. 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行
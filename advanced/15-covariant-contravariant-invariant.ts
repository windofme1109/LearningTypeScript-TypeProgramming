/**
 * 
 * TypeScript 中的协变、逆变和不变
 * 
 */


/**
 * 协变（covariant）
 * 
 * 子类型可以赋值给父类型，叫做协变（covariant）
 * 
 */

interface Person {
    name: string;
    age: number;
}


// 显然，Guang 类型是 Person 的子类型，因为 Guang 更具体
interface Guang {
    name: string;
    age: number;
    hobbies: string[]
}

let p1: Person = {
    name: '',
    age: 20
}

let p2: Person = {
    name: '',
    age: 20
}


let g1: Guang = {
    name: '',
    age: 20,
    hobbies: ['play game', 'wrting']
}

let g2: Guang = {
    name: '',
    age: 20,
    hobbies: ['play game', 'wrting']
}

// 子类型的 g1 可以赋值给父类型 p1
p1 = g1;

// 子类型比父类型更具体，p1 使用 Person 约束，g1 Guang 约束
// 那么我们在使用 p1 的时候，只会使用 Person 中的属性，即使将 g1 赋值给 p1，p1 的类型仍然是 Person，TS 确保我们不会访问到 Guang 类型中的属性
// 因此可以放心的将 g1 赋值给 p1，所以这种赋值是类型安全的
console.log(p1)
console.log(p1.age)

// Property 'hobbies' is missing in type 'Person' but required in type 'Guang'
g2 = p2;

/**
 * 
 * 逆变（contravariant）
 * 
 */


let printHobbies: (guang: Guang) => void;

// printHobbies 的参数 Guang 是 printName 参数 Person 的子类型
printHobbies = (guang) => {
    console.log(guang.hobbies);
}

let printName: (person: Person) => void;

printName = (person) => {
    console.log(person.name);
}

// printHobbies 函数声明的时候是按照 Guang 来约束的类型，但实际上函数只用到了父类型 Person 的属性和方法，当然不会有问题，依然是类型安全的
// 这就是逆变，函数的参数有逆变的性质（而返回值是协变的，也就是子类型可以赋值给父类型）
printHobbies = printName;

// printName 函数声明的时候，其参数是按照 Person 来约束的类型，但是，经过赋值以后，调用的时候，参数却是按照 Guang 类型约束的
// Person 类型缺少了 Guang 中的属性和方法，因此是类型不安全的
// Type '(guang: Guang) => void' is not assignable to type '(person: Person) => void'.
//   Types of parameters 'guang' and 'person' are incompatible.
//   Property 'hobbies' is missing in type 'Person' but required in type 'Guang'
printName = printHobbies;

// 但是在 ts2.x 之前支持这种赋值，也就是父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”
// 但是这明显是有问题的，不能保证类型安全，所以之后 ts 加了一个编译选项 strictFunctionTypes，设置为 true 就只支持函数参数的逆变，设置为 false 则是双向协变
// ts 默认设置这个配置项为 false，也就是支持双向协变

// 前提：函数被赋值了，但是函数的约束不变，也就是 printName 和 printHobbies 类型不变，只是具体执行的时候，函数体变化 
// 对于函数参数而言，父类型乐意赋值给子类型，因为是声明的时候是子类型
// 函数实际使用的时候是父类型，父类型显然没有子类型具体（少属性）
// 那么显然不会访问子类型中的属性和方法，因此是类型安全的
// 反之，子类型赋值给父类型，函数在使用过程中如果使用了子类型中的属性和方法，有可能超出了父类型的约束范围，所以是类型不安全的

// 从协变和逆变可以看出，TS 总是趋向于收紧范围：具体 -> 不具体方向转变，是类型安全的

type Func = (a: string) => void;

// Type '(a: 'hello') => any' is not assignable to type 'Func'.
//   Types of parameters 'a' and 'a' are incompatible.
//     Type 'string' is not assignable to type '"hello"'
const func: Func = (a: 'hello') => undefined

type Func2 = (a: number) => any;

// Type '(b: 100) => number' is not assignable to type 'Func2'.
//   Types of parameters 'b' and 'a' are incompatible.
//   Type 'number' is not assignable to type '100'.
const fn:Func2 = (b: 100) => 200;

type Func3 = (a: 'a') => void;
type Func4 = (a: 'a' | 'b'| 'c') => void;

const  fs: Func3 = (b: 'a' | 'b'| 'c') => {}
// Types of parameters 'b' and 'a' are incompatible.
// Type '"a" | "b" | "c"' is not assignable to type '"b"'.
// Type '"a"' is not assignable to type '"b"'
const  fs2: Func4 = (b: 'b') => {}

// 对于联合类型：a | b | c 是富父类型，而 a 或者 b 或者 c 是子类型，因为更具体

// 定义子类型，赋值为父类型 -> 类型安全

// 对于交叉类型，{a: 1} & {b: 2} 是子类型，因为是取交集，更具体

type aa = {a: 1} & {b: 2} extends {a: 1} ? true : false;
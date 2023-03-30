/**
 *
 * 条件类型
 *
 * 主要是 extends 关键字
 *
 * 主要作用是用来收窄泛型的类型，将泛型约束在某几个类型之中
 *
 * 同时可以用于三元表达式中
 *
 * T extends U ? X : Y
 *
 * 可以理解为，T 是 U 的子类吗，或者是 T 中是否具有 U 的全部属性，如果有，那么条件为真，返回 X，否则返回 Y
 *
 * 为什么会有条件类型呢
 *
 * 在一些场景下，我们无法在定义的时候就确定需要什么类型，需要运行时确定
 * 对于类型无法即时确定的场景，使用 条件类型 来在运行时动态的确定最终的类型
 * 比如说一个高阶函数，需要根据接收的函数的返回值来确定这个高阶函数的返回值
 * 运行时可能不太准确，或者可以理解为，你提供的函数被他人使用时，根据他人使用时传入的参数来动态确定需要被满足的类型约束
 *
 */

let condition: boolean;

let text = condition ? 'gogogo' : 'dddddd';

type ConditionType<T> = T extends string ? 'up' : 'down';

/**
 * 使用条件类型作为函数返回值类
 * 声明一个函数类型
 *
 * T 首先被约束为布尔值，因此 x 也只能是布尔值
 * 返回值进一步收窄，要求 T 是 true，则是 string，否则就是 number
 * @param x
 */
declare function stringOrNumber<T extends boolean>(x: T): T extends true ? string : number;

/**
 *
 * 上面的条件类型的推导就会被延迟，因为此时类型系统没有足够的信息来完成判断
 *
 * 只有给出了所需信息（在这里是入参 x 的类型），才可以完成推导
 *
 */
const StringType = stringOrNumber(true);
const NumberType = stringOrNumber(false);
// Argument type 100 is not assignable to parameter type boolean
// const otherType = stringOrNumber(100);


/**
 *
 * 条件类型的嵌套
 * 就像 js 中三元表达式可以嵌套，条件类型也可以嵌套，嵌套的条件类型，可以更精准的判断该取什么类型
 *
 *
 */


// 判断并返回类型的名称
type TypeName<T> =
    T extends string ? 'string' :
        T extends number ? 'number' :
            T extends boolean ? 'boolean' :
                T extends undefined ? 'undefined' :
                    T extends Function ? 'function' : 'object'
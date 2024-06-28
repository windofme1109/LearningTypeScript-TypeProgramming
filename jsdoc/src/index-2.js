/**
 * 
 * JSDoc 方式注释函数
 * 文档：https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#type
 */


/**
 * 
 * @param {number} a  参数aaa
 * @param {number} b  参数bbb
 */
function add2(a, b) {
    return a + b;
}

// 允许 typescript 检查 js 以后，就可以检查 js 错误了
// add2(1, 'a')
add2(1, 2)


// 使用 JSDoc 可以无侵入的给 JS 加上类型，拥有和 ts 一样的类型检查、类型提示、生成 dts 等功能
// 但却不需要编译，因为 JS 代码可以直接运行

// JSDoc 和核心内容是使用 @type 给变量、函数添加各种类型
/**
 * @type {Promise<string>}
 */
let obj;

// obj.then

/**
 * @type {(a: string, b: boolean) => number}
 */
let myFunc;

// 如果类型被多处用到，可以用 @typedef 抽出来，单独命名：

/**
 * @typedef {(a: string, b: boolean) => number} myFunc
 */

/**
 * @type {myFunc}
 */
let myFunc2

/**
 * @type {myFunc}
 */
let myFunc3

// 甚至可以在 dts 文件声明类型，在这里 import 进来用：

/**
 * @type {import('./guang').MyAddFunc}
 */
let myFunc4;


// JSDoc 中定义函数的另外一种方式

/**
 * 
 * @param {string} p1 参数 p1
 * @param {string=} p2 可选参数
 * @param {string} [p3] 可选参数的第二种写法
 * @param {string} [p4='test'] 可选参数 + 默认值
 * @returns  {string}
 */
function guang(p1, p2, p3, p4) {
    return '';
}

// JSDoc 也支持泛型：通过 @template 声明类型参数

/**
 * @template T 
 * @param {T} x 
 * @returns {Promise<T>}
 */
function guang2(x) {
    return Promise.resolve(x);
}

// Promise<string>
const g1 = guang2('a');

// Promise<number>
const g2 = guang2(100);


// JSDoc 还可以实现 TS 体操

/**
 * @template P
 * @typedef {P extends Promise<infer R> ? R : never} PromiseType
 * 
 */

/**
 * @type {PromiseType<Promise<100>>}
 * 
 */
let p1;

// JSDoc 也支持在 class 中添加类型

/**
 * @template T
 * @extends {Set<T>}
 * 
 */
class Guang extends Set {
    /**
     * @type {T}
     */
    name;

    /**
     * 
     * @param {T} name 
     */
    constructor(name) {
        super();

        this.name = name;
    }

    /**
     * 
     * @returns {string}
     */
    sleep() {
        return 'sleeping'
    }
}

// 上面代码的含义是：
// 声明了一个泛型类，有一个类型参数 T，它通过 @extends 继承了 Set<T> 类型
// 它有个 name 属性的类型为 T，并且还声明了构造器和 sleep 方法的类型

const ggg = new Guang('guang');
// 本身具有的属性和方法也可以使用
ggg.name;
ggg.sleep()


// 继承的 Set 的方法也没有问题
ggg.clear();

// 综上，用 JSDoc 可以定义变量、函数、class、泛型等，可以从别的 dts 文件引入类型
// 基本上 ts 能做的，JSDoc 也都可以。
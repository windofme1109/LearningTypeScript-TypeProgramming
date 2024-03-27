/**
 *
 * 社区类型
 * 社区中比较好的第三类型库
 *
 *
 * https://github.com/sindresorhus/type-fest
 * https://github.com/piotrwitek/utility-types
 *
 * // 如何在 Redux 中和 React 中优雅的使用 TypeScript
 * https://github.com/piotrwitek/react-redux-typescript-guide
 *
 */

/**
 *
 * 手动实现几个社区类型
 *
 */

/**
 *
 * 1. 返回基本数据类型
 *
 *
 */

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export function isPrimitive(val : unknown): val is Primitive {
    if (val === null || val === undefined) {
        return true;
    }

    const valType = typeof val;

    const primitiveWithoutNullishTypeList = [
        'string',
        'number',
        'bigint',
        'boolean',
        'symbol',
    ]

    return primitiveWithoutNullishTypeList.includes(valType);
}

// 去除 undefined 类型
type NonUndefined<T> = T extends undefined ? never : T;
// 去除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;

// true
console.log(isPrimitive(1));
// true
console.log(isPrimitive('hello'));
// true
console.log(isPrimitive(true));
// true
console.log(isPrimitive(null));
// false
console.log(isPrimitive(() => {}));

/**
 *
 * Falsy
 * 判断某个值是否为 false 类型的
 * false、undefined、null、0、''
 *
 */

type Falsy = false | undefined | null | 0 | '';

function isFalsy(val: unknown): val is Falsy {
    if (val) {
        return false;
    }

    return true;
}


/**
 *
 * 提取 Promise 中的类型
 * 提取出一个返回 Promise 的函数中，Promise 中的类型
 * 正常的 Promise，是接收一个泛型：Promise<T>
 * 这个 T 就是 resolve 时函数的类型
 *
 * 我们现在就要提取出这个 T
 *
 * 这里就需使用 infer 这个关键字
 *
 */

function getAsyncName(name: string) {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            resolve(name);
        }, 1000);
    });
}

// Promise<string>
type FunctionReturnType = ReturnType<typeof getAsyncName>;

// 使用 infer P 来等待类型系统推导出 P 的具体类型
type MyPromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

// string
type FunctionPromiseType = MyPromiseType<FunctionReturnType>;


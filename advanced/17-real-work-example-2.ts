
type Zip<One extends unknown[], Two extends unknown[]> = 
    One extends [infer FirstOne, ...infer RestOne] ?
        Two extends [infer FirstTwo, ...infer RestTwo] ?
            [[FirstOne, FirstTwo], ...Zip<RestOne, RestTwo>] 
            : []
        : [];


type Mutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}

type MutableRes = Mutable<{readonly a: 100}>
type MutableRes2 = Mutable<readonly [1, 2, 3]>

// type ZipRes = Zip<[1, 2, 3], [4, 5, 6]>

// 函数重载
function zip<Target extends unknown[], Source extends unknown[]>(target: Target, source: Source): unknown[];
function zip<Target extends readonly unknown[], Source extends readonly unknown[]>(target: Target, source: Source): Zip<Mutable<Target>, Mutable<Source>>;

// 注意：重载函数的类型是从上到下依次匹配，只要匹配到一个就应用


function zip(target: unknown[], source: unknown[]) {
    if (target.length !== source.length) {
        throw new Error('传入的数字长度必须相等');
    }

    const length = target.length;

    let arr = [];

    for (let i = 0; i < length; i++) {
        arr.push([target[i], source[i]])
    }

    return arr;
}

// 如果声明的函数顺序如下：
// unction zip<Target extends unknown[], Source extends unknown[]>(target: Target, source: Source): unknown[];
// function zip<Target extends readonly unknown[], Source extends readonly unknown[]>(target: Target, source: Source): Zip<Mutable<Target>, Mutable<Source>>;

// res1 的推导结果依然是 unknown
//  [1, 2, 3] as const 被推导为 [1, 2, 3]，而不是 readonly [1, 2, 3]
// 这样能匹配到第一个函数声明
const res1 = zip([1, 2, 3] as const, [4, 5, 6] as const);

type readonlyTest =  [1, 2, 3] extends unknown[] ? true : false;

const arr1 = [100, 200, 300];
const arr2 = [400, 500, 600]

const res2 = zip(arr1, arr2);


console.log(res1);



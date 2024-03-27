/**
 * extends
 */

type isTwo<T> = T extends 2 ? true : false;

type res = isTwo<1>;
type res2 = isTwo<2>;


/**
 *
 * infer
 *
 */

type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R] ? T : never;

type res3 = First<[1, 2, 3]>;

type PromiseType<T extends Promise<unknown>> = T extends Promise<infer R> ? R : never;

const mp = new Promise<number>(() => {})

type p1 = PromiseType<Promise<string>>;
type mpType = PromiseType<typeof mp>;


/**
 * 
 * &
 * 
 */

// 使用 & 联合的类型必须是同一类型
type u1 = 'aaaa' & 2222;

type u2 = {a: number} & {c: boolean};

type res4 = {a: number, c: boolean} extends u2 ? true : false;


/**
 * keyof
 * 
 * keyof T 是查询索引类型中所有的索引，叫做索引查询。
 * T[Key] 是取索引类型某个索引的值，叫做索引访问。
 * 
 */

// 类型映射 
type MapType<T> = {
    [key in keyof T]: [T[key], T[key], T[key]]   
}

type res5 = MapType<{a: 1, b: 2}>

// 类型映射 -  2
/**
 * 使用 as 运算符对索引值进行变换
 * 索引也可以做变化，用 as 运算符，叫做重映射
 * 
 */
type MapType2<T> = {
    // 因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，
    // 这里 keyof T 取出的索引就是 string | number | symbol 的联合类型
    // 和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃
    [
        Key in keyof T
        as `${Key & string}${Key & string}${Key & string}`
    ]: [T[Key], T[Key], T[Key]]   
}

type res6 = MapType2<{a: 1, b: 2}>
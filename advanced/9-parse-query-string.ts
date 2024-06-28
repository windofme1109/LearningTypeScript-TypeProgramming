/**
 * 
 * 解析 url 查询字符串
 * 
 * 
 * a=1&b=2&c=3 
 * 解析为
 * {
 *     a: 1,
 *     b: 2,
 *     c: 3
 * }
 * 
 */

/**
 *  1. 将查询字符串以 & 为分隔符进行切分：
 *     a=1&b=2&c=3 转换为：
 *     a = 1
 *     b = 2
 *     c = 3 
 *  2. 将 a=1 转换为对象：{a: 1}，b=2 转换为：{b: 2}，c=3 转换为：{c: 3}
 *  3. 合并对象：{a: 1}、{b: 2}、{c: 3} 合并为：{a: 1, b: 2, c: 3}
 */


type ParseQueryString<Str extends string> = 
    Str extends `${infer Param}&${infer Rest}` ? 
        MergeParams<ParseParam<Param>, ParseQueryString<Rest>> 
        : ParseParam<Str>;



type result1 = ParseQueryString<'a=1&b=2&c=3'>
type result2 = ParseQueryString<'a=1&b=2&c=3&a=3&c=10'>

/**
 * MergeParams
 * 将两个对象合并，如 key 相同，将值放到一个数组中
 * 
 * 类型参数 OneParam、OtherParam 是要合并的 query param，约束为索引类型（索引为 string，索引值为任意类型
 * 构造一个新的索引类型返回，索引来自两个的合并，也就是 Key in keyof OneParam | keyof OtherParam
 * 值也要做合并：
 * 如果两个索引类型中都有，那就合并成一个，也就是 MergeValues<OneParam[Key], OtherParam[Key]>
 * 否则，如果是 OneParam 中的，就取 OneParam[Key]，如果是 OtherParam 中的，就取 OtherParam[Key]
 * MegeValues 的合并逻辑就是如果两个值是同一个就返回一个，否则构造一个数组类型来合并
 * 
 */
type MergeParams<OneParam extends Record<string, any>, OtherParam extends Record<string, any>> = 
    {
        [Key in keyof OneParam | keyof OtherParam]: 
            Key extends keyof OneParam ?
                Key extends keyof OtherParam ?
                    MergeValues<OneParam[Key], OtherParam[Key]> 
                    : OneParam[Key]
                : Key extends keyof OtherParam ?
                OtherParam[Key] : never
    }


/**
 * MergeValues
 * 合并两个值
 * 类型参数 One、Other 是要合并的两个值
 * 如果两者是同一个类型（可以理解为是相同的值），也就是 One extends Other，就返回任意一个
 * 否则，如果是数组就做数组合并
 * 否则构造一个数组把两个类型放进去
 * 
 */
type MergeValues<One, Other> = 
    One extends Other ? 
        One : Other extends unknown[] ? 
            [One, ...Other] : [One, Other]
;

/**
 * ParseParam
 * ParseParam 用来解析形式为 a=1 这种的字符串，将其解析并转换为 {a: 1} 这种对象形式
 * 
 */
type ParseParam<Str extends string> = 
    Str extends `${infer Key}=${infer Value}` ? {
        [K in Key]: Value
    } : never;


type ParseParamResult = ParseParam<'a=1'>
/**
 *
 * 基于值类型的工具类型
 *
 * 前面的工具类型都基于 key 值进行操作，如果想要根据某个 key 的具体类型进行操作呢
 *
 * 答案也很简单，就是指定一个具体的类型，然后基于这个类型做判断
 *
 *
 */

/**
 *
 * 基于值类型的 Pick
 * 根据值的类型从一个接口中选择出指定属性及其对应的类型约束
 *
 */

type ValueTypePick<T, ValueType> = Pick<
    T,
    {[K in keyof T]-?: T[K] extends ValueType ? K : never}[keyof T]
>

interface PersonMan {
    name: string;
    age: number;
    getName: () => void
}

// {name: string}
type PersonManStr = ValueTypePick<PersonMan, string>;

/**
 *
 * 根据指定的 ValueType，首先从 T 中挑选出合适的 key
 *
 * {[K in keyof T]-?: T[K] extends ValueType ? K : never}[keyof T]
 *
 * 这个条件类型就是挑选符合 ValueType 的 key
 * 与 K 对应类型 T[K] 如果是 ValueType，那么就取 K，否则就取 never
 *
 * PersonMan 经过这一步，变成：{name: 'name'; age: never, getName: never}
 * 在通过 {name: 'name'; age: never, getName: never}[keyof PersonMan]
 * 'name' | never | never 的联合类型，最终就是 name
 * 最终是：Pick<PersonMan, 'name'>
 *
 */

/**
 *
 * 基于值类型的 Pick
 * 根据值的类型从一个接口中忽略指定属性及其对应的类型约束
 *
 */

type ValueTypeOmit<T, ValueType> = Omit<
    T,
    {[K in keyof T]: T[K] extends ValueType ? K : never}[keyof T]
>

// {age: number, getName: () => void}
type OmitPeronStringType = ValueTypeOmit<PersonMan, string>;

/**
 *
 * 基本思路和 ValueTypePick 一样
 * 基于 Omit
 * 首先挑选出符合 ValueType 的 key，然后作为 Omit 的第二个参数
 *
 *  {[K in keyof T]: T[K] extends ValueType ? K : never}[keyof T]
 * 这个条件类型的作用就是挑选值类型为 ValueType 的 key
 * 详细过程和 ValueTypePick 的筛选过程类型，这里不再多说
 *
 */
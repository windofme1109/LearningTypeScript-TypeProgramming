// 真实工作中的案例 - 给已经定义好类型的对象添加新的属性

type Data = {
    aaa?: number;
    bbb: {
        ccc: number;
        ddd: string
    },
    eee: {
        ccc: {
            fff: number
        }
    }
}

// 填充数据的时候，按照类型要求进行填充
const data1: Data = {
    aaa: 100,
    bbb: {
        ccc: 101,
        ddd: 'react'
    },
    eee: {
        ccc: {
            fff: 99
        }
    }
}

// 如果想在 Data 类型的基础上扩展一些属性，就会报错：
const data2: Data = {
    aaa: 100,
    test: '101',
    bbb: {
        ccc: 101,
        ddd: 'react'
    },
    eee: {
        ccc: {
            fff: 99
        }
    }
}

// 此时有两种方法：
// 1. 定义时使用索引签名的方式：
type Obj1 = {
    aaa: string;
    bbb: number;
    [key: string]: any
}

const o1: Obj1 = {
    aaa: 'cos',
    bbb: 101,
    ccc: 'dfsf',
    age: 19
}

// 2. 使用 Record 进行扩展
type Obj2 = {
    aaa: string;
    bbb: number;
    
} & Record<string, any>

const o2: Obj2 = {
    aaa: 'cos',
    bbb: 101,
    ccc: 'dfsf',
    size: 19
}

// 如果是嵌套的对象，需要给每一个层级都加一个

// 定义一个 DeepRecord 的高级类型，传入的类型参数 Obj 为一个索引类型，通过 Record<string, any> 约束
// 然后通过映射类型的语法构造一个新的索引类型
// Key 来自之前的索引类型的 Key，也就是 Key in keyof Obj
// Value 要判断是不是索引类型，如果依然是 Record<string, any>，那就递归处理它的值 Obj[Key]，否则直接返回 Obj[Key]
// 每一层都要和 Record<string, any> 取交叉类型
type DeepRecord<Obj extends Record<string, any>> = {
    [K in keyof Obj]: Obj[K] extends Record<string, any> ? 
        DeepRecord<Obj[K]> & Record<string, any> : Obj[K]

} & Record<string, any>


type NewDataType = DeepRecord<Data>;

const d3: NewDataType = {
    aaa: '111',
    test: 'gogogo',
    bbb: {
        ccc: 200,
        ddd: 'dsfsdf'
    },
    eee: {
        ccc: {
            fff: 101,
            hhh: 99
        }
    }
}


// 真实工作中的案例 - 根据某个字段的类型，动态调整其他字段的类型
// 举个例子：
type TableRecordFilterState = {
    create_time?: false | 'desc' | 'asc';
    update_time?: false | 'desc' | 'asc';
}

// 需求；当 create_time 取 'desc' | 'asc' 时，update_time 取 false，反之亦是如此
// 即一个索引为 'desc' | 'asc' 的时候，其他索引都是 false

// 有一种做法是枚举所有的可能：、
type TestTableRecordFilterState = {
    create_time?: 'desc' | 'asc';
    update_time?: false;
} | {
    create_time?: false;
    update_time?: 'desc' | 'asc';
}


const t1: TestTableRecordFilterState = {
    create_time: 'asc',
    update_time: false
}

const t2: TestTableRecordFilterState = {
    create_time: false,
    update_time: 'desc'
}
// 这种方式可用解决问题，但是扩展性比较差
// 因为如果加属性的话，就得新增一种情况，维护起来比较麻烦

// 使用类型编程动态生成类型
type GenerateType<Keys extends keyof any> = {
    // 传入的 Keys 是 Key 值的联合类型（设置的字段的联合类型）
    // 直接取联合类型中的每个值
    [K in Keys]: {
        // 在以每个字段值为键，属性值设定为：'desc' | 'asc'
        [K2 in K]: 'desc' | 'asc'
    } & {
        // 要求是某个字段为 'desc' 或者 'asc' 时，其余字段为 false
        // 那么我们需要在生成一个索引类型：除去值为 'desc' 或者 'asc' 的字段，剩下的字段一律设置为 false
        // 去除某个字段可以使用 Exclude
        [K3 in Exclude<Keys, K>]: false
    }

    // 生成了为字段值全部为 false 的索引类型，在将其和原来的类型做交叉，即可满足需求

}[Keys]

// 最后通过 [Keys] 的方式取属性值，就可以得到多个类型的联合类型（类似于枚举出所有的可能）

// 无法直接生成目标类型，因此使用嵌套的方式，以字段为 key，将类型作为其值，这个值就可使用交叉类型，即 'desc' | 'asc' 和 false 类型的交叉
// 最后通过 [Keys] 取出所有的属性值

type NewTableRecordFilterState = GenerateType<'aaa' | 'bbb' | 'ccc' | 'ddd' | 'eee'>;

const nt1: NewTableRecordFilterState ={
    aaa: 'desc',
    bbb: false,
    ccc: false,
    ddd: false,
    eee: false
}

type GenerateTypeUnion<Keys extends keyof any> = {
    [K in Keys]: K
}

type TestUnionType = GenerateTypeUnion<'a' | 'b' | 100>

type CustomVaule<T extends Record<string, any>> = T[keyof T];

type CustomVauleType = CustomVaule<{a: 100, b: 200, c: 'gogogo'}>



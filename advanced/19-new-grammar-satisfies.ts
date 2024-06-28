// TypeScript 的新语法：satisfies 
// 主要作用是自动推导类型

// 自动推导类型
let obj = {
    a: 1,
    b: 2,
    c: 'gogogo'
};

// 自动推导 a 为 number，因此赋值为 string 会报错
obj.a = '200';

// 手动定义类型
interface Obj {
    a: number,
    b: string | number,
    c: string
}

const obj2: Obj = {
    a: 100,
    b: 200,
    c: 'ggg'
}

obj2.b = 'sss'

interface Obj2 {
    a: number;
    b: string | number;
    c: string;

    // 动态添加类型
    [key: string]: any
}

const obj3: Obj2 = {
    a: 100,
    b: 200,
    c: 'ggg',
    d: 50
}

obj3.f = 'gggggg';

// Obj2 虽然具备了扩展性，可以动态添加新的属性
// 但是在使用时，只会提示已经定义的类型，动态添加的不会提示

// 使用 satisfies 语法实现

const obj4 = {
    a: 100,
    b: 200,
    c: 'ggg',
    d: 50
} satisfies Obj2

obj4.d = 60;
// 改变已有属性的类型也会提示错误
obj4.a = '2222'

// satisfies 本意是满足，从字面意义上理解，就是 obj4 满足 Obj2 的类型约束
// 因为 Obj2 可以动态添加属性，所以 obj4 中的 d 属于动态添加的，而 a、b、c 这三个字段，则是 Obj2 中已有的，所以会被约束

// 这就是 satisfies 的意义：用自动推导出的类型，而不是声明的类型，增加灵活性，同时还可以对这个推导出的类型做类型检查，保证安全

// satisfies 关键字也有缺点：无法动态添加新的属性
obj4.e = 99


const obj5 = {
    a: 'docker',
    b: 200,
    c: 'ggg',
} satisfies Obj;


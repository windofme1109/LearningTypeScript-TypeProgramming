/**
 *
 * 条件类型中的 extends 关键字
 *
 * extends 关键字，如果用在接口、类中，就是继承
 *
 * 而用在类型上，就是用来判断两个类型之间的关系，常用于三元表达式： A extends B ? A : B
 *
 */

// 举一个例子

class Animal {
    eat(): void {

    }
}

class Dog extends Animal {
    bark(): void {

    }
}

// string
type A = Dog extends Animal ? string : number;

/**
 * 上面的三元表达式，如果为真，就返回 string，否则返回 number
 *
 * 那么 extends 判断条件真假的逻辑是什么？
 *
 * 很简单，如果 extends 前面的类型能够赋值给 extends 后面的类型，那么表达式判断为真，否则为假。
 * A extends B，即 A 的类型能够赋值给 B，或者说是 A 的值能分配给 B，这样表达式就为真
 *
 * A 的类型能够赋值给 B 是什么意思呢
 * Dog 是子类，Animal 是父类，父类的限制更少，能满足子类的，一定能满足父类，这就是 Dog 类型的值一定可以赋值个 Animal 类型
 *
 * 换句话说，能满足 A 的，一定能满足 B，那么 A extends B 就为真
 *
 */

// let animal = new Animal();
// let dog = new Dog();
//
// // animal = dog;

/**
 *
 * 注意，A extends B，表示的是 A 与 B  约束关系，并不是表示 A 是 B 的子类
 *
 */

interface A1 {
    name: string
}

interface A2 {
    name: string
}



// true
type AType = A1 extends A2 ? true : false;

/**
 * A1 和 A2 并没有继承关系，A1 和 A2 这两个接口的形状完全相同，因此，满足 A1 的一定满足 A2，所以表达式成立
 *
 */

interface B1 {
    name: string;
    age: number
}

interface B2 {
    age: number
}

// false
type BType = B2 extends B1 ? true : false;
// true
type BType2 = B1 extends B2 ? true : false;

/**
 * B1 有两个属性，B2 只有一个属性，因为，满足 B2 的一定可以满足 B1，所以 BType2 为 true
 * 反过来，满足 B2 的不能满足 B1，因为缺少 B2 缺少 age 属性，所以 BType 为 false
 *
 *
 */


/**
 * 字面量类型的判断
 *
 * 字面量类型是是原始类型（string、number、boolean）的更精确表达，是对原始类型的进一步收敛，因此 使用 extends 必然是 true
 *
 */

// x
type T1 = 'x' extends string ? 'x' : 'y';
// 100
type T2 = 100 extends number ? 100 : 0;
// true
type T3 = true extends boolean ? true : false;

/**
 *
 * 联合类型
 * 联合类型的比较，其实就是比较前者的类型分支在后者中是否都存在，或者说前者是否是后者的子集
 * 因此
 * 'x' extends 'x' | 'y'
 * 'x' extends 'x'
 * 'x' | 'y' extends 'y' | 'x'
 * 均返回 true
 * 而 'x' | 'y' extends 'y' 返回 false，因为 'x' 和 'y' 的联合类型不满足于 'x'
 *
 *
 *
 */

// true
type T4 = 'x' extends 'x' | 'y' ? true : false;

// true
type T5 = 'x' extends 'x' ? true : false;

// string
type T6 = 'x' | 'y' extends 'y' ? number : string;

// number
type T7 = 'x' | 'y' extends 'y' | 'x' ? number : string;

// string
type T8 = 'x' | 'y' | 'z' extends 'y' | 'x' ? number : string;

// number
type T9 = 'x' | 'y' extends 'y' | 'x' | 'z' ? number : string;


/**
 * 特殊的 never
 * never 是所有类型的子类，属于 Bottom type，而 any 和 unknown 则属于顶层类型 top type
 *
 * 所以 never extends 'x' 为真
 */

// string
type T10 = never extends 'x' ? string : number;

type P<T> = T extends 'x'  ? string : number;

// never
type P1 = P<never>;

/**
 *
 * never 实际上是一个空的联合类型，就是没有联合项的联合类型，因此也满足分布式条件类型的规则
 * 因为没有联合项，所以 P<never> 没有执行，所以 P1 就类似于没有返回值的函数一样，是 never 类型
 *
 */
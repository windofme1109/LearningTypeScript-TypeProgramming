/**
 *
 * ts 类型编程 - 基础
 *
 * is 关键字
 *
 * in 关键字
 *
 */

type numOrStrProp =  number | string;


// 初始
// function isString(arg: unknown) {
//     return typeof arg === 'string';
// }

// function useIt(arg: numOrStrProp) {
//     if (isString(arg)) {
//         // 此时并没有起到收窄类型的作用
//         //  error TS2339: Property 'length' does not exist on type 'numOrStrProp'.
//         //   Property 'length' does not exist on type 'number'.
//         // arg 依旧是 number 和 string 的联合类型
//         console.log(arg.length);
//     }
// }



// 使用 is 关键字
// is 关键字用来判断一个变量属于某个接口或类型，通常用于返回值中
// 收窄类型
// arg is string 表示入参 arg 为 string，同时，如果 arg 为是 string，则 arg 会进入返回值为 true 的代码块中
// 这样使用 arg 都是 string 类型
function isString(arg: unknown): arg is string {
    return typeof arg === 'string';
}

function useIt(arg: numOrStrProp) {
    //
    if (isString(arg)) {
        // arg 现在是 string 类型
        console.log(arg.length);
    }
}

type Falsy = false | '' | 0 | undefined | null;

function isFalsy(arg: unknown): arg is Falsy {
    return !arg;
}


// in 关键字收窄类型

class A {
    public a() {}


    public useA() {
        return 'A';
    }
}

class B {
    public b() {}


    public useB() {
        return 'B';
    }
}

// in 关键字用来判断一个属性是否为对象所拥有：

function useIt(v: A | B) {
    // 属性 a 是 A 的实例中才有的属性，因此使用 in 判断 a 属性是不是在实例中，从而决定调用实例的哪个方法
    return 'a' in v ? v.useA() : v.useB();
}

// 使用字面量类型进行收窄类型

interface IBoy {
    name: 'mike',
    gf: string
}

interface IGirl {
    name: 'jenny',
    bf: string
}

// IBoy 和 IGirl 都有 name 属性，且 name 属性是字面量形式，所以可以通过字面量判断是哪个对象，从而进一步操作

function getLover(v: IBoy | IGirl): string {
    if (v.name === 'mike') {
        return v.gf;
    } else {
        return v.bf;
    }
}


/**
 *
 * 基于字段区分接口
 *
 * 不同的状态下，需要使用不同的接口类型，所以可以基于字段去进行判断
 *
 */

/**
 * 
 * 登录状态和非登录状态使用不同的接口
 * 
 */

interface Login {
    isLogin: boolean;
    name: string;
}

interface UnLogin {
    isLogin: boolean;
    from: string;
}

function getUserInfo(user: Login | UnLogin) {
    return 'name' in user ? user.name : user.from;
}

/**
 *
 *
 * 通过字面量类型进行区分
 *
 *
 */

interface CommonUser {
    type: 'common',
    accountLevel: string
}

interface VipUser {
    type: 'vip';
    vipLevel: string
}

function getUserLevel(user: CommonUser | VipUser) {
    return user.type === 'common' ? user.accountLevel : user.vipLevel;
}


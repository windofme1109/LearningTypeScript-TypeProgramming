/**
 *
 * ts 类型编程 - 基础
 *
 * is 关键字
 *
 * in 关键字
 *
 */
function isString(arg) {
    return typeof arg === 'string' ? true : false;
}
function useIt(arg) {
    if (isString(arg)) {
        // 此时并没有起到收窄类型的作用
        console.log(arg.length);
    }
}

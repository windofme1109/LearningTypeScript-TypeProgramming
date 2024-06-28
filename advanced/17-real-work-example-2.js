function zip(target, source) {
    if (target.length !== source.length) {
        throw new Error('传入的数字长度必须相等');
    }
    var length = target.length;
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push([target[i], source[i]]);
    }
    return arr;
}
var res1 = zip([1, 2, 3], [4, 5, 6]);
console.log(res1);






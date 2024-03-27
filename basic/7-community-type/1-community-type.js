"use strict";
/**
 *
 * 社区类型
 * 社区中比较好的第三类型库
 *
 *
 * https://github.com/sindresorhus/type-fest
 * https://github.com/piotrwitek/utility-types
 *
 * // 如何在 Redux 中和 React 中优雅的使用 TypeScript
 * https://github.com/piotrwitek/react-redux-typescript-guide
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = void 0;
function isPrimitive(val) {
    if (val === null || val === undefined) {
        return true;
    }
    var valType = typeof val;
    var primitiveWithoutNullishTypeList = [
        'string',
        'number',
        'bigint',
        'boolean',
        'symbol',
    ];
    return primitiveWithoutNullishTypeList.includes(valType);
}
exports.isPrimitive = isPrimitive;
console.log(isPrimitive(1));
console.log(isPrimitive('hello'));
console.log(isPrimitive(true));
console.log(isPrimitive(null));
console.log(isPrimitive(function () { }));

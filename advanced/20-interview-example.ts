/**
 * 来自字节的面试题目
 * 题目:实现一个type类型,用于约束特殊时间格式的字符串
* 例子:
* FormatDate<"DD-MM-YY">
* 允许的字符串为:
* const date: FormatDate<"DD-MM-YY"> = "12-12-20124" |"12-02-2024";
* 不允许的字符串为
* const date: FormatDate<"DD-MM-YY"> = "112-12-2024" | "12-112-2024" | "12-12024" | ...
* 时间格式支持多种分隔符:"-"|"."|"/"
* 
*/

// 1. 首先进行模式匹配，将日期格式的三部分都提取出来

// 定义分隔符
type Seperator = '-' | '.' | '/'

// 
type FormatDate1<Pattern extends string> = 
    Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
        [DD, MM, YY] : never;

type FormatDateResult1 = FormatDate1<'DD-MM-YY'>
type FormatDateResult2 = FormatDate1<'DD.MM.YY'>
type FormatDateResult3 = FormatDate1<'DD/MM/YY'>


// 将分隔符提取出来
type FormatDate2<Pattern extends string> = 
    Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
        Pattern extends `${DD}${infer S}${MM}${infer _}${YY}` ?
            [DD, MM, YY, S] : never 
        :never;

type FormatDateResult4 = FormatDate2<'DD-MM-YY'>
type FormatDateResult5 = FormatDate2<'DD.MM.YY'>
type FormatDateResult6 = FormatDate2<'DD/MM/YY'>

// 2. 生成年月日
type BasicNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type DD1 = `${BasicNum}${BasicNum}`;
type MM1 = `${BasicNum}${BasicNum}`;
type YY1 = `${BasicNum}${BasicNum}${BasicNum}${BasicNum}`;

type GenerateDatePartStr1<Part extends string> = 
    Part extends 'YY' ?
        YY1 :
        Part extends 'MM' ?
            MM1 :
            Part extends 'DD' ? 
                DD1 : never;
// Expression produces a union type that is too complex to represent
// type partRes = `${GenerateDatePartStr1<'YY'>}-${GenerateDatePartStr1<'MM'>}-${GenerateDatePartStr1<'DD'>}`

// 也就是说，直接组合数字表示年月日，组合的情况太多，而且也不符合实际情况，需要我们限制一下组合的范围
// 年份只能是 19 和 20 开头，月份只能是 1-12 的数字，日期是 01-31 的数字
type DD = `0${BasicNum}` | `10` | `1${BasicNum}`|`2${BasicNum}` | `30` | `31`
type MM = `0${BasicNum}` | `10` | `11` | `12`
type YY = `20${BasicNum}${BasicNum}`;

type MonthOfThirtyDays = '4' | '6' | '9' | '11';
type InvalidFebDay = '30' | '31' | '29';


// 约束每个月份的天数
type GenerateDatePartStr<Part extends string> = 
    Part extends 'YY' ?
        YY :
        Part extends 'MM' ?
            MM :
            Part extends 'DD' ? 
                DD : never;


type partRes = `${GenerateDatePartStr<'YY'>}-${GenerateDatePartStr<'MM'>}-${GenerateDatePartStr<'DD'>}`

// 3. 生成我们需要的日期类型
// type FormatDate<Pattern extends string> = 
//     Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
//         Pattern extends `${DD}${infer S}${MM}${infer _}${YY}` ?
//             `${MonthOfThirtyDays}${S}31${S}${GenerateDatePartStr<YY>}` extends `${GenerateDatePartStr<DD>}${S}${GenerateDatePartStr<MM>}${S}${GenerateDatePartStr<YY>}` ? 
//                 never :
//             `02${S}${InvalidFebDay}${S}${GenerateDatePartStr<YY>}` extends `${GenerateDatePartStr<DD>}${S}${GenerateDatePartStr<MM>}${S}${GenerateDatePartStr<YY>}`  ? 
//                     never : `${GenerateDatePartStr<DD>}${S}${GenerateDatePartStr<MM>}${S}${GenerateDatePartStr<YY>}`
//                     :never
//                 : never;


type FormatDate<Pattern extends string> = 
    Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
        Pattern extends `${DD}${infer S}${MM}${infer _}${YY}` ?
            `${GenerateDatePartStr<DD>}${S}${GenerateDatePartStr<MM>}${S}${GenerateDatePartStr<YY>}` 
            :never
        : never;


type InvalidDate<Pattern extends string> = 
    Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
        Pattern extends `${DD}${infer S}${MM}${infer _}${YY}` ?
            `${MonthOfThirtyDays}${S}31${S}${GenerateDatePartStr<YY>}` : never
            : never;

type InvalidFeb<Pattern extends string> = 
    Pattern extends `${infer DD}${Seperator}${infer MM}${Seperator}${infer YY}` ?
        Pattern extends `${DD}${infer S}${MM}${infer _}${YY}` ?
            `02${S}${InvalidFebDay}${S}${GenerateDatePartStr<YY>}` : never
            : never;

type InvalidFebResult = InvalidFeb<'DD-MM-YY'> | InvalidFeb<'DD/MM/YY'> | InvalidFeb<'DD.MM.YY'>

// type FormatDate<Pattern extends string> = 
//     BasicFormatDate<Pattern> extends InvalidFebResult ? never : BasicFormatDate<Pattern>

// type FormatDate<Pattern extends string> = Exclude<BasicFormatDate<Pattern>, InvalidFebResult>;

type NewFormatDate = FormatDate<'DD-MM-YY'>;
type InvalidDateResult1 = InvalidDate<'DD-MM-YY'>;
type InvalidFebResult2 = InvalidFeb<'DD-MM-YY'>;

const d1: FormatDate<'DD-MM-YY'> = '10-11-2023';
const d2: FormatDate<'DD/MM/YY'> = '14/06/2024';
const d3: FormatDate<'DD-MM-YY'> = '29-02-2024';
const d4: FormatDate<'DD/MM/YY'> = '31/11/2024';

// 日期格式不符合要求
const d44: FormatDate<'DD/MM/YY'> = '131/11/2024';

type TestExclude = '04-10-2024' | '14-10-2024' extends '04-10-2024' | '14-10-2024' | '15-10-2024' ? true : false;

// const d5: TestExclude = '31/02/2024';

// todo 移除不合理的日期，如 6 月 31 日，2 月 29 日

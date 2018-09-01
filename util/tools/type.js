/** 
  * 判断变量是否为指定类型 （支持typelist中的9种类型）
  * @param 输入变量
  * @return {Boolean} 表示是否为该变量
  * 注：NaN / Infinity 为 Number 类型
  * 具体使用方法 见底部注释
 */
const typeList = [
  'Number', 'String', 'Boolean',
  'Array', 'Function', 'Object',
  'Symbol', 'Null', 'Undefined'
]

const type = {}

for (const item of typeList) {
  type[`is${item}`] = val => {
    return Object.prototype.toString.call(val) === `[object ${item}]`
  }
}

export default type


// type.isNumber(123) -> true
// type.isNumber(NaN) -> true
// type.isNumber(Infinity) -> true

// type.isBoolean(true) -> true
// type.isString('123') -> true
// type.isArray([]) -> true
// type.isFunction(() => console.log(12)) -> true
// type.isObject({}) -> true
// type.isSymbol(Symbol('test')) -> true
// type.isNull(null)) -> true
// type.isUndefined(undefined)) -> true

/** 
 * type 对象提供两种功能：
 * 功能一：type.name(variable) ->  以字符串形式输出变量类型的名字
 * 功能二：type.isNumber(variable)  ->  返回布尔值，判断变量是否为指定类型
*/
const typeList = [
  'Number', 'String', 'Boolean',
  'Array', 'Function', 'Object',
  'Symbol', 'Null', 'Undefined'
]

const type = {
  /** 
   * 功能一：以字符串形式输出变量类型的名字
   * @param 输入变量
   * @return {String} 该变量类型的名字
   * 
   * type.name(123) -> 'number'
   * type.name(true) -> 'boolean'
   * type.name('123') -> 'string'
   * type.name([]) -> 'array'
   * type.name(() => console.log(12)) -> 'function'
   * type.name({}) -> 'object'
   * type.name(Symbol('test')) -> 'Symbol('test')'
   * type.name(null) -> 'null'
   * type.name(undefined) -> 'undefined'
  */
  name(val) {
    let s = Object.prototype.toString.call(val)
    s = s.split(' ')[1]
    s = s.slice(0, s.length - 1)
    return s.toLowerCase()
  }
}

/** 
  * 功能二：返回布尔值，判断变量是否为指定类型
  * @param 输入变量
  * @return {Boolean} 表示是否为该变量
  * 注：NaN / Infinity 为 Number 类型
  *
  * type.isNumber(123) -> true
  * type.isBoolean(true) -> true
  * type.isString('123') -> true
  * type.isArray([]) -> true
  * type.isFunction(() => console.log(12)) -> true
  * type.isObject({}) -> true
  * type.isSymbol(Symbol('test')) -> true
  * type.isNull(null)) -> true
  * type.isUndefined(undefined)) -> true
 */
for (const item of typeList) {
  type[`is${item}`] = val => {
    return Object.prototype.toString.call(val) === `[object ${item}]`
  }
}

export default type

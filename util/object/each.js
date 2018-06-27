/**
 * 对象的迭代器
 * 类似Array.prototype.forEach()方法, 遍历 object 每个属性
 * @param {Object} obj 要被遍历的对象
 * @param {Function} callback 回掉函数可有三参数： key, value, self
 * 
 * @example
 * eg1:
 * const o = {a: 1, b: 2}
 * each(o, (key, value, self) => console.log(key, value, self))
 * -> a 1 {a: 1, b: 2}
 * -> b 2 {a: 1, b: 2}
 * 
 * eg2:
 * each([ 52, 97 ], function( index, value ) {
 *   alert( index + ": " + value );
 * });
 * -> 0: 52 
 * -> 1: 97
 */
function each(obj, callback) {
  for (let key of Object.keys(obj)) {
    callback(key, obj[key], obj)
  }
}

export default each

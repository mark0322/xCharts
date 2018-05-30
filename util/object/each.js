/**
 * 对象的迭代器
 * 类似Array.prototype.forEach()方法, 遍历 object 每个属性
 * @param {Object} obj 要被遍历的对象
 * @param {Function} callback 回掉函数可有三参数： key, value, self
 * 
 * @example
 * const o = {a: 1, b: 2}
 * each(o, (key, value, self) => console.log(key, value, self))
 * -> a 1 {a: 1, b: 2}
 * -> b 2 {a: 1, b: 2}
 */
function each(obj, callback) {
  for (let key of Object.keys(obj)) {
    callback.call(null, key, obj[key], obj)
  }
}

export default each

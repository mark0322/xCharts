/**
 * 判断两个引用变量是否“值”上完全相等
 * @param {Object || Array} obj1
 * @param {Object || Array} obj2
 * @return {Boolean}
 *
 * @example
 * eg isEqual([1,2,3], [1,2,3]) -> true
 * eg isEqual([1,2,3], [1,3,2]) -> false
 *
 * eg isEqual({a:1, b:2}, {a:1, b:2}) -> true
 * eg isEqual({a:1, b:2}, {a:1, b:'2'}) -> false
 *
 * eg isEqual({a:1, b:{b1:1, b2:2}}, {a:1,  b:{b1:1, b2:2}}) -> true
 * eg isEqual({a:1, b:{b1:1, b2:2}}, {a:1,  b:{b1:1, b2:'x'}}) -> false
 */
function isEqual(obj1, obj2) {
  let m1 = new Map(Object.entries(obj1)),
    m2 = new Map(Object.entries(obj2))
  if (m1.size !== m2.size) return false
  for (let key of m1.keys()) {
    if (!m2.has(key)) return false
    if (typeof m1.get(key) === 'object') {
      if(!isEqual(m1.get(key), m2.get(key))) return false
      continue
    }
    if (m1.get(key) !== m2.get(key)) return false
  }
  return true
}

export default isEqual

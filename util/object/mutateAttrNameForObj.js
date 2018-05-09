/**
 * 改变原对象的属性名 注：该方法直接改变原数据 - mutation
 * @param {Object} obj
 * @param {Array} aMatchAttr 二维数组：[[oldAttrName, newAttrName], [oldAttrName, newAttrName], ...]
 *
 * eg
 * let o = {'a': 111,'b': 222}
    mutateAttrNameForObj(o, [['a', 'a111'], ['b', 'b111']])
    log(o) -> {a111: 111, b111: 222}
 */
function mutateAttrNameForObj(obj, aMatchAttr) {
  let m = new Map(aMatchAttr)
  for (let attr of Object.keys(obj)) {
    if (m.has(attr)) {
      obj[m.get(attr)] = obj[attr]
      delete obj[attr]
    }
  }
}

export default mutateAttrNameForObj

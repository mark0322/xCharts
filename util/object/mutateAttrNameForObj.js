/**
 * 改变原对象的属性名 注：该方法直接改变原数据 - mutation
 * @param {Object} obj
 * @param {Array} aMatchAttr 二维数组：[[oldAttrName, newAttrName], [oldAttrName, newAttrName], ...]
 *
 * eg
 * let o = {'a': 111,'b': 222}
    mutateAttrNameForObj(o, [['a', 'x'], ['b', 'y']])
    log(o) -> {x: 111, y: 222}
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

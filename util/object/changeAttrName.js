import deepClone from './deepClone'

/**
 * 更改对象的属性名
 * @param {Object} obj 目标对象
 * @param {Array} aMatchAttr 二维数组
 * 事例: [[oldAttrName, newAttrName], [oldAttrName, newAttrName], ...]
 *
 * eg:
 * let o = {'a': 111,'b': 222}
 *  changeAttrName(o, [['a', 'x'], ['b', 'y']])
 *  -> {x: 111, y: 222}
 */
function changeAttrName(obj = {}, aMatchAttr) {
  const result = deepClone(obj)
  const m = new Map(aMatchAttr)

  for (let attr of Object.keys(result)) {
    if (m.has(attr)) {

      // 新属性名
      result[m.get(attr)] = result[attr]

      // 删除原属性名
      delete result[attr]
    }
  }

  return result
}

export default changeAttrName

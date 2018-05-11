import mutateAttrNameForObj from '../object/mutateAttrNameForObj'

/**
 * 改变数组中对象的属性名  注：该方法直接改变原数据 - mutation
 * @param {Array} arr 包含多个同类对象的数组
 * @param {Array} aMatchAttr 二维数组：[[oldAttrName, newAttrName], [oldAttrName, newAttrName], ...]
 *
 * eg
 * let arr = [{'a': 111,'b': 222}, {'a': 111,'b': 222}]
    mutateAttrNameForObjOfArray(arr, [['a', 'x'], ['b', 'y']])
    arr -> [{'x': 111,'y': 222}, {'x': 111,'y': 222}]
 */
function mutateAttrNameForObjOfArray(arr, aMatchAttr) {
  arr.forEach(d => mutateAttrNameForObj(d, aMatchAttr))
}

export default mutateAttrNameForObjOfArray

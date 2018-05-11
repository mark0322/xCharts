import mapArray from './mapArray'

/**
 * 获取数组(或数组对象指定字段)的平均值
 * @param {Array} arr
 * @param {Function} callback 可选参
 * eg meanArray([1,2,3,4,5]) -> 3
 * eg meanArray([{a:1}, {a:2, b:44}, {a:3, b:33}], d => d.b) -> 38.5
 */
function meanArray(arr, iteratee) {
  let sum = 0,
    tempArr = []
  try {
    tempArr = mapArray(...arguments)
    sum = tempArr.reduce((a, b) => a + b)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return sum / tempArr.length
}

export default meanArray

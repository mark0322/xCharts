import compactArray from './compactArray'

/**
 * 获取数组的最小值
 * @param {Array} arr
 * @param {Function} callback 可选参
 * eg minArray([1,2,3,4,5]) -> 1
 * eg minArray([{a:1}, {a:2, b:44}, {a:3, b:33}], d => d.b) -> 33
 */
function minArray(arr, iteratee = d => d) {
  try {
    arr = compactArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return Math.min.apply(null, arr)
}

export default minArray

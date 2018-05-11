import mapArray from './mapArray'

/**
 * 汇总数组数值
 * @param {Array} arr
 * @param {Function} callback 可选参
 * @return {Number} 数组的汇总值
 * eg sumArray([1,2,3,4,5]) -> 15
 * eg sumArray([{val:1}, {val:2}, {val:3}], d => d.val) -> 6
 */
function sumArray(arr, iteratee = d => d) {
  try {
    arr = mapArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return arr.reduce((a, b) => a + b)
}

export default sumArray

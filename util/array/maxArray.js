import mapArray from './mapArray'

/**
 * 获取数组的最大值
 * @param {Array} arr
 * @param {Function} callback 可选参
 * eg maxArray([1,2,3,4,5]) -> 5
 * eg maxArray([{a:11, b:33}, {a:22, b:44}, {a:33}], d => d.a) -> 11
*/
function maxArray(arr, callback = d => d) {
  try {
    arr = mapArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return Math.max.apply(null, arr)
}

export default maxArray

/**
 * 将一维数组生成为二维数组；并统一指定子数组的元素个数。
 * @param {Array} arr 要被chunk的数组
 * @param {Number} size 要被chunk的子数组大小
 * @return {Array}
 * eg chunk(['a', 'b', 'c', 'd', 'e'], 2) -> [['a', 'b'], ['c', 'd'], ['e']]
 * eg chunk(['a', 'b', 'c', 'd'], 3) -> [['a', 'b', 'c'], ['d']]
 */
function chunk(arr, size = arr.length) {
  const result = []
  for (let i = 0, l = arr.length; i < l;) {
    result.push(arr.slice(i, i += size))
  }
  return result
}

export default chunk

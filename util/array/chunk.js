/**
 * 模仿 lodash 的 _.chunk 函数
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

/**
 * 扁平化一层子数组
 * @param {Array} arr 二维数组
 * @return {Array} 一维数组
 * eg flatten([1, 2, 3, [4, 5, 6]]) -> [1, 2, 3, 4, 5, 6]
 */
function flatten(arr) {
  return arr.reduce((a, b) => a.concat(b), [])
}

export default flatten

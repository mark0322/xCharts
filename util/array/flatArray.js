/**
 * 扁平化一层子数组
 * @param {Array} arr 二维数组
 * @return {Array} 一维数组
 * eg flatArray([1, 2, 3, [4, 5, 6]]) -> [1, 2, 3, 4, 5, 6]
 */
function flatArray(arr) {
  return arr.reduce((a, b) => {
    Array.isArray(b) ? a.push(...b) : a.push(b)
    return a
  }, [])
}

export default flatArray

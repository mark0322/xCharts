/**
 * 将二维数组拆成一维数据
 * @param {Array} arr 二维数组
 * @param {Array} 一维数组
 * eg flatArray([1, 2, 3, [4, 5, 6]]) -> [1, 2, 3, 4, 5, 6]
 */
function flatArray(arr) {
  return arr.reduce((a, b) => {
    Array.isArray(b) ? a.push(...b) : a.push(b)
    return a
  }, [])
}

export default flatArray

/**
 * 将多维数组“扁平化”为一维数据
 * @param {Array} arr 多维数组
 * @return {Array} 一维数组
 * eg deepFlatten([1, 2,[3, 4, [5, 6, ['x', 'y']]]]) -> [1, 2, 3, 4, 5, 6, "x", "y"]
 */
function deepFlatten(arr) {
  return arr.reduce((a, v) => {
    return a.concat(Array.isArray(v) ? deepFlatten(v) : v)
  }, [])
}

export default deepFlatten

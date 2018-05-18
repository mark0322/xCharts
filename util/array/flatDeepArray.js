/**
 * 将多维数组“扁平化”为一维数据
 * @param {Array} arr 多维数组
 * @return {Array} 一维数组
 * eg flatDeepArray([1, 2,[3, 4, [5, 6, ['x', 'y']]]]) -> [1, 2, 3, 4, 5, 6, "x", "y"]
 */
function flatDeepArray(arr) {
  const result = []
  flatArray(arr)
  return result

  function flatArray(arrSub) {
    arrSub.forEach(d => {
      Array.isArray(d) ? flatArray(d) : result.push(d)
    })
  }
}

export default flatDeepArray

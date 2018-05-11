/**
 * 将多维数组拆成一维数据
 * @param {Array} arr 多维数组
 * @param {Array} 一维数组
 * eg flatDeepArray([1, 2,[3, 4, [5, 6, ['x', 'y']]]]) -> [1, 2, 3, 4, 5, 6, "x", "y"]
 */
function flatDeepArray(arr) {
  const tempArr = []
  flatArray(arr)
  return tempArr

  function flatArray(arrSub) {
    arrSub.forEach(d => {
      Array.isArray(d) ? flatArray(d) : tempArr.push(d)
    })
  }
}

export default flatDeepArray

/**
 * 将一维arr中每个值所占sum(arr)的百分比 * matchVal
 * @param {Array} arr
 * @param {Number} matchVal
 * @param {Function} iteratee 可选参
 * @return {Array}
 * eg matchArrayVal([1, 2, 3, 4], 100)  ->  [10, 20, 30, 40]
 * eg matchArrayVal([{val:1},{val:2},{val:3}], 100, o => o.val)  ->  [16.66, 33.33, 50]
*/
function matchArrayVal(arr, matchVal, iteratee) {
  (typeof iteratee === 'function') && (arr = arr.map(iteratee))
  let sum = arr.reduce((a, b) => a + b)
  return arr.map(d => d / sum * matchVal)
}

export default matchArrayVal

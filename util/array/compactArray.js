/**
 * 过滤数组或指定字段中的 NaN / undefined / null / '' 四种数据
 * @param {Array} arr
 * @param {Function} callback 可选参
 * @return {Array} 被过滤后的数组
 *
 * @example
 * compactArray([0, 1, NaN, 2, undefined, 3, null, 4, '', 5])  ->  [0, 1, 2, 3, 4, 5]
 * compactArray([{a:1}, {a:2, b:22}, {a:3, b:33}], d => d.b)  ->  [22, 33]
*/
function compactArray(arr, callback = d => d) {
  const is = Object.is
  arr = arr.reduce((a, b) => {
    b = callback(b)
    const isPassVal = !(is(b, undefined) || is(b, null) || is(b, NaN) || is(b, ''))
    isPassVal && a.push(b)
    return a
  }, [])
  if (arr.length == 0) throw new Error('输入参数有误！')
  return arr
}

export default compactArray

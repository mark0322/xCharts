/**
 * 功能类似array.map(), 其区别如下：
 * mapArray([{a:1}, {a:2, b:44}], d => d.b)  ->  [44]
 * [{a:1}, {a:2, b:44}].map(d => d.b) ->  [undefined, 44]
 *
 * @param {Array} arr
 * @param {Function} callback 可选参
 *
*/
function mapArray(arr, callback = d => d) {
  arr = arr.reduce((a, b) => {
    if (callback(b) !== undefined) {
      a.push(callback(b))
      return a
    }
    return a
  }, [])
  if (!arr[0]) throw new Error('输入参数有误！')
  return arr
}

export default mapArray

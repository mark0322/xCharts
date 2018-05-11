/**
 * 功能类似array.map(), 其区别如下：
 * eg1: let arr = [0, 1, NaN, 2, undefined, 3, null, 4, '', 5]
 * arr.map(d => d + 1)  ->  [1, 2, NaN, 3, NaN, 4, 1, 5, "1", 6]
 * mapArray(arr, d => d + 1)  ->  [1, 2, 3, 4, 5, 6]
 * 
 * eg2: let arr2 = [{a:1}, {a:2, b:22}, {a:3, b:33}]
 * mapArray(arr2, d => d.b)  ->  [22, 33]
 * arr2.map(d => d.b) ->  [undefined, 22, 33]
 *
 * @param {Array} arr
 * @param {Function} callback 可选参
 *
*/
function mapArray(arr, callback = d => d) {
  const is = Object.is
  arr = arr.reduce((a, b) => {
    if (!(is(b, undefined) || is(b, null) || is(b, NaN) || is(b, ''))) {
      if (is(callback(b), undefined)) return a
      a.push(callback(b))
      return a
    }
    return a
  }, [])
  if (arr[0] === undefined) throw new Error('输入参数有误！')
  return arr
}

export default mapArray

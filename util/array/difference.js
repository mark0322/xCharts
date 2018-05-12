/**
 * 取两数组的 “差集”
 * @example difference([1,2,3,4], [3,4,5,6])  ->  [1, 2, 5, 6]
 */
function difference(arr1, arr2) {
  let s1 = new Set(arr1),
    s2 = new Set(arr2)
  for (let item of s2) {
    if (s1.has(item)) {
      s1.delete(item)
      s2.delete(item)
    }
  }
  return [].concat(...s1, ...s2)
}
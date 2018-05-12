/**
 * 取两数组的 “交集”
 * @example common([1,2,3,4], [3,4,5,6])  ->  [3, 4]
 */
function common(arr1, arr2) {
  let s1 = new Set(arr1),
    s2 = new Set(arr2),
    result = [],
    resIndex = 0
  for (let item of s2) {
    if (s1.has(item)) {
      result[resIndex++] = item
    }
  }
  return result
}
/**
 * 取两数组的 “交集”
 * @example intersection([1,2,3,4], [3,4,5,6])  ->  [3, 4]
 */
function intersection(arr1, arr2) {
  let result = [],
    s1 = new Set(arr1),
    s2 = new Set(arr2)
  for (let item of s2) {
    s1.has(item) && result.push(item)
  }
  return result
}

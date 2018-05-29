/**
 * 取两数组的 “交集”
 * @example intersection([1,2,3,4], [3,4,5,6])  ->  [3, 4]
 */
function intersection(arr1, arr2) {
  const s2 = new Set(arr2)
  return arr1.filter(d => s2.has(d))
}

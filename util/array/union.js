/**
 * 取两数组的 “并集”
 * @example union([1,2,3,4], [3,4,5,6])  ->  [1, 2, 3, 4, 5, 6]
 */
function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])]
}

/**
 * 取两数组的 “差集”
 * @example difference([1,2,3,4], [3,4,5,6])  ->  [1, 2, 5, 6]
 */
function difference(arr1, arr2) {
  let s1 = new Set(arr1),
    s2 = new Set(arr2),
    diff1 = [...arr1.filter(d => !s2.has(d))],
    diff2 = [...arr2.filter(d => !s1.has(d))]
  return [...diff1, ...diff2]
}

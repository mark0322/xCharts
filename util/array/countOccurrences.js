/** 
 * 计数数组中值的出现次数
 * @example countOccurrences([1,1,2,1,2,3], 1) -> 3
*/

function countOccurrences(arr, val) {
  return arr.reduce((a, b) => {
    return b === val ? a + 1 : a
  }, 0)
}

export default countOccurrences

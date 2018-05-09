/**
 * 模仿 python 的 zip()
 * eg zip([1,2,3], ['a','b','c']) -> [[1,'a'],[2,'b'],[3,'c']]
 */
function zip() {
  let resultArr = [],
    tempArr = [...arguments],
    minLengthForTempArr = Math.min.apply(null, tempArr.map(d => d.length))

  for (let i = 0; i < minLengthForTempArr; i++) {
    resultArr.push(tempArr.map(d => d[i]))
  }

  return resultArr
}

export default zip

// function zip(arr1, arr2) {
//   let tempArr = []
//   for (let i = 0; i < arr1.length; i++) {
//       tempArr.push([arr1[i], arr2[i]])
//   }
//   return tempArr
// }

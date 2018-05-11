/**
 * 模仿 python 的 zip()
 * eg1 zip([1, 2, 3], ['a', 'b', 'c']) -> [[1, 'a'],[2, 'b'],[3, 'c']]
 * 
 * eg2 zip([1, 2, 3], ['a', 'b', 'c'], ['x', 'y', 'z']) 
 *      ->  [[1, 'a', 'x'],[2, 'b', 'x'],[3, 'c', 'z']]
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

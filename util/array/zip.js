/**
 * 模仿 python 的 zip()
 * eg1 zip([1, 2, 3], ['a', 'b', 'c']) -> [[1, 'a'],[2, 'b'],[3, 'c']]
 * 
 * eg2 zip([1, 2, 3], ['a', 'b', 'c'], ['x', 'y', 'z']) 
 *      ->  [[1, 'a', 'x'],[2, 'b', 'x'],[3, 'c', 'z']]
 */
function zip(...args) {
  if (args.length === 0) return []
  const result = []
  const minLengthForTempArr = Math.min(...args.map(d => d.length))

  for (let i = 0; i < minLengthForTempArr; i++) {
      result.push(args.map(d => d[i]))
  }

  return result
}

export default zip

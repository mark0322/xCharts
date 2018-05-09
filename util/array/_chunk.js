/**
 * 模仿 lodash 的 _.chunk 函数
 * @param {Array} arr 要被chunk的数组
 * @param {Number} size 要被chunk的子数组大小
 * @return {Array} chunkedData
 * eg _chunk(['a', 'b', 'c', 'd'], 2) -> [['a', 'b'], ['c', 'd']]
 * eg _chunk(['a', 'b', 'c', 'd'], 3) -> [['a', 'b', 'c'], ['d']]
*/
function _chunk(arr, size) {
  let chunkArr = [],
      chunkSize = size == 0 ? arr.length : Math.ceil(arr.length / size),
      inputArr = JSON.parse(JSON.stringify(arr))
  for (let i = 0; i < chunkSize; i++) {
      let tempArr = []
      for (let j = 0; j < size; j++) {
          let tempEle = inputArr.shift()
          if (tempEle) tempArr.push(tempEle)
          else break
      }
      chunkArr.push(tempArr)
  }
  return chunkArr
}

export default _chunk

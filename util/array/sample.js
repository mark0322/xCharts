import random from '../number/random'

/**
 * 从数组中随机抽取一个或多个元素
 * 相当于 python 中的 random.choice + random.sample
 * @param {Array} arr 
 * @param {Number} sampleSize 获取随机样本的大小
 * @return {Array | Number}
 * 
 * @example
 * sample([1,2,3,4,5])  ->  任意一数字
 * sample([1,2,3,4,5], 2) ->  该数组中任意两元素组成的数组， 如： [4, 2]
 */
function sample(arr, sampleSize = 1) {
  if (sampleSize === 1) {
    return arr[random(0, arr.length, true)]
  }

  if (arr.length < sampleSize) {
    throw new Error('sampleSize > arr.length!')
  }

  const result = [],
    inputArr = JSON.parse(JSON.stringify(arr))
  while (result.length < sampleSize) {
    let i = random(0, inputArr.length, true)
    result.push(...inputArr.splice(i, 1))
  }
  return result
}
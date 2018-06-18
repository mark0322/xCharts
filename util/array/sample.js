import random from '../number/random'

/**
 * 从数组中随机抽取 1 ~ arr.length 个元素
 * 相当于python的 1)random.choice 2)random.sample 3)random.shuffle
 * @param {Array} arr 
 * @param {Number} sampleSize 获取随机样本的大小
 * @return {Array | Number}
 * 
 * @example
 * eg1: sample([1,2,3,4,5])  ->  任意一数字
 * eg2: sample([1,2,3,4,5], 2) ->  该数组中任意两元素组成的数组， 如： [4, 2]
 * eg3: sample(arr, arr.length) -> 相当于 shuffle() 即随机化数组的元素
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

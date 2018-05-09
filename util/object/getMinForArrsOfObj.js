import flatDeepArray from '../array/flatDeepArray'

/**
 * 获得对象中，所有数组的最小值
 * @param {Object} o 包含数组属性的对象
 * @param {Array} targetArr 可选参 在指定的字段中获得最小值
 *
 * val = {
 *        'email': [28,74,29,3,50,71],
 *        'VPN': [94,61,27,21,92,92],
 *        'VOP': [84,2,12,69,92,17, [1000, 1]],
 *        'x': 'sss',
 *        'y': true
 *     }
 * eg1 getMinForArrsOfObj(val) -> 1
 *
 * eg2 getMinForArrsOfObj(val, ['email', 'VPN']) -> 3
 */
function getMinForArrsOfObj(obj, targetProps = Object.keys(obj)) {
  let tempArr = []
  for (let item of targetProps) {
    if (Array.isArray(obj[item])) {
      tempArr.push(...flatDeepArray(obj[item]))
    }
  }
  return Math.min.apply(null, tempArr)
}

export default getMinForArrsOfObj

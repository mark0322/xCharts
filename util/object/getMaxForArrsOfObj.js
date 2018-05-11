import flatDeepArray from '../array/flatDeepArray'

/**
 * 获得对象中，所有数组的最大值
 * @param {Obje} o 包含数组属性的对象
 * @param {Array} targetArr 可选参 指定数组，以获取指定数组中的其最大值
 * @return {Number}
 *
 * eg1 val = {
 *       'email': [28,74,29,11,50,71],
 *        'VPN': [94,61,27,21,92,92],
 *        'VOP': [84,2,12,69,92,17, [1000, 2]],
 *        'x': 'sss',
 *        'y': true
 *     }
 * getMaxForArrsOfObj(val) -> 1000
 *
 * eg2
 * getMaxForArrsOfObj(val, ['email', 'VPN']) -> 94
 */
function getMaxForArrsOfObj(obj, targetProps = Object.keys(obj)) {
  let tempArr = []
  for (let item of targetProps) {
    if (Array.isArray(obj[item])) {
      tempArr.push(...flatDeepArray(obj[item]))
    }
  }
  return Math.max.apply(null, tempArr)
}

export default getMaxForArrsOfObj

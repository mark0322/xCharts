import deepFlatten from '../array/deepFlatten'

/**
 * 获得对象中的 extent: [最小值, 最大值] 
 * 注：只能获得一层对象的 extent，深层对象无法处理
 *
 * @param {Object} obj
 * @param {Array} targetAttrs 可选参 指定数组，以获取指定数组中的 [最小值, 最大值]
 * @return {Array} [最小值, 最大值]
 *
 *
 * val = {
 *        'email': [28,74,29,3,50,71],
 *        'VPN': [94,61,27,21,92,92],
 *        'VOP': [84,2,12,69,92,17, [1000, 1]],
 *        'x': 'sss',
 *        'y': true,
     'z': -30
 *     }
 * eg: extentForAttrs(val) -> [-30, 1000]
 *
 * eg: extentForAttrs(val, ['email', 'VPN']) -> [3, 94]
 */
function extentForAttrs(obj, targetAttrs = Object.keys(obj)) {
  let array = [] 

  for (let attr of targetAttrs) {
    if (Array.isArray(obj[attr])) {
      array.push(...deepFlatten(obj[attr]))
    }
    if (typeof obj[attr] === 'number') {
     array.push(obj[attr])
    }
  }

  // 过滤非数字
  array = array.filter(d => typeof d === 'number')

  return [Math.min(...array), Math.max(...array)]
}

export default extentForAttrs

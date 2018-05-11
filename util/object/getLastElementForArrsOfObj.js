/**
 * 获得对象中，所有数组(或指定数组)的末尾值
 * @param {Object} obj 包含数组属性的对象
 * @param {Array} targetArr 可选参 获得指定数组，以获取其末尾只
 *
 * eg
 * val = {
 *        'email': [28,74,29,3,50,71],
 *        'VPN': [94,61,27,21,92,92],
 *        'VOP': [84,2,12,69,92,17],
 *        'x': 'sss',
 *        'y': true
 *     }
 * eg1 getLastElementForArrsOfObj(val) -> {email: 71, VPN: 92, VOP: 17}
 *
 * eg2 getLastElementForArrsOfObj(val, ['email', 'VPN']) -> {email: 71, VPN: 92}
 */
function getLastElementForArrsOfObj(obj, targetProps = Object.keys(obj)) {
  let tempObj = {}
  for (let item of targetProps) {
    if (Array.isArray(obj[item])) {
      tempObj[item] = obj[item].slice(-1)[0]
    }
  }
  return tempObj
}

export default getLastElementForArrsOfObj

/**
 * 获得对象中，数组的末尾值
 * @param {Object} obj 目标对象
 * @param {Array} [attrs = allAttrs] 指定要获取其末尾值的属性名
 *
 * eg
 * val = {
 *        'email': [28,74,29,3,50,71],
 *        'VPN': [94,61,27,21,92,92],
 *        'VOP': [84,2,12,69,92,17],
 *        'x': 'sss',
 *        'y': true
 *     }
 * eg1 getLastElementForAttrs(val) -> {email: 71, VPN: 92, VOP: 17}
 *
 * eg2 getLastElementForAttrs(val, ['email', 'VPN']) -> {email: 71, VPN: 92}
 */
function getLastElementForAttrs(obj = {}, attrs = Object.keys(obj)) {
  const result = {}

  for (let attr of attrs) {
    if (Array.isArray(obj[attr])) {
      result[attr] = obj[attr].slice(-1)[0]
    }
  }

  return result
}

export default getLastElementForAttrs

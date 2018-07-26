/**
 * 为字符串首、尾去掉空格
 * @param {String} s
 * @return {String}
 */
function trim(s) {
  return s.replace(/^\s+ | \s+$/g, '')
}

export default trim

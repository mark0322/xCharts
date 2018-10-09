// 接口路径转驼峰命名
// path: /user/info => userInfo
function camelCase(target) {
  return target
    .replace(/_/g, '/')
    .replace(/\//, '')
    .replace(/\/\w+/g, str => {
      return str
        .substring(1, str.length)
        .replace(/[a-z]/, s => s.toUpperCase());
    });
}

export default camelCase;

// 测试函数的执行时间
function timeTaken(callback) {
  console.time('timeTaken')
  const r = callback()
  console.timeEnd('timeTaken')
  return r
};

export default timeTaken
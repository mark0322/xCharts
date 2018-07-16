/**
 * 分时函数
 * @param {Array} ary 创建节点的数据
 * @param {Function} fn 创建节点的逻辑函数
 * @param {Number} count 每一批创建的节点数量
 */

function timeChunk(ary, fn, count = 1) {
  let t

  const start = function() {
    for (let i = 0; i < Math.min(count, ary.length); i++) {
      fn(ary.shift())
    }
  }

  return function() {
    t = setInterval(function() {
      if (ary.length === 0){ // 如果全部节点都被创建好
        return clearInterval(t)
      }
      start()
    }, 200) // 分批执行的时间间隔，也可以用参数的形式传入
  }
}

export default timeChunk

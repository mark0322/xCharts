// *** 该模块作用：使用单例模式创建 tooltips 的 <div> 外壳， 共所有 charts 使用***

/** 
 * 创建tooltip的最外层 div wrap
 * @return div-tooltipWrap 的DOM对象
*/
const initTooltipWrap = function() {

  // 意图为 获取 Vue 的最外层 <div id='app'>
  const appWrap = document.querySelector('div')

  const tooltipWrap = document.createElement('div')
  tooltipWrap.classList.add('stiCharts-tooltip-wrap')
  tooltipWrap.style.cssText = `
    padding:10px 15px;
    background:rgba(0,0,0,0.7);
    position:fixed;
    color:white;
    border-radius: 10px;
    display:none;
    z-index:9999;`

  appWrap.appendChild(tooltipWrap)
  return tooltipWrap
}

// 单例模式 - 模板
const getSingleton = function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn(...arguments))
  }
}

/** 
 * 给 <div> - tooltipWrap 包装成单例模式
 * @return div-tooltipWrap 的DOM对象
*/
const singletonInitTooltipWrap = getSingleton(initTooltipWrap)

export default singletonInitTooltipWrap

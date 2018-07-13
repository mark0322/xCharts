/** 
 * 创建tooltip的最外层 div wrap
 * 
 * @private
 * @return div-tooltipWrap 的DOM对象
*/
const initTooltipWrap = function() {
  // tooltip 位于 body 子级
  const body = document.querySelector('body')

  const tooltipWrap = document.createElement('div')
  tooltipWrap.classList.add('xCharts-tooltip-wrap')
  tooltipWrap.style.cssText = `
    background:rgba(0,0,0,0.7);
    border-radius: 10px;
    padding:10px 15px;
    position:fixed;
    display:none;
    z-index:9999;
    color:white;`

  body.appendChild(tooltipWrap)
  return tooltipWrap
}

/** 
 * 单例模式 - 模板
*/
const getSingleton = function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn(...arguments))
  }
}

export default getSingleton(initTooltipWrap)

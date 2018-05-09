/**
 * @param {Object} options 绘制splitline的配置项数据
 * options 配置项 eg
 // splitline({
 //    g: g, // **必填参， 总的 <g>
 //    axisMarks: xMarks, // **必填参，scale.ticks() -> x轴刻度
 //    axisWidth: axisWidth, // **必填参，坐标系宽度
 //    axisHeight: axisHeight, // **必填参，坐标系高度
 //    xScale: x, // **必填参 x轴比例尺
 //    yScale: y, // **必填参 y轴比例尺
 //    isHoriz: true, // 可选参， 默认为垂直分割线
 //    line: { // 可选参
 //      width: 2, // 默认值 2
 //      color: '#7aa', // 默认值 '#999'
 //      opacity: 0.3 // 默认值 0.3
 //    },
 //    dashed: { // 可选参， 默认为实线
 //      isDashed: true,
 //      dasharray: '2 4' // 默认值 '2 4'
 // })
 */
function splitline(options) {

  // *** 全局数据 ***
  const marks = options.axisMarks,
    g = options.g,
    x = options.xScale,
    y = options.yScale,
    axisHeight = options.axisHeight,
    axisWidth = options.axisWidth,
    line = options.line || { width: 2, color: '#7aa', opacity: 0.3 },
    dashed = options.dashed || { dasharray: '2 4' }

  // 判断必填参，是否被赋值
  if (!marks) throw Error('options.axisMarks 未赋值！')
  if (!g) throw Error('options.g 未赋值！')
  if (!x) throw Error('option.xScale 未赋值')
  if (!y) throw Error('option.yScale 未赋值')
  if (!axisHeight) throw Error('options.axisHeight 未赋值！')
  if (!axisWidth) throw Error('options.axisWidth 未赋值！')

  const splitline = g.append('g')
    .attr('class', 'splitline')
    .attr('stroke', line.color)
    .attr('stroke-width', line.width)
    .attr('opacity', line.opacity)
    .selectAll('line')
    .data(marks.slice(1))
    .enter()
    .append('line')

  if (options.isHoriz) {
    splitline
      .attr('x1', x)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', axisHeight)
  } else {
    splitline
      .attr('x1', 0)
      .attr('y1', y)
      .attr('x2', axisWidth)
      .attr('y2', y)
  }

  if (dashed.isDashed) {
    splitline.attr('stroke-dasharray', dashed.dasharray)
  }
}

export default splitline

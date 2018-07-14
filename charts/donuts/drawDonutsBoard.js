import * as d3 from 'd3'
import sumArray from '../../util/array/sumArray'

/**
 * 绘制一组或多组类似’汽车仪表板‘的 donut 图
 * @param {DOM} container 包裹SVG画布的父级DOM容器
 * @param {Object} options 配置参数
 */

function drawDonutsBoard(container, options) {
  container.innerHTML = '' // 清空 容器内容
  let // *** 全局参数 ***
    data = options.data,
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    gap = options.donutGap,
    donutWidth = options.donutWidth,
    outerRadius,
    innerRadius,
    valLabel = options.valLabel,
    nameLabel = options.nameLabel

  // 计算 donut 的 outerRadius
  let tempOuterRadius = (axisWidth - gap * (data.length - 1)) / (data.length * 2)
  if (tempOuterRadius > axisHeight / 2) {
    outerRadius = axisHeight / 2
    innerRadius = outerRadius - donutWidth
  } else {
    outerRadius = tempOuterRadius
    innerRadius = outerRadius - donutWidth
  }

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left + outerRadius}, ${padding.top + outerRadius})`)

  const arcPath = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(outerRadius - innerRadius)

  // bg donus data
  const bgDonutsData = [{
      startAngle: Math.PI * -0.75,
      endAngle: Math.PI * 0.75
    }]

  // actual donuts data - scale
  const actualScale = d3.scaleLinear()
    .domain([0, sumArray(data, d => d.val)])
    .range([-0.75, 0.75])

  // 每次循环 绘制一组 donut board
  for (let i = 0; i < data.length; i++) {
    const gBoard = g.append('g')
      .attr('class', 'gBoard')
      .attr('transform', `translate(${i * (gap + 2 * outerRadius)}, 0)`)

    // draw bgDonuts
    gBoard.selectAll('.bgDonuts')
      .data(bgDonutsData)
      .enter()
      .append('path')
      .attr('class', 'bgDonuts')
      .attr('d', d => arcPath(d))
      .attr('fill', data[i].color)
      .attr('opacity', 0.3)

    // define actual donuts data
    const actualDonutsData = [{
      startAngle: Math.PI * -0.75,
      endAngle: Math.PI * actualScale(data[i].val)
    }]

    // draw actualDonuts
    gBoard.selectAll('.actualDonuts')
      .data(actualDonutsData)
      .enter()
      .append('path')
      .attr('class', 'actualDonuts')
      .attr('d', d => arcPath(d))
      .attr('fill', data[i].color)
      .attr('opacity', 0.8)

    // text - val
    gBoard.append('text')
      .attr('class', 'donut-val')
      .text(data[i]['val'])
      .attr('text-anchor', 'middle')
      .attr('fill', valLabel.color)
      .attr('font-size', valLabel.fontSize)

    // text - name
    gBoard.append('text')
      .attr('class', 'donut-name')
      .attr('y', () => innerRadius * Math.sqrt(2) / 2)
      .text(data[i]['name'])
      .attr('text-anchor', 'middle')
      .attr('dx', nameLabel.dx)
      .attr('dy', nameLabel.dy)
      .attr('fill', nameLabel.color)
  }
}

export default drawDonutsBoard

// *** options 模板 ***
// const options = {
//   data: [
//       {name: '待通报', val: 487, color: 'red'},
//       {name: '已通报', val: 386, color: '#122645'},
//       {name: '处置中', val: 108, color: '#122645'},
//       {name: '已整改', val: 815, color: '#1b5b6c'}
//   ],
//   padding: { top: 20, left: 40, right: 40, bottom: 10 },
//   donutGap: 20, // 每组环 的间距
//   donutWidth: 30, // 环的宽度
//   valLabel: { // 环中间的 value 值
//       color: '#333',
//       fontSize: 22,
//       dy: '1em', // TODO
//       dx: '1em' // TODO
//   },
//   nameLabel: { // 环下部的 name 值
//       color: '#333',
//       fontSize: 22,
//       dy: '1em',
//       dx: '0em'
//   }
// }

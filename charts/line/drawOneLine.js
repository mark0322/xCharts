import * as d3Selection from 'd3-selection'
import * as d3Axis from 'd3-axis'
import * as d3Scale from 'd3-scale'
import * as d3Array from 'd3-array'
import * as d3Shape from 'd3-shape'
const d3 = Object.assign({}, d3Selection, d3Scale, d3Array, d3Axis, d3Shape)

import parseStamp2Day from './util/time/parseStamp2Day'
import zip from './util/array/zip'

function drawOneLine(container, options) {
  container.innerHTML = ''; // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    line = options.line || { color: 'steelblue' },
    axis = options.axis || {},
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom

  data.date = data.date.map(parseStamp2Day) // parse date
  const lineData = zip(data.date, data.val) // 将数据处理成 d3.line()可用的数据

  const // 定义画布 & gWrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'gWrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const // 比例尺
    x = d3.scaleBand()
      .domain(data.date)
      .range([0, axisWidth])
  x.align(0)

  const
    y = d3.scaleLinear().range([axisHeight, 0])
    axis.yClamp && axis.yClamp.length === 2
      ? y.domain([axis.yClamp[0], axis.yClamp[1]])
      : y.domain([0, d3.max(data.val) * 1.1])

  try { // backgroundBar
    const bgBar = options.bgBar || {}
    if (bgBar.show) {
      bgBar.padding ? x.padding(bgBar.padding) : x.padding(0.5)
      const gBGbars = g.append('g').attr('class', 'bg-bars');

      // draw bgBar
      gBGbars
        .attr('fill', d => bgBar.color || '#666')
        .attr('fill-opacity', bgBar.opacity || 0.5)
        .selectAll('rect')
        .data(data.date)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(data.date[i]))
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('height', axisHeight)
    }
  } catch (e) {
    console.warn('others - backgroundBar:\n', e)
  }

  try { // draw area
    const area = options.area || {}
    if (area.show) {
      const areaPath = d3.area()
        .x(d => x(d[0]) + x.bandwidth() / 2)
        .y0(() => axisHeight)
        .y1(d => y(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.99))

      g.append('path')
        .attr('class', 'area-path')
        .attr('d', areaPath(lineData))
        .attr('fill', area.color)
        .attr('fill-opacity', area.opacity)
    }

    // area 的渐变
    const gradient = area.linearGradient || {}
    if (gradient.show) {

      // define gradient
      let linearGradient = g.append('g')
        .attr('class', 'linearGradient')
        .append('defs')
        .append('linearGradient')
        .attr('id', 'gradientLinear')
        .attr('x1', '50%')
        .attr('y1', '0%')
        .attr('x2', '50%')
        .attr('y2', '100%')

      linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${gradient.topColor}`)
      linearGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${gradient.bottomColor}`)

      g.select('g.gWrap path.area-path')
        .attr('fill', 'url(#gradientLinear)')
    }
  } catch (e) {
    console.warn('draw area:\n', e)
  }

  try { // draw line

    // 处理数据，以符合 d3.line()
    const linePath = d3.line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.99))

    g.append('path')
      .attr('class', 'line-path')
      .datum(lineData)
      .attr('d', linePath)
      .attr('fill', 'none')
      .attr('stroke', d => line.color || 'steelblue')
      .attr('stroke-width', d => line.width || 2)
      .attr('stroke-opacity', d => line.opacity || 0.9)
  } catch (e) {
    console.warn('draw line:\n', e)
  }

  try { // axis相关

    // define axis
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // 数值轴的 ticks 个数
    axis.yAxisTicksNum && yAxis.ticks(axis.yAxisTicksNum)

    // draw axis
    const gXAxis = g.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
      .call(xAxis)
    const gYAxisyAxis = g.append('g')
      .attr('class', 'axis yAxis')
      .call(yAxis)

    { // axis unit
      const xAxisUnit = axis.xAxisUnit || {};
      if (xAxisUnit.name) {
        gXAxis
          .append('text')
          .text(xAxisUnit.name)
          .attr('x', axisWidth)
          .attr('y', '1.2em')
          .attr('fill', () => xAxisUnit.fontColor || 'white')
          .attr('font-size', xAxisUnit.fontSize)
          .attr('dx', xAxisUnit.fontDx)
          .attr('dy', xAxisUnit.fontDy)
      }
      const yAxisUnit = axis.yAxisUnit || {};
      if (yAxisUnit.name) {
        gYAxisyAxis
          .append('text')
          .text(yAxisUnit.name)
          .attr('y', '-0.2em')
          .attr('text-anchor', 'middle')
          .attr('fill', () => yAxisUnit.fontColor || 'white')
          .attr('font-size', yAxisUnit.fontSize)
          .attr('dx', yAxisUnit.fontDx)
          .attr('dy', yAxisUnit.fontDy)
      }
    }
  } catch (e) {
    console.warn('axis相关:\n', e);
  }

  try { // splitline相关
    const splitline = options.splitline || {};
    if (splitline.show) {
      g.append('g')
        .attr('stroke', () => splitline.color || '#ccc')
        .attr('stroke-width', () => splitline.lineWidth || 1)
        .attr('stroke-dasharray', () => splitline.dashMode ? '2 5' : 0)
        .attr('class', 'splitline')
        .selectAll('line')
        .data(y.ticks(axis.yAxisTicksNum).slice(1))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', axisWidth)
        .attr('y2', y)
    }
  } catch (e) {
    console.warn('splitline相关:\n', e)
  }

  (function others() {

    // const tooltip = options.tooltip || {};
    // if (tooltip.show) {// tooltip 相关
    //     const oDiv = document.createElement('div');
    //     oDiv.classList.add('bar-tooltip');
    //     oDiv.style.cssText = 'padding:10px 15px;background:rgba(0,0,0,0.7);position:fixed;color:white;border-radius: 10px;display:none;'
    //     container.appendChild(oDiv);
    //     const rects = g.selectAll('.bars rect');

    //     rects
    //         .on('mousemove', d => {
    //             oDiv.style.left = d3.event.pageX + 2 + 'px';
    //             oDiv.style.top = d3.event.pageY + 2 + 'px';
    //             oDiv.innerHTML = d;
    //             oDiv.style.display = 'block';
    //         })
    //         .on('mouseout', () => oDiv.style.display = 'none');
    // }

    try { // axisStyle
      const gAxises = g.selectAll('.axis');
      axis.ticksColor && gAxises.selectAll('g.tick text').attr('fill', axis.ticksColor);
      if (axis.axisLineColor) {
        gAxises.selectAll('path.domain').attr('stroke', axis.axisLineColor);
        gAxises.selectAll('g.tick line').attr('stroke', axis.axisLineColor);
      }
      if (axis.xAxis) {
        if (axis.xAxis.hideLine) {
          g.select('.xAxis').selectAll('path.domain').remove();
          g.select('.xAxis').selectAll('g.tick line').remove();
        }
        axis.xAxis.hideTicks && g.select('.xAxis').selectAll('g.tick text').remove();
      }
      if (axis.yAxis) {
        if (axis.yAxis.hideLine) {
          g.select('.yAxis').selectAll('path.domain').remove();
          g.select('.yAxis').selectAll('g.tick line').remove();
        }
        axis.yAxis.hideTicks && g.select('.yAxis').selectAll('g.tick text').remove();
      }
    } catch (e) {
      console.warn('others - axisStyle:\n', e)
    }
  })()
}

export default drawOneLine

// *** options 数据模板 ***
// const options = {
//     data: {// 必填参
//         date: [1519833600000, 1519920000000, 1520006400000, 1520092800000, 1520179200000, 1520265600000, 1520352000000],
//         val: [75, 60, 88, 30, 90, 72, 65]
//     },
//     line: { // 可选参
//         color: 'yellow', // 可选参 (默认值为 'steelblue')
//         width: 2,
//         opacity: 0.8,
//         label: { // 可选参; 将num值直接显示
//             show: true,
//             fontSize: 12, // 可选参
//             fontColor: '#eee', // 可选参
//             fontDx: 3, // 可选参； 使unit沿x轴偏移
//             fontDy: -3 // 可选参； 使unit沿y轴偏移
//         }
//     },
//     splitline: {// 可选参
//         show: true,
//         color: '#74706d', // 可选参
//         lineWidth: 1, // 可选参
//         dashMode: true // 可选参 (默认为实线，若要虚线，设true)
//     },
//     axis: {// 可选参
//         axisLineColor: '#497197', // 可选参
//         ticksColor: '#ccc', // 可选参
//         yAxisTicksNum: 8, // 可选参， 用于设置 num 轴的 ticks 个数
//         xAxis: {

//             // hideLine: true, // 可选参
//             // hideTicks: true, // 可选参
//         },
//         yAxis: {
//             hideLine: true // 可选参

//             // hideTicks: true, // 可选参
//         },

//         // xAxisUnit: {
//             // name: 'date',
//             // fontSize: 14,   // 可选参
//             // fontColor: '#9ee' // 可选参
//             // fontDx: 10, // 可选参； 使unit沿x轴偏移
//             // fontDy: 10, // 可选参； 使unit沿y轴偏移
//         // },
//         // yAxisUnit: {
//             // name: 'value',
//             // fontSize: 14,   // 可选参
//             // fontColor: '#9ee' // 可选参
//             // fontDx: 10, // 可选参； 使unit沿x轴偏移
//             // fontDy: 10, // 可选参； 使unit沿y轴偏移
//         // },
//         yClamp: [0, 100] // 可选参；若y轴需要制定刻度区间，设此参数，否则，y轴参数区间自适应
//     },
//     tooltip: { // 可选参
//         show: true
//     },

//     // 可选参；(默认为40); 作用:设置坐标系离画布上、下、左、右侧距离
//     padding: { top: 20, left: 30, right: 20, bottom: 20 },
//     bgBar: {
//         show: true,
//         padding: 0.3, // 0~1
//         color: '#999',
//         opacity: 0.1
//     },
//     area: {
//         show: true,
//         color: 'cyan',
//         opacity: 0.2,
//         linearGradient: {
//             show: true,
//             topColor: '#0d2b3f',
//             bottomColor: '#e5eb86'
//         }
//     }
// }

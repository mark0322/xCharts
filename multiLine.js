import * as d3 from 'd3'
import splitline from './chart_modules/splitline'
import zip from './util/array/zip'
import getLastElementForArrsOfObj from './util/object/getLastElementForArrsOfObj'
import getMaxForArrsOfObj from './util/object/getMaxForArrsOfObj'

function multiLine(container, options) {
  container.innerHTML = '' // 清空 容器内容
  const // *** 全局数据 ***
    data = options.data || {},
    lines = options.lines || {},
    lineColor = lines.color || d3.schemeCategory10,
    axis = options.axis || {},
    padding = options.padding || { top: 40, left: 40, right: 40, bottom: 40 },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    linesName = Object.keys(data.val)

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'gWrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const // 比例尺
    x = d3.scaleTime()
      .domain([data.date[0], data.date[data.date.length - 1]])
      .rangeRound([0, axisWidth]),
    y = d3.scaleLinear()
      .domain([0, getMaxForArrsOfObj(data.val) * 1.1])
      .rangeRound([axisHeight, 0]),
    z = d3.scaleOrdinal(lineColor) // 各 line 的颜色
      .domain(linesName)

  try { // spline
      let xMarks = null // x 轴的 刻度
      data.date.length < 10
        ? xMarks = x.ticks(data.date.length)
        : xMarks = x.ticks(8)
      let yMarks = y.ticks().slice(1)

      // 绘制垂直 splitline
      splitline({
          g: g, // 必填参， 总的 <g>
          axisMarks: xMarks, // 必填参，scale.ticks() -> x轴刻度
          axisWidth: axisWidth, // 必填参，坐标系宽度
          axisHeight: axisHeight, // 必填参，坐标系高度
          xScale: x, // 必填参 x轴比例尺
          yScale: y, // 必填参 y轴比例尺
          isHoriz: true, // 可选参， 默认为垂直分割线
          line: { // 可选参
              width: 2, // 默认值 2
              color: '#7aa', // 默认值 '#999'
              opacity: 0.3 // 默认值 0.3
          },
          dashed: { // 可选参， 默认为实线
              isDashed: true,
              dasharray: '2 4' // 默认值 '2 4'
          }
      })

      // 绘制水平 splitline
      splitline({
          g: g, // 必填参， 总的 <g>
          axisMarks: yMarks, // 必填参，scale.ticks() -> x轴刻度
          axisWidth: axisWidth, // 必填参，坐标系宽度
          axisHeight: axisHeight, // 必填参，坐标系高度
          xScale: x, // 必填参 x轴比例尺
          yScale: y, // 必填参 y轴比例尺
          line: { // 可选参
              width: 2, // 默认值 2
              color: '#7aa', // 默认值 '#999'
              opacity: 0.3 // 默认值 0.3
          },
          dashed: { // 可选参， 默认为实线
              isDashed: true,
              dasharray: '2 4' // 默认值 '2 4'
          }
      })
  } catch (e) {
      console.warn('multiLine-spline\n', e)
  }

  try { // draw lines
    const linePath = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))

    // draw lines
    const gWrapLines = g.append('g').attr('class', 'gWrapLines')

    // linesName的数据：拿到 data.val 下每条线数组的最后一个元素
    const xTextVal = getLastElementForArrsOfObj(data.val)

    for (let item of linesName) {
      let gOneLineWrap = gWrapLines.append('g')
        .attr('eventIndex', item)
        .attr('class', 'oneLineWrap')

      gOneLineWrap
        .append('path')
        .attr('class', item)
        .datum(zip(data.date, data.val[item]))
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', z(item))
        .attr('stroke-width', d => lines.width ? lines.width : 2)

      // lines name
      gOneLineWrap.append('text')
        .attr('x', x(data.date[data.date.length - 1]))
        .attr('y', y(xTextVal[item]))
        .text(item)
        .attr('fill', z(item))
        .attr('dy', '0.2em')
        .attr('dx', '0.3em')
        .attr('font-size', lines.linesName.fontSize)
    }
  } catch (e) {
    console.warn('multiLine-lines\n', e)
  }

  try { // axis相关

    // define axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    if (data.date.length < 10) { // axis marks
      const tickFormat = x.tickFormat(data.date.length, '%m %d')
      xAxis.ticks(data.date.length, tickFormat)
    } else {
      const tickFormat = x.tickFormat(8, '%m %d')
      xAxis.ticks(8, tickFormat)
    }

    // draw axis
    g.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
      .call(xAxis)
    g.append('g')
      .attr('class', 'axis yAxis')
      .call(yAxis)

    // axis unit
    // const numUnit = data.numUnit || {};
    // if (numUnit.name) {
    //     g_xAxis
    //         .append('text')
    //         .text(numUnit.name)
    //         .attr('x', axisWidth)
    //         .attr('y', '1.2em')
    //         .attr('fill', () => numUnit.fontColor ? numUnit.fontColor : 'white')
    //         .attr('font-size', numUnit.fontSize)
    //         .attr('dx', numUnit.fontDx)
    //         .attr('dy', numUnit.fontDy);
  } catch (e) {
    console.warn('multiLine-axis\n', e)
  }

  (function others() {
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

export default multiLine

// ** 参数模板 **
// const options = {
//   data: { // 必填参
//       date: [1519833600000, 1519920000000, 1520006400000,
//             1520092800000, 1520179200000, 1520265600000],
//       val: {
//           'email': [28, 74, 29, 11, 50, 71],
//           'VPN': [94, 61, 27, 21, 92, 92],
//           'VOP': [84, 2, 12, 69, 92, 171]
//       }
//   },
//   lines: { // 可选参

//       // padding: 0.5,   // 可选参; 作用：设bar的宽度百分比；参数值为0~1;
//       label: { // 可选参; 将num值直接显示
//           show: true,
//           fontSize: 12, // 可选参
//           fontColor: '#eee', // 可选参
//           fontDx: 3, // 可选参； 使unit沿x轴偏移
//           fontDy: -3 // 可选参； 使unit沿y轴偏移
//       },
//       color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
//       curve: true,
//       lineWidth: 2,
//       linesName: {
//           fontSize: 12
//       }
//   },
//   splitline: { // 可选参
//       show: true,
//       color: '#74706d', // 可选参
//       lineWidth: 1, // 可选参
//       dashMode: true // 可选参 (默认为实线，若要虚线，设true)
//   },
//   axis: { // 可选参
//       axisLineColor: '#497197', // 可选参
//       ticksColor: '#ccc', // 可选参
//       xAxis: {

//           // hideLine: true, // 可选参
//           // hideTicks: true // 可选参
//           unit: { // 可选参
//               name: 'num',
//               fontSize: 14,   // 可选参
//               fontColor: '#9ee' // 可选参

//               // fontDx: 10, // 可选参； 使unit沿x轴偏移
//               // fontDy: 10, // 可选参； 使unit沿y轴偏移
//           }
//       },
//       yAxis: {

//           // hideLine: true, // 可选参
//           // hideTicks: true // 可选参
//           unit: { // 可选参
//               name: 'num',
//               fontSize: 14,   // 可选参
//               fontColor: '#9ee' // 可选参

//               // fontDx: 10, // 可选参； 使unit沿x轴偏移
//               // fontDy: 10, // 可选参； 使unit沿y轴偏移
//           }
//       }
//   },

//   // 可选参；(默认为40); 作用:设置坐标系离画布上、下、左、右侧距离
//   padding: { top: 20, left: 30, right: 40, bottom: 20 }
// }

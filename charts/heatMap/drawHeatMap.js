import * as d3 from 'd3'
import flatArray from '../../util/array/flatArray'

function drawHeatMap(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data || {},
    blocks = options.blocks || {},
    gap = blocks.gap,
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    axisHeight = svgHeight - padding.top - padding.bottom,
    axisWidth = svgWidth - padding.left - padding.right,
    maxVal = Math.max.apply(null, flatArray(data)),
    interpolateColor = d3.interpolate(blocks['minColor'], blocks['maxColor'])

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  // draw blocks
  let blockHeight = axisHeight / data.length - gap
  for (let i = 0; i < data.length; i++) {
    let blockWidth = axisWidth / data[i].length - gap
    g.append('g')
      .attr('class', 'g-row')
      .selectAll('rect')
      .data(data[i])
      .enter()
      .append('rect')
      .attr('height', blockHeight)
      .attr('width', blockWidth)
      .attr('x', (d, i) => (blockWidth + gap) * i)
      .attr('y', d => (blockHeight + gap) * i)
      .attr('fill', d => interpolateColor(d / maxVal))
  }
}

export default drawHeatMap

// *** 数据模板 ***
// const options = {
//   data: [
//     [1,21,33,14,95,16,7],
//     [11,33,55,99,21],
//     [1,9,33,54],
//     [1,22,3,4,5,6,7,8,9],
//     [81,45,32,7,4,99,10]
//   ],
//   blocks: { 
//       // 用作 heatMap 的颜色映射
//       minColor: '#117fb8',
//       maxColor: '#23ece1',

//       // 定义每个 block 的间距
//       gap: 4, // 可选参 @default 1

//       label: { // TODO 
//           color: '#333', // 可选参 @default 'steelblue';
//           fontSize: 18
//       }
//   },

//   // 可选参；(默认为40); 作用:设置坐标系离画布上、下、左、右侧距离
//   padding: { top: 40, left: 40, right: 40, bottom: 40 }
// }

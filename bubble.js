import * as d3Selection from 'd3-selection'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Scale from 'd3-scale'
import * as d3Array from 'd3-array'
const d3 = Object.assign({}, d3Selection, d3Hierarchy, d3Scale, d3Array)

/**
 * d3 绘制的 气泡图
 * @param container 包裹svg chart的div容器
 * @param options chart的配置参数 (类似echarts)
 */
function bubble(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    bubbles = options.bubbles || {},
    padding = options.padding || { top: 0, left: 0, right: 0, bottom: 0 },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const pack = d3.pack()
    .padding(() => bubbles.padding ? bubbles.padding : 3)
    .size([axisWidth, axisHeight])

  const root = d3.hierarchy({ children: data })
    .sum(d => Math.sqrt(d.count) + 3) // Math.sqrt(d.count) + 3目的是：当 val 为 0 时， ○ 大小适中
    .each(d => {
      d.group = d.data.groups;
    })

  const node = g.selectAll('.node')
    .data(pack(root).leaves())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('eventIndex', d => d.data.code)
    .attr('parent_code', d => d.data.parent_code)
    .attr('parent_name', d => d.data.parent_name)

  try { // draw bubble

    // circle
    const bubbleColor = bubbles.color || 'steelblue'
    node.append('circle')
      .attr('r', d => d.r)
      .attr('id', d => d.data.parent_code)
      .attr('fill', d => {
        if (Array.isArray(bubbleColor)) {
          return bubbleColor[d.group]
        }
        return bubbleColor
      })

    { // label
      const label = bubbles.label || {}
      node.append('clipPath')
        .attr('id', d => 'clip-' + d.data.parent_code)
        .append('use')
        .attr('xlink:href', d => '#' + d.data.parent_code)

      node.append('text')
        .attr('clip-path', d => `url(#clip-${d.data.parent_code})`)
        .attr('class', 'label')
        .selectAll('tspan')
        .data(d => [d.data.name, d.data.count])
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i == 0 ? '0em' : '1.2em')
        .attr('text-anchor', 'middle')
        .text(d => d)
        .attr('font-size', (d, i) => {
          return i == 0 ? label.name.fontSize : label.val.fontSize
        })
        .attr('fill', (d, i) => {
          return i == 0 ? label.name.fontColor : label.val.fontColor
        })
        .attr('font-weight', (d, i) => {
          return i == 0 ? label.name.fontWeight : label.val.fontWeight
        })
    }

    // tooltip - title
    node.append('title')
      .text(d => d.data.name + '\n' + d.data.count)

    // border
    const border = bubbles.border || {}
    if (border.show) {
      let interpolateColor,
        isMappingColor = false

      // mapping color
      if (border.mappingColor && border.mappingColor.length == 2) {
        interpolateColor = d3.scaleLinear()
          .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
          .range([border.mappingColor[0], border.mappingColor[1]])
        isMappingColor = true
      }

      g.selectAll('g.node circle')
        .attr('stroke', d => {
          return isMappingColor ? interpolateColor(d.data.count) : border.color
        })
        .attr('stroke-width', border.width)
    }
  } catch (e) {
    console.warn('draw bubble', e)
  }

  try { // bubble style

    // bubble 的渐变
    const gradient = bubbles.linearGradient || {}
    if (gradient.show) {

      // define gradient
      let linearGradient = g.append('g')
        .attr('class', 'linearGradient')
        .append('defs')
        .append('linearGradient')
        .attr('id', 'bubbleGradientLinear')
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

      g.selectAll('g.node circle')
        .attr('fill', 'url(#bubbleGradientLinear)')
    }

  } catch (e) {
    console.warn('bubble style', e)
  }
}

export default bubble

// *** 参数 模板 ***
// const options = {
//     /** data {Array}
//      * @param {String} name 必填参，用于显示 block 的 label
//      */
//     data: [
//         {name: '邮件', val: 154, groups: 0},
//         {name: 'VOIP', val: 267, groups: 1},
//         {name: 'VPN', val: 189, groups: 2}
//     ],
//     bubbles: { // 可选参

//         // @param {String | Array}; 若为Array则需分为options.data分groups，以指定groups颜色
//         color: '#15b7c9', // 可选参

//         // color:['#cba', '#06b8f2', '#ed3f70', '#b9bcbc', '#c837ff', '#44f2ea'],

//         padding: 8, // 可选参， 设每个 circle 的间距
//         border: { // 可选参
//             show: true,
//             width: 5,

//             // 该颜色映射至 circle 的 border
//             // 将mappingColor[0]映射至val最小值；将mappingColor[1]映射至val最大值
//             mappingColor: ['#114fa8', '#23ece1']

//             // 设 border 为单色; (其与mappingColor 二者选)
//             // color: '#006081'
//         },
//         linearGradient: { // 可选参，其优先级大于 bubble color
//             show: true,
//             topColor: '#083972',
//             bottomColor: '#106082'
//         },
//         label: {
//             name: {
//                 fontSize: 12,
//                 fontColor: '#aaa',
//                 fontWeight: 'normal',
//                 dy: '-5em'
//             },
//             val: {
//                 fontSize: 28,
//                 fontColor: '#d4e1e8',
//                 fontWeight: 'normal',
//                 dy: '0'
//             }
//         }
//     },
//     padding: { top: 2, left: 2, right: 2, bottom: 2 }
// }

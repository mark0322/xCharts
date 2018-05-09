import * as d3Selection from 'd3-selection'
const d3 = Object.assign({}, d3Selection)

import _chunk from '../../util/array/_chunk'
import sumArray from '../../util/array/sumArray'

/**
 * 使用基本<rect>而非d3.treemap()绘制treemap
 */
function treemap(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    blocks = options.blocks || {},
    padding = options.padding || {
      top: 4,
      left: 4,
      right: 4,
      bottom: 4
    },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    totalVal = sumArray(data, o => o.val)

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
    .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'gWrap')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)

  // 定义 blocks 相关的数据
  const
    color = blocks.color || 'steelblue',
    gap = blocks.gap || 1,
    columnsCount = blocks.columns || 3, // treemap 的列数

    // rowsCount = Math.ceil(data.length / blocks.columns), // treemap 的行数
    aChunkData = _chunk(data, columnsCount) // 生成绘制 treemap 的数据

  try { // drawBlocks

    // 得到treemap每行的高
    const aEveryRowsHeight = (() => {
      let aEveryRowsTotalVal = []; // 将每行所有的 block 的 val 相加
      for (let chunkEle of aChunkData) { // 将每行所有的 block 的 val 相加
        let rowsTotalVal = sumArray(chunkEle, o => o.val)
        aEveryRowsTotalVal.push(rowsTotalVal)
      }
      return aEveryRowsTotalVal.map(d => axisHeight * d / totalVal - gap)
    })()

    // 得到treemap每块block的宽
    const aEveryBlockWidth = (arr => {
      let aTempEveryBlockWidth = []
      for (let aOneRowItems of arr) { // 以行为单位，遍历 aChunkData
        let rowsTotalVal = sumArray(aOneRowItems, o => o.val) // 一行内的 sum(blocks.val)

        // 获得一行内，每个 block 的宽
        let aOneRowWidth = aOneRowItems.map(d => axisWidth * d.val / rowsTotalVal - gap)
        aTempEveryBlockWidth.push(aOneRowWidth)
      }
      return aTempEveryBlockWidth
    })(aChunkData)

    // g-wrap-blocks
    let gRows = g.append('g').attr('class', 'g-blocks')

    // 遍历每一行
    let yPos = 0 // position-x
    for (let i = 0; i < aEveryBlockWidth.length; i++) {
      if (i > 0) {
        yPos += aEveryRowsHeight[i - 1] + gap
      }

      // 遍历一行中的每一块
      let xPos = 0 // position-y
      for (let j = 0; j < aEveryBlockWidth[i].length; j++) {
        if (j > 0) {
          xPos += aEveryBlockWidth[i][j - 1] + gap
        }

        // draw every block
        gRows.append('g')
          .attr('class', 'block')
          .attr('transform', `translate(${xPos}, ${yPos})`)
          .append('rect')
          .attr('width', aEveryBlockWidth[i][j])
          .attr('height', aEveryRowsHeight[i])
      }
    }
  } catch (e) {
    console.warn('drawBlocks', e)
  }

  { // block style and label
    const gBlocks = g.select('g.g-blocks')
      .selectAll('g.block')
      .data(data)
      .attr('eventIndex', d => d.name)

    // block color
    gBlocks
      .select('rect')
      .attr('fill', d => Array.isArray(color) ? color[d['groups']] : color)

    // block label
    const label = blocks.label || {}
    let labelStyle = o => {
      o.attr('fill', () => label.color ? label.color : '#333')
        .attr('font-size', () => label.fontSize ? label.fontSize : '12')
        .attr('text-anchor', 'middle')
        .attr('x', function() {
          let rectWidth = d3.select(this.parentNode).select('rect').attr('width')
          return rectWidth / 2
        })
        .attr('y', function() {
          let rectHeight = d3.select(this.parentNode).select('rect').attr('height')
          return rectHeight / 2
        })
    }

    let names = gBlocks.append('text').text(d => d.name)
    labelStyle(names)

    let vals = gBlocks.append('text').text(d => d.val).attr('dy', '1em')
    labelStyle(vals)
  }
}

export default treemap

// *** 参数 模板 ***
// const options = {
//     /** data {Array}
//      * @param {String} name 必填参，用于显示 block 的 label
//      * @param {Number} val 必填参，用于表示 block 的数值，且将数值与 block 的面积映射至一起
//      * @param {String} desc 选填参，以 tooltip 形式表示每个 block 的描述
//      * @param {Number} groups 选填参，用于将 block 分组，并将不同的颜色映射至不同组
//      */
//     data: [
//         {name: 'SMTP', val: 1, groups: 0}, {name: 'SMTPS', val: 2, groups: 1},
//         {name: 'POP3', val: 3, groups: 2}, {name: 'POP3S', val: 4, groups: 0},
//         {name: 'IMAP', val: 5, groups: 1}, {name: 'IMAPS', val: 6, groups: 2}
//     ],
//     blocks: { // 可选参
//         columns: 3, // 可参选； 作用:设每列有几个 block（@default 3)

//         // @param {String | Array}; 若为Array则需分为options.data分groups，以指定groups颜色
//         color: '#00a7d8', // 可选参
//         // color: ['#88e4dd', '#c4e4db', '#99b7c8'],
//         gap: 2, // 可选参 @default 1

//         label: {
//             color: '#333', // 可选参 @default 'steelblue';
//             fontSize: 18
//         }
//     }
// }

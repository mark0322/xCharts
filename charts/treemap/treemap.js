import { chunk } from '../../util/array'

const defaults = {
  columnsCount: 3, // 设 treemap 的列数
  color: 'steelblue', // or: ['#88e4dd', '#c4e4db', '#99b7c8'] (与 data.groups 映射)
  gap: 4,
  padding: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20
  },

  labelColor: '#333',
  labelFontSize: 18,

  animation: true
}

/** 
 * 使用 <rect> 绘制非树级 treemap
*/
export default class Treemap {
  constructor(options) {
    // data - template
    // options.data: [ // groups 可与 color 映射， 设置每块的颜色
    //     {name: 'A', val: 1, groups: 0}, {name: 'B', val: 2, groups: 1},
    //     {name: 'C', val: 3, groups: 2}, {name: 'D', val: 4, groups: 0},
    //     {name: 'E', val: 5, groups: 1}, {name: 'F', val: 6, groups: 2}
    //     ],

    Object.assign(this, defaults, options)
    this._init()
  }

  _init() {
    const { container, padding, animation } = this
    this.svgWidth = container.clientWidth
    this.svgHeight = container.clientHeight

    this.axisWidth = this.svgWidth - padding.left - padding.right
    this.axisHeight = this.svgHeight - padding.top - padding.bottom

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)

    this.t = d3.transition().duration(animation ? 1000 : 0)
  }

  /**
   * 得到每行的高 & 每块的宽
   * @returns { aEveryRowsHeight, aEveryBlockWidth }
  */
  width_height_blocks(data = this.data) {
    const { gap, axisWidth, axisHeight, columnsCount } = this

    const totalVal = d3.sum(data, o => o.val)

    // 将 data 分组，称为 treemap 的 二维数组结构
    const aChunkData = chunk(data, columnsCount)

    // 得到每行的高
    const aEveryRowsHeight = (chunkData => {
      let aEveryRowsTotalVal = [] // 将每行所有的 block 的 val 相加
      for (let rowData of chunkData) { // 将每行所有的 block 的 val 相加
        const oneRowTotalVal = d3.sum(rowData, o => o.val)
        aEveryRowsTotalVal.push(oneRowTotalVal)
      }
      return aEveryRowsTotalVal.map(d => axisHeight * d / totalVal - gap)
    })(aChunkData)

    // 得到每块的宽
    const aEveryBlockWidth = (chunkData => {
      const result = []
      for (let rowData of chunkData) { // 以行为单位，遍历 aChunkData
        const oneRowTotalVal = d3.sum(rowData, o => o.val) // 一行内的 sum(blocks.val)

        // 获得一行内，每块的宽
        const aOneRowWidth = rowData.map(d => axisWidth * d.val / oneRowTotalVal - gap)
        result.push(aOneRowWidth)
      }
      return result
    })(aChunkData)

    return { aEveryRowsHeight, aEveryBlockWidth }
  }

  renderChart(data = this.data) {
    // 绘制出每块
    const { svg, padding, gap, color, labelColor, labelFontSize, t } = this
    const { aEveryBlockWidth, aEveryRowsHeight } = this.width_height_blocks(data)

    svg.select('g').remove()
    const g = svg.append('g').attr('class', 'gWrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

    // g-wrap-blocks
    const gRows = g.append('g').attr('class', 'g-blocks')

    // 绘制 <rect>
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
          .transition(t)
          .attr('opacity', 1)
      }
    }

    const gBlocks = g.select('g.g-blocks').selectAll('g.block').data(data)
    
    // fill color
    gBlocks
      .select('rect')
      .attr('fill', d => Array.isArray(color) ? color[d['groups']] : color)

    // label
    const g_label = gBlocks.append('g')
      .attr('fill', () => labelColor)
      .attr('font-size', () => labelFontSize)
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('transform', function() {
        const rectWidth = d3.select(this.parentNode).select('rect').attr('width')
        const rectHeight = d3.select(this.parentNode).select('rect').attr('height')
        return `translate(${rectWidth / 2}, ${rectHeight / 2})`
      })
    g_label
      .append('text')
      .text(d => d.name)
      .attr('class', 'label-name')
    g_label
      .append('text')
      .text(d => d.val)
      .attr('dy', '1em')
      .attr('class', 'label-value')
  }

  render(data = this.data) {
    this.renderChart(data)
  }

  update(data = this.data) {
    this.render(data)
  }
}
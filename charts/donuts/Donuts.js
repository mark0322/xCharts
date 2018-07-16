import * as d3 from 'd3'
import { sumArray } from '../../util/array'

const defaults = {
  padding: { top: 40, left: 40, right: 40, bottom: 40 },

  donutGap: 20, // 环与环的间距
  donutWidth: 30, // 环的宽度

  valueColor: '#333',
  valueFontSize: 22,
  valueDx: '0em',
  valueDy: '0em',

  nameColor: '#333',
  nameFontSize: 22,
  nameDx: '0em',
  nameDy: '0em'
}

export default class Donuts {
  /**
   * @param {Object} options
   * 配置项属性
   * {
   *   container: document.querySelector('#box'),  // 必须
   *   data, // 可选, 亦可在 render(data) 加入 data
   *   defaults // 可选， 即覆盖 defaults 的默认参数
   * }
   *
   * @example
   * data: [
   *    {name: '待通报', val: 487, color: 'red'},
   *    {name: '已通报', val: 386, color: '#122645'},
   *    {name: '处置中', val: 108, color: '#122645'},
   *    {name: '已整改', val: 815, color: '#1b5b6c'}
   * ]
   */
  constructor(options) {
    Object.assign(this, defaults, options)

    this._init()
  }

  _init() {
    const { container, padding } = this

    this.svgWidth = container.clientWidth
    this.svgHeight = container.clientWidth

    this.axisWidth = this.svgWidth - padding.left - padding.right
    this.axisHeight = this.svgHeight - padding.top - padding.bottom

    this.svg = d3.select(container).append('svg')
      .attr('width', this.svgWidth).attr('height', this.svgHeight)
  }

  renderDonuts(data = this.data) {
    const { svg, padding, donutWidth, axisHeight, axisWidth, donutGap } = this
    const { valueColor, valueFontSize, valueDx, valueDy } = this
    const { nameColor, nameFontSize, nameDx, nameDy } = this

    // 计算 donuts 的 内、外 半径
    let tempOuterRadius = (axisWidth - donutGap * (data.length - 1)) / (data.length * 2),
      outerRadius,
      innerRadius
    if (tempOuterRadius > axisHeight / 2) {
      outerRadius = axisHeight / 2
    } else {
      outerRadius = tempOuterRadius
    }
    innerRadius = outerRadius - donutWidth

    svg.select('g').remove()
    const g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left + outerRadius}, ${padding.top + outerRadius})`)

    const arcPath = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(outerRadius - innerRadius)

    // bg donus data
    const bgDonutsData = {
      startAngle: Math.PI * -0.75,
      endAngle: Math.PI * 0.75
    }

    // scale - actual donuts data 
    const actualScale = d3.scaleLinear()
      .domain([0, sumArray(data, d => d.val)])
      .range([-0.75, 0.75])

    // 每次循环 绘制一组 donut board
    for (let i = 0, l = data.length; i < l; i++) {
      const gBoard = g.append('g')
        .attr('class', 'gBoard')
        .attr('transform', `translate(${i * (donutGap + 2 * outerRadius)}, 0)`)

      // draw bgDonuts
      gBoard
        .append('path')
        .attr('class', 'bgDonuts')
        .datum(bgDonutsData)
        .attr('fill', data[i].color || 'steelblue')
        .attr('opacity', 0.3)
        .attr('d', d => arcPath(d))

      // define actual donuts data
      const actualDonutsData = {
        startAngle: Math.PI * -0.75,
        endAngle: Math.PI * actualScale(data[i].val)
      }

      // draw actualDonuts
      gBoard
        .append('path')
        .attr('class', 'actualDonuts')
        .attr('fill', data[i].color || 'steelblue')
        .datum(actualDonutsData)
        .attr('opacity', 0.8)
        .transition(d3.transition().duration(1000))
        .attrTween('d', d => {
          const i = d3.interpolate(d.startAngle, d.endAngle)
          return t => {
            d.endAngle = i(t)
            return arcPath(d)
          }
        })

      // text - val
      gBoard.append('text')
        .attr('class', 'donut-val')
        .attr('text-anchor', 'middle')
        .attr('fill', valueColor)
        .attr('font-size', valueFontSize)
        .attr('dx', valueDx)
        .attr('dy', valueDy)
        .text(data[i]['val'])
        .transition(d3.transition().duration(1000))
        .tween('text', function() {
          const text = d3.select(this).text()
          const i = d3.interpolateNumber(0, text)
          return t => {
            d3.select(this).text(i(t) | 0)
          }
        })

      // text - name
      gBoard.append('text')
        .attr('class', 'donut-name')
        .attr('y', () => innerRadius * Math.sqrt(2) / 2)
        .text(data[i]['name'])
        .attr('text-anchor', 'middle')
        .attr('dx', nameDx)
        .attr('dy', nameDy)
        .attr('fill', nameColor)
        .attr('font-size', nameFontSize)
    }
  }

  render(data = this.data) {
    this.renderDonuts(data)
  }

  update(data = this.data) {
    this.render(data)
  }
}


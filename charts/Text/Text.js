import * as d3 from 'd3'

export default class Text {
  constructor(options) {
    Object.assign(this, options)
    this.init()
  }

  init({ container, isDonut, animation, padding } = this) {
    padding = this.padding || 40
    if (typeof animation === 'undefined') {
      animation = true
    }

    this.svgHeight = container.clientHeight - padding * 2
    this.svgWidth = container.clientWidth - padding * 2

    // 当被 Donut 继承时，则不需再添加 svg 画布
    if (!isDonut) {
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .attr('transform', `translate(${padding}, ${padding})`)
    }

    this.t = d3.transition().duration(animation ? 1000 : 0)
  }

  renderVal(val = this.val) {
    const { svg, svgHeight, svgWidth, t } = this
    const { valColor, valDy, valSize, valUnit } = this
    if (!val) throw new Error('未初始 val 值！')

    svg.select('g.g-val').remove()
    const g = svg.append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`)
      .attr('class', 'g-val')

    g.append('text')
      .attr('fill', valColor || '#fff')
      .attr('font-size', valSize || 64)
      .attr('dy', valDy || '0.5em')
      .attr('text-anchor', 'middle')
      .transition(t)
      .text(val)
      .tween('d', function() {
        const val = d3.select(this).text()
        const i = d3.interpolateNumber(0, val)
        return t => {
          d3.select(this).text((i(t) | 0) + valUnit)
        }
      })
  }
}
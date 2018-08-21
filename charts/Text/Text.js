import * as d3 from 'd3'

const defaults = {
  valColor: '#999', 
  valDy: '0.5em',
  valSize: 28, 
  valUnit: ''
}

export default class Text {
  constructor(options) {
    Object.assign(this, defaults, options)
    this.init()
  }

  init({ container, hasSvg, animation, padding } = this) {
    padding = this.padding || 40
    if (typeof animation === 'undefined') {
      animation = true
    }

    this.svgHeight = container.clientHeight - padding * 2
    this.svgWidth = container.clientWidth - padding * 2
    // 当被其他类继承时，则不需在添加 SVG 画布
    if (!hasSvg) {
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .attr('transform', `translate(${padding}, ${padding})`)
    }

    this.t = d3.transition().duration(animation ? 1000 : 0)
  }

  renderVal(val = this.val) {
    if (!val) throw new Error('未初始 val 值！')
    const { svg, svgHeight, svgWidth, t } = this
    const { valColor, valDy, valSize, valUnit } = this

    svg.select('g.g-val').remove()
    const g = svg.append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`)
      .attr('class', 'g-val')

    g.append('text')
      .attr('fill', valColor)
      .attr('font-size', valSize)
      .attr('dy', valDy)
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

    return this
  }
}
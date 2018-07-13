# 简介
现阶段该库提供两项功能：
1、charts：以 D3 为底层库，封装了常用的绘图 class
2、util：借鉴 lodash， 以原生 JS 封装了常用的数据处理函数

## 目录结构
```bash
├── /chart_modules/      # 各 chart 所用的公共元素，计划抽离至此，以共用 (如 splitline/tooltip 等)
├── /charts/             # chart 绘图函数与demo.html 
├── /util/               # 处理处理函数包
```

## charts，使用方法：
以 bar 为例：
```bash
// 设置配置项， 以设置所绘制chart的细节，
// 可配置的信息与 BarChart.js 中 defaults 变量内容一致。
const options = {
  container: document.querySelector('#container'),
  strData: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  valData: [55, 77, 33, 22, 99, 10, 100, 60, 80, 10]
}

// new 绘图对象 drawBarChart
const drawBarChart = new BarChart(options)

drawBarChart
  .render()  // 渲染 chart
  .tooltip() // 为 chart 增加 tooltip
  .splitLine() // 为 chart 增加 splitLine
```



代码文件路径：
```bash
├── /charts/          
│ ├── /bar/       
│    ├── BarChart.js        # 
│    ├── bar - demo.html    # 为drawBar.js 的 demo 示范，可直接直接打开看效果
```

## util，使用方法：
每个函数为一个 [.js] 文件， 每个文件中均有注释， 以供参考
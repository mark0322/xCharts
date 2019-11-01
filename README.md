# 简介
现阶段该库提供两项功能：
1、charts：以D3为底层库，封装了部分非常规chart。     
2、util：封装了部分数据可视化上常用的数据处理函数。

test
![d](https://github.com/mark0322/xCharts/blob/master/imgs/donut-segment.gif)

![ddd](https://github.com/mark0322/xCharts/blob/master/imgs/donut.png)


## 目录结构
```bash
├── /charts/             # chart 绘图函数与demo.html 
├── /util/               # 处理处理函数包
```

## charts，使用方法：
绘图方式，以 bar 为例：
```bash
// 设置配置项， 以设置所绘制chart的细节，
// 注：可配置的信息与 BarChart.js 中 defaults 一致。
const options = {
  container: document.querySelector('#container'),
  strData: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  valData: [55, 77, 33, 22, 99, 10, 100, 60, 80, 10],
  splitLine: {
    show: true
  }
}

// 实例化绘图对象
const drawBarChart = new BarChart(options)

drawBarChart
  .render()  // 渲染 chart
  .tooltip() // 为 chart 增加 tooltip

// 更新 chart
drawBarChart.update({
  strData: ['1', '2', '3', '4', '5'],
  valData: [134, 177, 331, 212, 199]
})
```



代码文件路径：
```bash
├── /charts/          
│ ├── /bar/       
│    ├── BarChart.js        # 模块代码
│    ├── bar - demo.html    # 为drawBar.js 的 demo 示范，可直接打开看效果
```

## util，使用方法：
每个函数为一个 [.js] 文件， 每个文件中均有注释， 以供参考
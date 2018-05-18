##简介
该库现为 V1.0 版，后续会有较大幅度改动。

现阶段开库提供两项功能：
1、charts：借鉴 echarts， 以D3为基础，封装了常用的绘制 chart 函数
2、util：借鉴 lodash， 以原生JS 封装了常用的数据处理函数

## 目录结构
```bash
├── /chart_modules/      # 各 chart 所用的公共元素，计划抽离至此，以共用 (如 splitline/tooltip 等)
├── /charts/             # chart 绘图函数与demo.html 
├── /chartsLab/          # 一些新功能的测试
├── /util/               # 处理处理函数包
```

## charts，使用方法：
以 bar 为例：
配置 options 参数， 调用绘图函数即可绘制 chart。 
其 options 参数结构见 代码中的 注释 示例。

代码文件路径：
```bash
├── /charts/          
│ ├── /bar/       
│    ├── drawBar.js       # 为绘图函数，可直接引用
│    ├── bar-demo.html    # 为drawBar.js 的 demo 示范，可直接直接打开看效果
```

## util，使用方法：
每个函数为一个 [.js] 文件， 每个文件中均有注释， 以供参考。
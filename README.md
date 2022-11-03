# 小程序工程化 vant + weapp + webpack
```
git clone https://github.com/touxing/miniprogram-webpack.git

```

# 运行
npm i
npm run dev

# 技术栈 
微信小程序 + 云开发 + 云函数

# 云开发环境必须配置id
根目录 app.js 中  用env指定云开发环境id

# 微信小程序运行
直接选择 dist -> dev 

# dist 文件 
dev 打包开发文件


# 引用iconfont 彩色图标 Symbol类型

# iconfont 初始化
npx iconfont-init
根目录 iconfont.json
替换  symbol_url 值

# iconfont 更新
 npx iconfont-wechat    
 svgSize: 28


# 分享朋友 分享朋友圈 
每个模块下js添加  
onShareTimeline 分享朋友圈  Imgurl 分享图片 list随机一个    同理 title 也可随机
onShareAppMessage 分享用户  Imgurl 分享图片 list随机一个    同理 title 也可随机


# 底部导航 自定义动态
根目录 新建 custom-tab-bar  
app.json 进行 tabBar  "custom": true

# 地图模块
map地图 动态赋值标点信息及样式 marker
腾讯地图定位精确度高  https://lbs.qq.com/getPoint/

# 实时弹幕墙 
云开发
新建云数据库 集合  
本地 根目录 新建云函数文件 cloudfunctions
本地 根目录 新建该集合的云函数
页面实时调用云函数并动态赋值每条文字颜色




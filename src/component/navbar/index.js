const App = getApp();

Component({
    /**
   * 组件的属性列表
   */
    properties: {
        pageName: String,
    },
    data() {
        return {
            headerSerch: {},//头部搜索
            swiperBg: {},//轮播
            topHeight: 0,  //顶部导航栏的高度
            paddingHeight: 0, //状态栏的高度
            HeaderBar: 0  //导航栏（除状态栏）
        }
    },
    attached() {
        this.init();
    },
    methods: {
        init() {
            //获取设备信息
            wx.getSystemInfo({
                success: (res) => {
                    let HeaderBar = 0
                    // #ifdef MP
                    let rect = wx.getMenuButtonBoundingClientRect(); //顶部胶囊信息
                    let HeaderBars = rect.height + (rect.top - res.statusBarHeight) * 2;;//顶部导航栏的高度(除状态栏)
                    // #endif
                    let topHeights = HeaderBars + res.statusBarHeight; //顶部导航栏的高度
                    let paddingHeights = res.statusBarHeight;  //顶部状态栏的高度
                    console.log(" rect ------------- ", rect);
                    console.log(" HeaderBars ------------- ", HeaderBars);
                    console.log(" topHeights ------------- ", topHeights);
                    console.log(" paddingHeights ------------- ", paddingHeights);
                    this.setData({ HeaderBar: HeaderBars, topHeight: topHeights, paddingHeight: paddingHeights })
                }
            })
        },
    }
})
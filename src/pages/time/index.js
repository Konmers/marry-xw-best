import { shareEvent } from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    imgs: [],
    screenWidths: 0, // 屏幕宽度
    screenHeights: 0, // 屏幕高度
    shareList: null
  },
  onLoad: function (options) {
    const db = wx.cloud.database();
    db
      .collection("time")
      .get()
      .then((res) => {
        //打印获取到的数据
        this.setData({ imgs: res.data[0].imgList })
      });
    db
      .collection("share")
      .get()
      .then((res) => {
        // console.log("share  res  ---------------  ", res);
        //打印获取到的数据
        this.setData({ shareList: res.data[0].shareList })
      });
    this.inits();
  },
  onReady() {

  },
  inits() {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight })
      },
    });
  },
  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },
  //分享朋友圈
  onShareTimeline: function (option) {
    //先写一个数组,
    var shareimg = this.data.shareList;
    //在写随机数
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    let shareTitle = "诚挚邀请您参加我们的婚礼,见证我们美好时刻！";
    let obj = {
      title: shareTitle,
      imageUrl: randomImg,
      query: ''
    };
    return shareEvent(option, obj);
  },
  //分享用户
  onShareAppMessage: function (option) {
    //先写一个数组,
    var shareimg = this.data.shareList;
    //在写随机数
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    let shareTitle = "诚挚邀请您参加我们的婚礼,见证我们美好时刻！";
    let sharePath = "/pages/home/index";
    let obj = {
      title: shareTitle,
      path: sharePath,
      imageUrl: randomImg
    };
    return shareEvent(option, obj);
  },
})
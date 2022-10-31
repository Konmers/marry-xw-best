import { showTextToast } from '../../utils/showToast.js'
import { formatData } from '../../utils/util.js'
import { shareEvent } from '../../utils/util.js'
// import QQMapWX from "../../utils/map.js";
// var qqmapsdk;
// qqmapsdk = new QQMapWX({
//   key: "AEVBZ-RLQKJ-W7WFJ-FNOBV-JWMG6-T5F5U"
// });
Page({
  data: {
    tabList: [
      { title: '重庆', id: '0' },
      { title: '忠县', id: '1' },
      { title: '广元', id: '2' }
    ],
    showtabList: [],
    tabId: '0',
    mapData: [
      {
        id: '0',
        city: "重庆",
        name: "南仙庭饭店",
        longitude: 106.553153,
        latitude: 29.463832,
        time: 20221203//20221203
      },
      {
        id: '1',
        city: "重庆 忠县 新立",
        name: "金土地酒楼",
        longitude: 107.649154,
        latitude: 30.276569,
        time: 20221203//20221210
      },
      {
        id: '2',
        city: "四川 广元 旺苍",
        name: "米仓山大酒店",
        longitude: 106.28574,
        latitude: 32.22847,
        time: 20221204//20230118
      }
    ],
    showData: [],
    markers: null,
    nowDate: null,
    ManphoneNumber: '17623261139',
    WomanphoneNumber: '18781224699',
    screenWidths: 0, // 屏幕宽度
    screenHeights: 0, // 屏幕高度
    shareList: null
  },
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var date = formatData(new Date());
    this.setData({
      nowDate: date > 20221203 ? date : 20221203
    });
    let locationInfoData = this.data.mapData
    let tabInfoData = this.data.tabList
    let locationInfo = []
    let tabInfo = []
    for (let index = 0; index < locationInfoData.length; index++) {
      if (locationInfoData[index].time > this.data.nowDate) {
        break;
      }
      else {
        locationInfo.push(locationInfoData[index])
        tabInfo.push(tabInfoData[index])
      }
    }
    this.setData({
      tabId: tabInfo[0].id,
      showData: locationInfo,
      showtabList: tabInfo
    });
    this.inits();
  },
  onReady() {
    let locationInfo = this.data.showData[0];
    let mrk = [{ // 获取返回结果，放到mks数组中
      title: locationInfo.city + locationInfo.name,
      id: 0,
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
      iconPath: '../../static/images/maps.svg',//图标路径  maps.png
      width: 38,
      height: 45,
      callout: { //在markers上展示地址名称，根据需求是否需要
        content: locationInfo.city + ' ' + locationInfo.name,
        color: '#fff',
        bgColor: '#ff6347',
        display: 'ALWAYS',
        padding: 10,
        borderRadius: 10,
        borderColor: '#ff6347',
        fontSize: 18,
        textAlign: 'center',
      }
    }];
    this.setData({
      markers: mrk
    })
    const db = wx.cloud.database();
    db
      .collection("share")
      .get()
      .then((res) => {
        // console.log("share  res  ---------------  ", res);
        //打印获取到的数据
        this.setData({ shareList: res.data[0].shareList })
      });
  },
  async onTab(e) {
    //得到子组件传来的参数
    const tabId = e.detail;
    let locationInfo = [];
    for (const item of this.data.showData) {
      if (item.id == tabId) {
        locationInfo.push(item)
      }
    }
    if (locationInfo.length > 0) {
      let mrk = [{ // 获取返回结果，放到mks数组中
        title: locationInfo[0].city + locationInfo[0].name,
        id: 0,
        latitude: locationInfo[0].latitude,
        longitude: locationInfo[0].longitude,
        iconPath: '../../static/images/maps.svg',//图标路径  maps.png
        width: 38,
        height: 45,
        callout: { //在markers上展示地址名称，根据需求是否需要
          content: locationInfo[0].city + ' ' + locationInfo[0].name,
          color: '#fff',
          bgColor: '#ff6347',
          display: 'ALWAYS',
          padding: 10,
          borderRadius: 10,
          borderColor: '#ff6347',
          fontSize: 18,
          textAlign: 'center',
        }
      }];
      this.setData({
        tabId: locationInfo[0].id,
        markers: mrk
      });
    }
  },
  searchAddress() {
    const locationInfo = this.data.mapData[this.data.tabId]
    const latitude = locationInfo.latitude;
    const longitude = locationInfo.longitude;
    wx.openLocation({
      latitude,
      longitude,
      scale: 28,
      name: locationInfo.name,
      address: locationInfo.city
    });
  },
  inits() {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight })
      },
    });
  },
  //电话
  phoneClick(event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phonenumber,
      success(res) {
        console.log("phoneClick     success res --------------  ", res);
      },
      fail(res) {
        console.log("phoneClick     fail res --------------  ", res);
      }
    })
  },
  //分享朋友圈
  onShareTimeline: function (option) {
    //先写一个数组,
    var shareimg = this.data.shareList;
    //在写随机数
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    let shareTitle = "诚挚邀请您参加我们的婚礼，见证我们的爱情之路，共享美好时刻！";
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
    let shareTitle = "诚挚邀请您参加我们的婚礼，见证我们的爱情之路，共享美好时刻！";
    let sharePath = "/pages/home/index";
    let obj = {
      title: shareTitle,
      path: sharePath,
      imageUrl: randomImg
    };
    return shareEvent(option, obj);
  },
})
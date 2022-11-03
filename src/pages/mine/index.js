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
      { title: '北京1', id: '0' },
      { title: '北京2', id: '1' },
      { title: '北京2', id: '2' }
    ],
    showtabList: [],
    tabId: '0',
    mapData: [
      {
        id: '0',
        city: "北京 北京市 海淀区 1",
        name: "X朝阳区百子湾北京勤和别克",
        longitude: 116.475812,
        latitude: 39.899698,
        time: 20221206
      },
      {
        id: '1',
        city: "北京 北京市 海淀区 2",
        name: "朝阳区兆泰国际中心",
        longitude: 116.436625,
        latitude: 39.920091,
        time: 20221208
      },
      {
        id: '2',
        city: "北京 北京市 海淀区 3",
        name: "燕莎奥特莱斯购物中心",
        longitude: 116.487848,
        latitude: 39.87724,
        time: 20230102
      },
    ],
    showData: [],
    markers: null,
    nowDate: null,
    ManphoneNumber: '161111111111',
    WomanphoneNumber: '162222222222',
    screenWidths: 0, // 屏幕宽度
    screenHeights: 0, // 屏幕高度
    shareList: null
  },
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var date = formatData(new Date());
    // this.setData({
    //   nowDate: date > 20221206 ? date : 20221203
    // });
    let locationInfoData = this.data.mapData
    let tabInfoData = this.data.tabList
    let locationInfo = []
    let tabInfo = []
    for (let index = 0; index < locationInfoData.length; index++) {
      if (locationInfoData[index].time > this.data.date) {
        break;
      }
      else {
        locationInfo.push(locationInfoData[index])
        tabInfo.push(tabInfoData[index])
      }
    }
    console.log("tabInfo ----------  ", tabInfo);
    this.setData({
      tabId: tabInfo[0].id,
      showData: locationInfo,
      showtabList: tabInfo,
      nowDate: date
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
      iconPath: '../../static/images/maps.png',//图标路径  maps.png
      width: 38,
      height: 45,
      callout: { //在markers上展示地址名称，根据需求是否需要
        content: locationInfo.city + '\n' + locationInfo.name,
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
    //云开发 获取云数据库数据
    // const db = wx.cloud.database();
    // db
    //     .collection("share")
    //     .get()
    //     .then((res) => {
    //         //打印获取到的数据
    //         this.setData({ shareList: res.data[0].shareList })
    //     });

    let shareList = [
      "https://gd-hbimg.huaban.com/b69fce3de1199a9362989d49ef722a6069ed112bdfe64-BA6IAm_fw658",
      "https://gd-hbimg.huaban.com/23018748be96c87e7ba1c9a88c1454c211e680e6be57b-DW0Fir_fw658",
      "https://gd-hbimg.huaban.com/6a8b5cf52dab7c7c3538f49acc3a457fcfffcfa5392f5-eu5bX1_fw658"
    ]
    this.setData({ shareList: shareList })
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
        iconPath: '../../static/images/maps.png',//图标路径  maps.png
        width: 38,
        height: 45,
        callout: { //在markers上展示地址名称，根据需求是否需要
          content: locationInfo[0].city + '\n' + locationInfo[0].name,
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
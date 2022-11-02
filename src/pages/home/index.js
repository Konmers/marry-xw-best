import { showTextToast } from '../../utils/showToast.js'
import { formatData, shareEvent } from '../../utils/util.js'
let audioCtx = wx.createInnerAudioContext();
const appInstance = getApp();
const { isPlayGlobal, musicIdGlobal } = appInstance.globalData;
Page({
    data: {
        screenWidths: 0, // 屏幕宽度
        screenHeights: 0, // 屏幕高度
        bannerList: [],
        isPlay: true, //false 关闭  true 开启  音乐
        audioUrl: '/static/atudio/PerfectDuet.mp3',//本地路径
        srcMic: 'https://6d61-marry-server-9g5blwd6fcc45045-1313739527.tcb.qcloud.la/music/HoldMeWhileYouWait.mp3',//网路路径
        locationData: [
            {
                strDate: "谨定于 2022年12月03日（星期六）中午11:48",
                txt1: '农历 冬月 初十 中午十一点四十八 举办婚礼',
                txt2: '2楼 海洋厅',
                txt3: '重庆 巴南区 李家沱 巴南大道中恒大城南仙庭饭店',
                time: 20221203//20221203
            },
            {
                strDate: "谨定于 2022年12月18日（星期日）中午12:00",
                txt1: '农历 冬月 二十五 中午十二点整 答谢宴',
                txt2: '1楼',
                txt3: '重庆 忠县 新立镇 金土地酒楼',
                time: 20221218//20221218
            },
        ],
        locationDatas: [
            {
                strDate: "谨定于 2023年01月17日（星期二）中午12:00",
                txt1: '农历 腊月 二十六 中午十二点整  答谢宴',
                txt2: '2楼',
                txt3: '广元 旺苍 米仓山大酒店',
                time: 20230118//20230118
            },
        ],
        showData: [],
        nowDate: null,
        shareList: null,
        kaipingFlag: true
    },
    onLoad() {
        var date = formatData(new Date());
        if (date <= 20221218) {
            this.setData({
                showData: this.data.locationData,
            });
        }
        else {
            this.setData({
                showData: this.data.locationDatas,
            });
        }
        this.inits();
        this.getDatas();

        const that = this
        that.isPlay = true
        audioCtx.title = "PerfectDuet"
        audioCtx.src = that.data.audioUrl//本地路径音频
        // audioCtx.src = that.data.srcMic//网路路径音频
        audioCtx.loop = true
        audioCtx.play();
    },
    onShow() {
        // const that = this
        // that.isPlay = true
        // audioCtx.title = "PerfectDuet"
        // audioCtx.src = that.data.audioUrl//本地路径音频
        // // audioCtx.src = that.data.srcMic//网路路径音频
        // audioCtx.loop = true
    },
    onReady() {
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
    inits() {
        const that = this
        wx.getSystemInfo({
            success: function (res) {
                // console.log("getSystemInfo ------------  ", res); //获取设备所有信息
                // SDKVersion: "2.4.1";
                // batteryLevel: 96;
                // brand: "devtools";
                // deviceOrientation: "portrait";
                // errMsg: "getSystemInfo:ok";
                // fontSizeSetting: 16;
                // language: "zh_CN";
                // model: "iPhone 6/7/8";
                // pixelRatio: 2;
                // platform: "devtools";
                // screenHeight: 667;
                // screenWidth: 375;
                // statusBarHeight: 20;
                // system: "iOS 10.0.1";
                // version: "7.0.4";
                // windowHeight: 555;
                // windowWidth: 375;
                // console.log(res.windowWidth); //屏幕宽度
                // console.log("res --------------  ", res);
                // that.setData({ screenWidths: res.screenWidth, screenHeights: res.screenHeight })
                that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight - 100 })
                // console.log("this.screenWidth --------------  ", this.screenWidth);
                // console.log("this.screenHeight --------------  ", this.screenHeight);
            },
        });
    },
    getDatas() {
        // wx.showLoading(
        //     {
        //         title: "加载中",
        //     },
        //     500
        // );
        const db = wx.cloud.database();
        db
            .collection("banner")
            .get()
            .then((res) => {
                //打印获取到的数据
                this.setData({ bannerList: res.data[0].bannerList })
            });
    },
    audioControl() {
        const that = this
        if (that.isPlay) {
            // console.log("this.data.isPlay 1----------   ", this.data.isPlay);
            // console.log("that.isPlay 1----------   ", that.isPlay);
            audioCtx.pause()
            that.isPlay = false
            this.data.isPlay = false
            this.setData({ isPlay: false })
            showTextToast("您已暂停音乐播放~");
        }
        else {
            // console.log("this.data.isPlay 2----------   ", this.data.isPlay);
            // console.log("that.isPlay 2----------   ", that.isPlay);
            audioCtx.play()
            that.isPlay = true
            this.data.isPlay = true
            this.setData({ isPlay: true })
            showTextToast("背景音乐已开启~");
        }
    },
    getMusicUrl() {
        const db = wx.cloud.database();
        db.collection("music")
            .get()
            .then((res) => {
                // console.log("getMusicUrl   ---------  ", res);
                // that.audioUrl = res.data[0].musicUrl;
                this.setData({ audioUrl: res.data[0].musicUrl })
                this.audioCtx.play();
            });
    },
    //分享朋友圈
    onShareTimeline(option) {
        //先写一个数组,
        var shareimg = this.data.shareList;
        //在写随机数
        var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
        let shareTitle = "诚挚邀请您参加我们的婚礼，见证我们的幸福时刻！";
        let obj = {
            title: shareTitle,
            imageUrl: randomImg,
            query: ''
        };
        return shareEvent(option, obj);
    },
    //分享用户
    onShareAppMessage(option) {
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
    /**
  * 生命周期函数--监听页面卸载
  */
    onUnload: function () {
        //离开页面是停止播放音乐
        wx.getBackgroundAudioManager().stop();
    },
});
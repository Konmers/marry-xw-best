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
                strDate: "谨定于 2022 年12 月03 日（星期六）中午11:48",
                txt1: '农历 冬月 初十 中午十一点四十八 举办婚礼',
                txt2: '1楼 大厅',
                txt3: '北京 北京市 海淀区 XX大饭店',
                time: 20221206
            },
            {
                strDate: "谨定于 2022 年12 月03 日（星期六）中午11:48",
                txt1: '农历 冬月 初十 中午十一点四十八 举办婚礼',
                txt2: '1楼 大厅',
                txt3: '北京 北京市 海淀区 XX大饭店',
                time: 20221208
            },
            {
                strDate: "谨定于 2022 年12 月03 日（星期六）中午11:48",
                txt1: '农历 冬月 初十 中午十一点四十八 举办婚礼',
                txt2: '1楼 大厅',
                txt3: '北京 北京市 海淀区 XX大饭店',
                time: 20230102
            },
        ],
        showData: [],
        nowDate: null,
        shareList: null,
        kaipingFlag: true
    },
    onLoad() {
        var date = formatData(new Date());
        var locationDatas = this.data.locationData
        for (const item of locationDatas) {
            if (item.time > date) {
                var middData = []
                middData.push(item)
                this.setData({ showData: middData });
                break;
            }
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
    onReady() {
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
    inits() {
        const that = this
        wx.getSystemInfo({
            success: function (res) {
                // console.log("getSystemInfo ------------  ", res); //获取设备所有信息
                that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight - 100 })
            },
        });
    },
    //获取图片
    getDatas() {

        //云开发 获取云数据库数据
        // const db = wx.cloud.database();
        // db
        //     .collection("banner")
        //     .get()
        //     .then((res) => {
        //         //打印获取到的数据
        //         this.setData({ bannerList: res.data[0].bannerList })
        //     });

        let bannerList = ['http://n.sinaimg.cn/spider20210621/79/w600h3479/20210621/e014-krpikqh3113721.jpg']
        this.setData({ bannerList: bannerList })
    },
    audioControl() {
        const that = this
        if (that.isPlay) {
            audioCtx.pause()
            that.isPlay = false
            this.data.isPlay = false
            this.setData({ isPlay: false })
            showTextToast("您已暂停音乐播放~");
        }
        else {
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
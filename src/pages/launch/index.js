import { shareEvent } from '../../utils/util.js'
Page({
    data: {
        second: 10,
        showImg: 'https://6d61-marry-server-9g5blwd6fcc45045-1313739527.tcb.qcloud.la/image/share/sharezx.png?sign=3c3d04b4b1203ded52b2302b27bb8129&t=1667361017',
        timer: null,
        shareList: null,
    },
    onReady() {
        let secondTime = this.data.second;
        let that = this;
        const timer = setInterval(function () {
            let nowSecond = --that.data.second;
            if (nowSecond <= 0) {
                clearInterval(timer);
                that.hideKaiping();
            }
            that.setData({
                second: nowSecond
            });
        }, 1000);
        this.setData({
            timer: timer
        });
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
    hideKaiping() {
        this.triggerEvent("hide");
        // let url = null;
        // if (this.data.second == 0) {
        //     url = '/pages/home/index';
        // }
        // wx.switchTab({ url });
        // wx.showTabBar();
    },
    skipAnimation() {
        let timer = this.data.timer;
        if (timer) {
            clearInterval(timer);
        }
        let url = '/pages/home/index';
        wx.switchTab({ url });
    },
    //分享朋友圈
    onShareTimeline(option) {
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
    onShareAppMessage(option) {
        //先写一个数组,
        var shareimg = this.data.shareList;
        //在写随机数
        var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
        let shareTitle = "诚挚邀请您参加我们的婚礼,见证我们美好时刻！";
        let sharePath = "/pages/launch/index";
        let obj = {
            title: shareTitle,
            path: sharePath,
            imageUrl: randomImg
        };
        return shareEvent(option, obj);
    },
})

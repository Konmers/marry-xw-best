
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        screenWidths: 0, // 屏幕宽度
        screenHeights: 0, // 屏幕高度
        msgInputBottom: 0,
        inputVal: "",
        showInput: false,
        barrageLineCount: 10,
        // 拉取最新弹幕的毫秒值
        barragePullMillis: 0,
        // 最新的弹幕
        barrageNewMsgs: [],
        // 已显示的弹幕，无新弹幕时则循环
        barrageSendedMsgs: [],
        // 弹幕显示数据
        barrageMsgs: []
    },

    foucusInput: function (e) {
        console.log("foucusInput  e.detail.height ----------- ", e.detail.height);
        console.log("foucusInput  this.data.screenHeights ----------- ", this.data.screenHeights);
        console.log("foucusInput  this.data.screenHeights / 10----------- ", this.data.screenHeights / 10);
        this.setData({ msgInputBottom: this.data.screenHeights / 10 * 2 })
    },

    blurInput: function (e) {
        this.setData({ inputVal: e.detail.value, msgInputBottom: 0, showInput: false })
    },

    clickSendMsg: function (e) {
        this.setData({ showInput: true, msgInputBottom: this.data.screenHeights / 10 * 2 })
    },

    getInput: function (e) {
        this.setData({
            inputVal: e.detail.value
        })
    },

    sendMsg: function (e) {
        const msg = this.data.inputVal;
        if (msg == "") return;

        const userInfo = app.getUserInfo();
        wx.request({
            url: app.globalData.baseUrl + '/barrageMsg/',
            data: { memberId: userInfo.id, msg: msg },
            method: 'PUT'
        })
        this.setData({ inputVal: "" });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.inits();
        // 初始化barrageLineCount个弹幕行
        let barrageMsgs = this.data.barrageMsgs;
        const barrageLineCount = this.data.barrageLineCount;
        const nowTimeMillis = new Date().getTime();
        for (var i = 0; i < barrageLineCount; i++)
            barrageMsgs.push({
                'showTimeMillis': new String(nowTimeMillis -
                    Math.round(Math.random() * barrageLineCount) * 1000), msgInfos: []
            });
        this.setData({ barrageMsgs: barrageMsgs });



        // 每隔2s拉取最新的弹幕
        setInterval((that) => {
            wx.request({
                url: app.globalData.baseUrl + '/barrageMsg/',
                data: { timeMillis: that.data.barragePullMillis },
                method: 'GET',
                success: res => {
                    const data = res.data.data;
                    if (data == null) return;
                    that.setData({
                        barrageNewMsgs: data.barrageMsgList,
                        barragePullMillis: data.lastPullMillis
                    });
                }
            });
        }, 2000, this);

        // 动态显示弹幕
        setInterval((that) => {
            var arrSort = [];
            const barrageLineCount = this.data.barrageLineCount;
            for (var i = 0; i < barrageLineCount; i++) arrSort.push(i);
            arrSort.sort(() => (0.5 - Math.random()));

            var nowTimeMillis = new Date().getTime();
            var barrageNewMsgs = that.data.barrageNewMsgs;
            if (barrageNewMsgs != null && barrageNewMsgs.length > 0) {
                // 有最新弹幕
                var barrageMsgs = that.data.barrageMsgs;
                for (var j = 0; j < arrSort.length; j++) {
                    var barrageMsg = barrageMsgs[arrSort[j]];
                    // 获取最后发起的弹幕超过5s则跟在后面
                    if (nowTimeMillis - barrageMsg.showTimeMillis > 5000) {
                        // 显示
                        barrageMsg.showTimeMillis = nowTimeMillis;
                        const barrageNewMsg = barrageNewMsgs[0];
                        barrageNewMsg.showTimeMillis = nowTimeMillis;
                        barrageMsg.msgInfos.push(barrageNewMsg);
                        barrageMsgs[arrSort[j]] = barrageMsg;
                        // 在最新弹幕中删除此条弹幕
                        barrageNewMsgs.splice(0, 1);
                        that.setData({
                            barrageNewMsgs: barrageNewMsgs,
                            barrageMsgs: barrageMsgs
                        });
                        break;
                    }
                }
            }
            // 回收每个超过10s的弹幕放到barrageSendedMsgs中
            var barrageMsgs = that.data.barrageMsgs;
            for (var i = 0; i < barrageMsgs.length; i++) {
                var barrageMsg = barrageMsgs[i];
                var msgInfos = barrageMsg.msgInfos;
                if (msgInfos == null || msgInfos.length == 0 ||
                    nowTimeMillis - msgInfos[0].showTimeMillis <= 10000) continue;
                var barrageSendedMsgs = that.data.barrageSendedMsgs;
                for (var j = 0; j < msgInfos.length; j++) {
                    var msgInfo = msgInfos[j];
                    if (nowTimeMillis - msgInfo.showTimeMillis <= 10000) break;
                    msgInfos.splice(j, 1); j--;
                    barrageSendedMsgs.push(msgInfo);
                }
                barrageMsg.msgInfos = msgInfos;
                barrageMsgs[i] = barrageMsg;
                that.setData({
                    barrageMsgs: barrageMsgs,
                    barrageSendedMsgs: barrageSendedMsgs
                });
            }
            // 新的弹幕未发完，老弹幕不循环
            if (barrageNewMsgs != null && barrageNewMsgs.length > 0) return;

            // 从barrageSendedMsgs取开头1条进行播放后删除，由上文代码再次放入实现循环
            var barrageSendedMsgs = that.data.barrageSendedMsgs;
            if (barrageSendedMsgs.length == 0) return;
            var barrageSendedMsg = barrageSendedMsgs[0];
            for (var j = 0; j < arrSort.length; j++) {
                var barrageMsg = barrageMsgs[arrSort[j]];
                // 获取最后发起的弹幕超过5s则跟在后面
                if (nowTimeMillis - barrageMsg.showTimeMillis > 5000) {
                    // 显示
                    barrageMsg.showTimeMillis = nowTimeMillis;
                    barrageSendedMsg.showTimeMillis = nowTimeMillis;
                    barrageMsg.msgInfos.push(barrageSendedMsg);
                    barrageMsgs[arrSort[j]] = barrageMsg;
                    // 在已发弹幕中删除此条弹幕
                    barrageSendedMsgs.splice(0, 1);
                    that.setData({
                        barrageSendedMsgs: barrageSendedMsgs,
                        barrageMsgs: barrageMsgs
                    });
                    break;
                }
            }
        }, 500, this);
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})

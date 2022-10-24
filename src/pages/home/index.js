/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-14 15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-24 18
 */
//Page Object

import {
    showTextToast
} from '../../utils/showToast.js'

let audioCtx = wx.createInnerAudioContext();
const appInstance = getApp();
const { isPlayGlobal, musicIdGlobal } = appInstance.globalData;
Page({
    data: {
        screenWidths: 0, // 屏幕宽度
        screenHeights: 0, // 屏幕高度
        bannerList: [],
        isPlay: true, //false 关闭  true 开启  音乐
        audioUrl: '/static/atudio/HoldMeWhileYouWait.mp3',//本地路径
        srcMic: 'https://6d61-marry-server-9g5blwd6fcc45045-1313739527.tcb.qcloud.la/music/HoldMeWhileYouWait.mp3'//网路路径
    },
    onLoad: function () {
        console.log("Home onLoad ------------ ");
        this.inits();
        this.getDatas();
    },
    onShow() {
        const that = this
        that.isPlay = true
        audioCtx.src = that.data.audioUrl//本地路径音频
        // audioCtx.src = that.data.srcMic//网路路径音频
        audioCtx.loop = true
        audioCtx.play()
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
                that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight })
                // console.log("this.screenWidth --------------  ", this.screenWidth);
                // console.log("this.screenHeight --------------  ", this.screenHeight);
            },
        });
    },
    getDatas() {
        // wx.showLoading(
        //   {
        //     title: "加载中",
        //   },
        //   500
        // );
        const db = wx.cloud.database();
        db
            .collection("banner")
            .get()
            .then((res) => {
                //打印获取到的数据
                // console.log("res --------------  ", res);
                // console.log("res.data --------------  ", res.data);
                // that.bannerList = res.data[0].bannerList;
                this.setData({ bannerList: res.data[0].bannerList })
                // console.log("that.bannerList --------------  ", this.bannerList);
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
                console.log("getMusicUrl   ---------  ", res);
                // that.audioUrl = res.data[0].musicUrl;
                this.setData({ audioUrl: res.data[0].musicUrl })
                this.audioCtx.play();
            });
    },
});
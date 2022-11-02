/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-21 09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-02 11
 */
const env = require(`./env/env.${process.env.BUILD_TYPE}.js`)
// import { camelCase } from 'lodash'

App({
  onLaunch() {
    // console.log('env', env)
    // console.log(camelCase('OnLaunch'))
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.cloud.init({
      env: 'marry-server-9g5blwd6fcc45045',  // 用env指定云开发环境id
      traceUser: true  // 表示将用户访问接入到用户管理中
    })

    // 获取胶囊信息
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })

    //更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('vesion check----', res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

  },
  globalData: {
    userInfo: null,
    isPlayGlobal: false,
    musicIdGlobal: ''
  }
})

/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-21 09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-21 17
 */
const env = require(`./env/env.${process.env.BUILD_TYPE}.js`)
// import { camelCase } from 'lodash'

App({
  onLaunch() {
    console.log('env', env)
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
  },
  globalData: {
    userInfo: null,
    isPlayGlobal: false,
    musicIdGlobal: ''
  }
})

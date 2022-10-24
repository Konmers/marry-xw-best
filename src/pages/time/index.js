/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-21 17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-23 15
 */
// pages/time/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522069454.jpg",
      "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522778567.jpg",
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523516430.jpg",
    ],

    img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  },

  //绑定的方法
  img(res) {
    console.log(res);
    let src = res.currentTarget.dataset.src
    let list = res.currentTarget.dataset.list

    wx.previewImage({
      urls: list,
      current: src
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
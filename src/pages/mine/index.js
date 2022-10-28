/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-21 17
 * @LastEditors: 
 * @LastEditTime: 2022-10-28 16
 */
Page({
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
});
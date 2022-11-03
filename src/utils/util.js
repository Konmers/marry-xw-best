/*
 * @Description: 公共方法
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-21 17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-03 16
 */
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
}

const formatData = date => {
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return Number(year + month + day)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//分享功能
function shareEvent(option, obj) {
  let shareObj = {
    title: obj.title,
    path: obj.path + '?obj.scan=' + obj.scan,
    imageUrl: obj.imageUrl,
    success(res) { // 转发成功之后的回调
      if (res.errMsg == 'shareAppMessage:ok') { }
    },
    fail(res) { // 转发失败之后的回调
      if (res.errMsg == 'shareAppMessage:fail cancel') {//用户取消转发
      } else if (res.errMsg == 'shareAppMessage:fail') {// 转发失败，其中 detail message 为详细失败信息
      }
    },
    complete() {// 转发结束之后的回调（转发成不成功都会执行）
    }
  };
  return shareObj;
}

module.exports = {
  formatTime,
  formatData,
  shareEvent
}

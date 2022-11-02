// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
  // env: 'marry-server-9g5blwd6fcc45045'
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log("event add ------------ ", event); // 小程序 传参
  // console.log("context ------------ ", context);
  const wxContext = cloud.getWXContext();
  const {
    nickName,
    avatarUrl,
    msg
  } = event;

  return db.collection("benediction").add({
    data: {
      name: nickName,
      avatar: avatarUrl,
      msg: msg,
      time: new Date(),
    }
  })

}
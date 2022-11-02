// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //API 调用都保持和云函数当前所在环境一致
  // env: cloud.DYNAMIC_CURRENT_ENV
  env: 'marry-server-9g5blwd6fcc45045'
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log("event ------------ ", event); // 小程序 传参
  // console.log("context ------------ ", context);

  //获取参数 
  // var num = event.num;
  // var page = event.page;
  // const { OPENID } = cloud.getWXContext()
  // return await db.collection("benediction").where({
  //   _openid: OPENID
  // }).orderBy('time', 'desc').skip(page).limit(num).get({
  //   success: function (res) {
  //     console.log(res.data)
  //   }
  // })
  var num = event.num;
  var page = event.page;
  return await db.collection("benediction").orderBy('time', 'desc').skip(page).limit(num).get()
}
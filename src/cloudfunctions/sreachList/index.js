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
  console.log(event);
  console.log(context);
  var dbName = event.dbName;//集合名称
  var filter = event.filter ? event.filter : null;//筛选条件 默认为空 格式 {_id:'jjjj-ddsdf'}
  var pageIndex = event.pageIndex ? event.pageIndex : 1;//当前第几页 默认第一页
  var pageSize = event.pageSize ? event.pageSize : 10;//每页取多少条记录 默认10条
  const countResult = await db.collection(dbName).where(filter).count() //获取集合中 总记录数
  const total = countResult.total //总记录数
  const totalPage = Math.ceil(total / 10)//计算需要多少页
  var hasMore;//提示前端是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage) {//如果没有数据 返回false
    hasMore = false;
  } else {
    hasMore = true;
  }

  //查询数据并返回前端
  return db.collection(dbName).where(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    console.log(res.data)
    // return res;
  })
}
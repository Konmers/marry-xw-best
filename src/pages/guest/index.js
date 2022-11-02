import { showTextToast } from '../../utils/showToast.js'
import { shareEvent } from '../../utils/util.js'
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        bgImg: 'https://6d61-marry-server-9g5blwd6fcc45045-1313739527.tcb.qcloud.la/image/time/aImg.png?sign=aea7b837e4ddea7855e821fa4d2c8576&t=1667369461',
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
        num: 20,
        page: 0,
        contR: 0,//人数
        // 已显示的弹幕，无新弹幕时则循环
        barrageSendedMsgs: [],
        // 弹幕显示数据
        barrageMsgs: [],
        userInfo: {},
        hasUserInfo: false,
        colorArr: ["#00ffff", "#00ffcc", "#FF3030", "#EE4000", "#FF1493", "#D2691E", "#FF4500", "#FFE4C4", "#FFD700", "#00FF7F", "#1E90FF", "#00CED1", "#00FFFF", "#FF3333", "#FFFF99"],

        // 存储随机颜色
        randomColorArr: [],
        labLen: '',
        shareList: null
    },

    async onLoad() {
        await this.getBarrageList();
        await this.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onReady() {
        this.inits();
        // 初始化barrageLineCount个弹幕行
        this.barrageInit();

        // 每隔2s拉取最新的弹幕  1s = 1000
        await setInterval(async (that) => {
            await this.getBarrageList();
            await this.getData();
        }, 5000, this);

        // 动态显示弹幕
        setInterval((that) => {
            this.asyShowbarrage();
        }, 500, this);
        const db = wx.cloud.database();
        db
            .collection("share")
            .get()
            .then((res) => {
                //打印获取到的数据
                this.setData({ shareList: res.data[0].shareList })
            });
    },
    /**
     * 从数据库获取数据
     */
    async getData() {
        await wx.cloud.callFunction({
            name: "benedictionList",  //云函数名
            data: {
                num: 500,    //用来记录每次获取数据的数量
                page: 0,  //每次从page条数据之后获取数据
            }
        }).then(res => {
            if (res.result.data.length > 0) {
                let arr = res.result.data
                let arrAll = arr.filter(function (item, index) {
                    let myArr = []  // 对象的某个属性放入临时数组，对比临时数组中元素所在对象的索引，
                    // 多个对象可push多个，均不相同return ..&&..   有一不同 return ..||..
                    arr.forEach(items => {
                        myArr.push(items.name)
                    })
                    return myArr.indexOf(item.name) === index
                })
                this.setData({ contR: arrAll.length })
            }
        })

        // wx.cloud.callFunction({
        //     name: "sreachList",  //云函数名
        //     data: {
        //         dbName: 'benediction',
        //         pageIndex: 1,//每次从page条数据之后获取数据
        //         pageSize: 10//用来记录每次获取数据的数量
        //     }
        // }).then(res => {
        //     console.log(" res -------------- ", res);
        //     // if (res.result.data.length > 0) {
        //     //     let arr = res.result.data
        //     //     let arrAll = arr.filter(function (item, index) {
        //     //         let myArr = []  // 对象的某个属性放入临时数组，对比临时数组中元素所在对象的索引，
        //     //         // 多个对象可push多个，均不相同return ..&&..   有一不同 return ..||..
        //     //         arr.forEach(items => {
        //     //             myArr.push(items.name)
        //     //         })
        //     //         return myArr.indexOf(item.name) === index
        //     //     })
        //     //     console.log(" arrAll -------------- ", arrAll);
        //     //     this.setData({ contR: arrAll.length })
        //     // }
        // })
    },

    inits() {
        const that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({ screenWidths: res.windowWidth, screenHeights: res.windowHeight })
            },
        });
    },
    //显示输入框
    clickSendMsg: function (e) {
        // console.log("clickSendMsg ----------  ");
        this.setData({ showInput: true, msgInputBottom: this.data.screenHeights / 10 * 2 })
    },
    //获取值
    getInput: function (e) {
        // console.log("getInput  ----------  ");
        this.setData({ inputVal: e.detail.value });
    },
    //提交
    sendMsg: function (e) {
        // console.log("sendMsg  ---------");
        const msg = this.data.inputVal;
        if (msg == "") return;
        const userInfo = this.data.userInfo;
        const db = wx.cloud.database();
        if (this.data.hasUserInfo) {
            db.collection("benediction").add({
                data: {
                    name: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    msg: msg,
                    time: new Date(),
                }
            }).then((res) => {
                // console.log("添加成功  res --------------  ", res);
                showTextToast("您的祝福已发送~");
                this.setData({ showInput: false, inputVal: "" });
                // this.getBarrageList();
            }).catch((res) => {
                console.log("添加失败  res --------------  ", res);
            });
        } else {
            let userData = {}
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    // console.log("sendMsg  res ---------", res);
                    userData = res.userInfo
                    db.collection("benediction").add({
                        data: {
                            name: userData.nickName,
                            avatar: userData.avatarUrl,
                            msg: msg,
                            time: new Date(),
                        }
                    }).then((res) => {
                        // console.log("添加成功  res --------------  ", res);
                        // console.log(" userData --------------  ", userData);
                        showTextToast("您的祝福已发送~");
                        this.setData({
                            userInfo: userData,
                            hasUserInfo: true,
                            showInput: false,
                            inputVal: ""
                        });
                    }).catch((res) => {
                        console.log("添加失败  res --------------  ", res);
                    });
                }
            })
        }
    },
    // 初始化barrageLineCount个弹幕行
    barrageInit() {
        let barrageMsgs = this.data.barrageMsgs;
        const barrageLineCount = this.data.barrageLineCount;
        const nowTimeMillis = new Date().getTime();
        for (var i = 0; i < barrageLineCount; i++)
            barrageMsgs.push({
                'showTimeMillis': new String(nowTimeMillis -
                    Math.round(Math.random() * barrageLineCount) * 1000), msgInfos: []
            });
        this.setData({ barrageMsgs: barrageMsgs });
    },
    // 获取弹幕list
    async getBarrageList() {
        let num = this.data.num;
        let page = this.data.page;
        await wx.cloud.callFunction({
            name: "benedictionList",  //云函数名
            data: {
                num: num,    //用来记录每次获取数据的数量
                page: page,  //每次从page条数据之后获取数据
            }
        }).then(res => {
            if (res.result.data.length > 0) {
                var newData = res.result.data;
                //将时间戳写成固定格式
                newData.forEach(item => {
                    var d = new Date(item.time)
                    var year = d.getFullYear()
                    var month = d.getMonth() + 1
                    var day = d.getDate()
                    item.time = year + "/" + month + "/" + day
                    //文本内容中的换行和空格要进行相应的转换，才能保证输出的正确性
                    item.msg = item.msg.split('&hc').join('\n')
                })

                // 动态msg color
                var labLen = newData.length;
                var colorArr = this.data.colorArr;
                var colorLen = colorArr.length;
                var randomColorArrs = [];

                //判断执行
                for (var i = 0; i < colorLen; i++) {
                    if (labLen < i) break;
                    else {
                        let random = colorArr[Math.floor(Math.random() * colorLen)];
                        randomColorArrs.push(random);
                    }
                }
                this.setData({
                    barrageNewMsgs: newData,
                    randomColorArr: randomColorArrs,
                });
            }
        })
    },
    // 动态显示弹幕
    asyShowbarrage() {
        let that = this
        var arrSort = [];
        const barrageLineCount = this.data.barrageLineCount;
        for (var i = 0; i < barrageLineCount; i++) arrSort.push(i);
        arrSort.sort(() => (0.5 - Math.random()));

        var nowTimeMillis = new Date().getTime();
        var barrageNewMsgs = that.data.barrageNewMsgs;
        // 有最新弹幕
        if (barrageNewMsgs != null && barrageNewMsgs.length > 0) {
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
    },
    //分享朋友圈
    onShareTimeline: function (option) {
        //先写一个数组,
        var shareimg = this.data.shareList;
        //在写随机数
        var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
        let shareTitle = "诚挚邀请您参加我们的婚礼,见证我们美好时刻！";
        let obj = {
            title: shareTitle,
            imageUrl: randomImg,
            query: ''
        };
        return shareEvent(option, obj);
    },
    //分享用户
    onShareAppMessage: function (option) {
        //先写一个数组,
        var shareimg = this.data.shareList;
        //在写随机数
        var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
        let shareTitle = "诚挚邀请您参加我们的婚礼,见证我们美好时刻！";
        let sharePath = "/pages/home/index";
        let obj = {
            title: shareTitle,
            path: sharePath,
            imageUrl: randomImg
        };
        return shareEvent(option, obj);
    },
})

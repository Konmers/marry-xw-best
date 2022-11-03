//在这个js中专门创建Store的实例对象,引入要使用的初始化方法
import {
    action,
    observable
} from 'mobx-miniprogram'

//创建Store对象并导出
export const store = observable({
    //在此处填写共享的数据
    active: 0,
    menulist: [{
        "pagePath": "pages/home/index",
        "text": "邀请函",
        "icon": "icon-xinxinxiangdong",
    },
    {
        "pagePath": "pages/time/index",
        "text": "美好时光",
        "icon": "icon-sheying",
    }, {
        "pagePath": "pages/mine/index",
        "text": "婚礼地点",
        "icon": "icon-wuxingjijiudian",
    }, {
        "pagePath": "pages/guest/index",
        "text": "宾客信息",
        "icon": "icon-tianmiyike",
    }
    ],
    //action 方法，用来修改store中的数据
    updateActive: action(function (step) {
        this.active = step
        return this.active
    })
})

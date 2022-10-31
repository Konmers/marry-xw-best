/*
 * @Description: 
 * @Version: 
 * @Auther: Konmer
 * @time: 2022-10-17 11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-30 02
 */
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
        "iconPath": "/static/images/invites.png",
        "selectedIconPath": "/static/images/invite_click.png"
    },
    {
        "pagePath": "pages/time/index",
        "text": "美好时光",
        "icon": "icon-tianmiyike",
        "iconPath": "/static/images/marrys.png",
        "selectedIconPath": "/static/images/marry_click.png"
    }, {
        "pagePath": "pages/mine/index",
        "text": "婚礼地点",
        "icon": "icon-wuxingjijiudian",
        "iconPath": "/static/images/maps.png",
        "selectedIconPath": "/static/images/map_click.png"
    }, {
        "pagePath": "pages/guest/index",
        "text": "宾客信息",
        "icon": "icon-sheying",
        "iconPath": "/static/images/guests.png",
        "selectedIconPath": "/static/images/guest_click.png"
    }
    ],
    //action 方法，用来修改store中的数据
    updateActive: action(function (step) {
        this.active = step
        return this.active
    })
})

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    //接收父组件的参数
    properties: {
        tabList: {
            type: Array,
            value: []
        },
        tabId: {
            type: String,
            value: '0'
        },

    },
    //组件的初始数据
    data: {

    },
    //组件的方法列表
    methods: {
        _tabChange(e) {
            let tabId = e.currentTarget.dataset.id
            //更新子组件内
            this.setData({
                tabId: tabId
            })
            //调用父组件自定义方法，传参
            this.triggerEvent('onTab', tabId)
        },
    }
})

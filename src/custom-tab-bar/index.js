import {
	storeBindingsBehavior
} from 'mobx-miniprogram-bindings'
import {
	store
} from '../common/store.js'
const app = getApp();
Component({
	data: {},
	// 通过 storeBindingsBehavior 来实现自动绑定
	behaviors: [storeBindingsBehavior],
	storeBindings: {
		//数据源 指定要绑定的 store
		store,
		//属性 指定要绑定的字段数据
		fields: {
			active: "active", //左侧为组件中属性的名字 右侧为Store中属性的名字
			menulist: "menulist"
		},
		//方法 指定要绑定的方法
		actions: {
			updateActive: 'updateActive', //左侧为组件中方法的名字 右侧为Store中方法的名字
		}
	},
	methods: {
		switchTab(e) {
			this.updateActive(e.currentTarget.dataset.index);
			this.setData({
				selected: e.currentTarget.dataset.index
			})
			wx.switchTab({
				url: `/${e.currentTarget.dataset.path}`
			})
		},

	}

})
import {request} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
		// 左侧的菜单数据
		leftMenuList: [],
		// 右侧的商品数据
		rightContent: [],
		// 被点击的左侧的菜单
		currentIndex: 0,
		// 右侧滚动条距离顶部的距离
		scrollTop: 0
  },
	// 左侧菜单的点击事件
	handleItemTap(e) {
		this.setData({
			currentIndex: e.currentTarget.dataset.index,
			// 切换后回到顶部
			scrollTop: 0
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let storageData = wx.getStorageSync('cates')
		if (!storageData || Date.now() - storageData.time > 1000 * 600) {
			this.getCates()
		} else {
			const {data} = storageData
			const leftMenuList = data.map(v => v.cat_name)
			const rightContent = data.map(v => v.children)
			this.setData({
				leftMenuList,
				rightContent
			})
		}
		
  },
	async getCates() {
		// 使用es7的async await来发送请求
		const res = await request({
			url: '/categories'
		})
		const data = res
		const leftMenuList = data.map(v => v.cat_name)
		const rightContent = data.map(v => v.children)
		wx.setStorageSync('cates', {
			time: Date.now(),
			data
		})
		this.setData({
			leftMenuList,
			rightContent
		})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
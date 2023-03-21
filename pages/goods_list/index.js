import {request} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
		tabs: [
			{
				id: 0,
				value: '综合',
				isActive: true
			},
			{
				id: 1,
				value: '销量',
				isActive: false
			},
			{
				id: 2,
				value: '价格',
				isActive: false
			}
		],
		goodsList: []
  },
	// 接口要的参数
	queryParams: {
		query: '',
		cid: '',
		pagenum: 1,
		pagesize: 10
	},
	// 总页数
	totalPages: 1,
	// 标题点击事件
	handleTabsItemChange(e) {
		// 1.获取被点击的索引
		let {index} = e.detail
		// 2.修改原数组
		const {tabs} = this.data
		tabs.forEach((v, i) => i === index? v.isActive = true : v.isActive = false)
		this.setData({
			tabs
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.queryParams.cid = options.cid || ''
		this.queryParams.query = options.query || ''
		this.getGoodsList()
  },
	
	// 获取商品列表数据
	async getGoodsList() {
		const res = await request({
			url: '/goods/search',
			data: this.queryParams
		})
		// 计算总页数
		this.totalPages = Math.ceil(res.total / this.queryParams.pagesize) 
		this.setData({
			goodsList: [...this.data.goodsList, ...res.goods]
		})
		this.queryParams.pagenum++
		wx.stopPullDownRefresh()
	},
	
	// 上拉加载更多
	onReachBottom() {
		if (this.queryParams.pagenum >= this.totalPages) {
			wx.showToast({
				title: '没有下一页数据'
			})
		} else {
			this.getGoodsList()
		}
	},
	
	// 下拉刷新
	onPullDownRefresh() {
		this.setData({
			goodsList: []
		})
		this.queryParams.pagenum = 1
		this.getGoodsList()
	}
})
import { request } from '../../request/index.js'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsObj: {},
		// 商品是否被收藏
		isCollect: false
	},
	// 保存商品信息
	goodsObj: {},
	// 保存图片路径
	goodsImage: [],
	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow() {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const options = currentPage.options
		const goodsId = options.goods_id
		this.getGoodsDetail(goodsId)
	},

	// 请求商品详情
	async getGoodsDetail(goods_id) {
		const goodsObj = await request({
			url: '/goods/detail',
			data: {
				goods_id
			}
		})
		// 处理图片路径
		this.goodsObj = goodsObj
		this.goodsImage = goodsObj.pics.map(v => v.pics_mid)
		// 1 获取缓存中的商品收藏的数组
		const collect = wx.getStorageSync('collect') || []
		// 2 判断当前商品是否被收藏
		const isCollect = collect.some(v => v.goods_id === this.goodsObj.goods_id)
		this.setData({
			goodsObj: {
				goods_price: goodsObj.goods_price,
				goods_name: goodsObj.goods_name,
				goods_introduce: goodsObj.goods_introduce,
				pics: goodsObj.pics
			},
			isCollect
		})
	},
	// 点击图片放大预览
	handlePreviewImage(e) {
		const current = e.currentTarget.dataset.url
		wx.previewImage({
			urls: this.goodsImage,
			current
		})
	},
	// 加入购物车
	handleCartAdd() {
		const cart = wx.getStorageSync('cart') || []
		let index = cart.findIndex(v => v.goods_id === this.goodsObj.goods_id)
		if (index === -1) {
			this.goodsObj.num = 1
			this.goodsObj.checked = true
			cart.push(this.goodsObj)
		} else {
			cart[index].num++
		}
		wx.setStorageSync('cart', cart)
		wx.showToast({
			title: '加入成功',
			icon: 'success',
			mask: true
		})
	},
	// 点击 商品收藏图标
	handleCollect() {
		// 1 获取缓存中的商品收藏数组
		const collect = wx.getStorageSync('collect') || []
		// 2 判断该商品是否被收藏过
		const index = collect.findIndex(v => v.goods_id === this.goodsObj.goods_id)
		// 3 当index!=-1表示 已经收藏过
		if (index !== -1) {
			// 能找到 已经收藏过了 在数组中删除该商品
			collect.splice(index, 1)
		} else {
			// 没有收藏过
			collect.push(this.goodsObj)
		}
		// 4 把数组存入到缓存中
		wx.setStorageSync('collect', collect)
		// 5 修改data中的属性 isCollect
		this.setData({
			isCollect: !this.data.isCollect
		})
			
	}
})
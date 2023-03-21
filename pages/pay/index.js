import { chooseAddress, showModel, showToast, requestPayment } from '../../utils/asyncWx.js'
import { request } from '../../request/index.js'

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 保存地址
    this.getAddress()
    // 保存购物车数据
    this.getCart()
    // 初始总价与数量
    this.getTotalPrice()
  },
  // 保存地址方法
  getAddress() {
    const address = wx.getStorageSync('address')
    this.setData({
      address
    })
  },
  // 获得购物车内容
  getCart() {
    const cart = wx.getStorageSync('cart') || []
    this.setData({
      cart
    })
  },
  // 计算总价
  getTotalPrice() {
    const checkedList = this.data.cart.filter(v => v.checked)
    let totalNum = checkedList.length
    let totalPrice = checkedList.reduce((total, n) => {
      return total + n.goods_price * n.num
    }, 0)
    this.setData({
      totalPrice,
      totalNum,
      cart: checkedList
    })
  },
  // 点击 结算
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token
      const token = wx.getStorageSync('token')
      // 2 判断
      if (token === '') {
        wx.navigateTo({ url: '/pages/auth/index' })
        return
      }
      // 创建订单
      // 3.1 准备 请求头参数
      // const header = { Authorization: token }
      // 3.2 准备 请求体参数
      const goods = this.data.cart.map(v => {
        return {
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        }
      })
      const consignee_addr = `${this.data.address.provinceName}${this.data.address.cityName}${this.data.address.countyName}${this.data.address.detailInfo}${this.data.address.userName}${this.data.address.telNumber}`
      const orderParams = {
        order_price: this.data.totalPrice,
        consignee_addr,
        goods
      }
      // 4 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: orderParams
      })
      // 5 发起 预支付接口
      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        data: { order_number }
      })
      // 6 发起微信支付
      await requestPayment(pay)
      // 7 查询后台 订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'POST',
        data: { order_number }
      })
      await showToast({ title: '支付成功' })

      // 8 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart) 

      // 9 支付成功了 跳转到订单页面
      wx.navigateTo({ url: '/pages/order/index' })
    } catch (error) {
      console.log(error)
      await showToast({ title: '支付失败' })
    }
  }
})
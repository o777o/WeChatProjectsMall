import { chooseAddress, showModel, showToast } from '../../utils/asyncWx.js'

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
  // 点击收货地址
  async handleChooseAddress() {
    // 调用获取收货地址的 api
    const address = await chooseAddress()
    // 存入到缓存中
    wx.setStorageSync('address', address);
  },
  // 保存地址方法
  getAddress() {
    const address = wx.getStorageSync('address')
    this.setData({
      address
    })
  },
  // 获得购物车内容与初始化全选按钮
  getCart() {
    const cart = wx.getStorageSync('cart') || []
    const allChecked = cart.length > 0 ? cart.every(v => v.checked) : false
    this.setData({
      cart,
      allChecked
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
      totalNum
    })
  },
  // 事件监听
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id
    const { cart } = this.data
    const changeGoods = cart.find(v => goods_id === v.goods_id)
    changeGoods.checked = !changeGoods.checked
    wx.setStorageSync('cart', cart)
    this.getCart()
    this.getTotalPrice()
  },
  // 商品全选功能
  handleItemAllCheck() {
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    wx.setStorageSync('cart', cart)
    this.getCart()
    this.getTotalPrice()
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset
    // 2 获取购物车数组
    const { cart } = this.data
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4 判断是否要执行删除
    if (cart[index].num + operation) {
      cart[index].num += operation
      wx.setStorageSync('cart', cart)
      this.getCart()
      this.getTotalPrice()
    } else {
      const res = await showModel({ content: '您是否要删除？' })
      if (res.confirm) {
        cart.splice(index, 1)
        wx.setStorageSync('cart', cart)
        this.getCart()
        this.getTotalPrice()
      }
    }
  },
  // 点击 结算
  async handlePay() {
    // 1 判断 收货地址
    const { address, totalNum } = this.data
    if (!Object.keys(address).length) return await showToast({ title: '您还没有选择收货地址' })
    // 2 判断用户有没有选购商品
    if (!totalNum) return await showToast({ title: '您还没有选择商品' })
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})
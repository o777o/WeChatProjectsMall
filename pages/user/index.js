// pages/user/index.js
Page({
  data: {
    userInfo: null,
    // 被收藏的商品的数量
    collectNums: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync('userinfo')
    const collect = wx.getStorageSync('collect') || []
      
    this.setData({ userInfo, collectNums: collect.length })
  }
})
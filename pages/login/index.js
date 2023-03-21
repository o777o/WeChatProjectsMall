// pages/login/index.js
import { getUserProfile } from '../../utils/asyncWx.js'

Page({
  async getUserProfile() {
    const { userInfo } = await getUserProfile('用于获取头像、昵称等信息')
    console.log(userInfo);
    wx.setStorageSync('userinfo', userInfo)
    wx.navigateBack({ delta: 1 })
  }
})
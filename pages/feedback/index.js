import { showToast, uploadFile } from '../../utils/asyncWx.js'

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ''
  },
  // 外网的图片的路径数组
  upLoadImgs: [],
  // 标题点击事件
  handleTabsItemChange(e) {
    // 1.获取被点击的索引
    let { index } = e.detail;
    // 2.修改原数组
    const { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs,
    });
  },
  // 点击 “+” 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片api
    wx.chooseImage({
      success: (result) => {
        // 图片数组 进行拼接
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },
  handleRemoveImg(e) {
    const index = this.data.chooseImgs.findIndex(v => v === e.detail)
    const chooseImgs = this.data.chooseImgs
    chooseImgs.splice(index, 1)
    this.setData({ chooseImgs })
  },
  // 文本域的输入的事件
  handleTextInput(e) {
    this.setData({ textVal: e.detail.value })
  },
  // 提交按钮的点击
  async handleFormSubmit() {
    // 1 获取文本域的内容
    const { textVal, chooseImgs } = this.data
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      showToast({ title: '输入不合法' })
      return
    }
    // 3 准备上传图片 到专门的图片服务器
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    })
      
    const uploadList = []
    chooseImgs.forEach(v => {
      uploadList.push(uploadFile({
        url: 'https://media.mogu.com/image/scale?appKey=15m&w=500&h=500&quality=100',
        filePath: v,
        name: 'image'
      }))
    })  
    try {
      if (uploadList.length !== 0) {
        const res = await Promise.all(uploadList)
        res.forEach(v => {
          const url = JSON.parse(v.data).result.url
          this.upLoadImgs.push(url)
        }) 
      }
      console.log('把文本的内容和外网的图片数组 提交到后台中')
      this.setData({ textVal: '', chooseImgs: [] })
    } catch (e) {
      console.log(e);
      return
    } finally {
      wx.hideLoading()
    }
    // 返回上一个页面
    wx.navigateBack({ delta: 1 })
  }
})

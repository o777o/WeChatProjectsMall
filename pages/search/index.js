import { request } from '../../request/index.js'

Page({
  data: {
    goods: [],
    debounceQsearch: null,
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inputValue: ''
  },
  onShow() {
    this.debounceQsearch = this.debounce(this.qsearch)
  },
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 1 获取输入框的值
    const { value } = e.detail
    // 2 检测合法性
    if (!value.trim()) {
      this.setData({ goods: [], isFocus: false })
    } else {
      this.setData({ isFocus: true })
    }
    // 3 准备发送请求获取数据
    this.debounceQsearch(value)
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    if (!query.trim()) return
    const res = await request({ url: '/goods/qsearch', data: { query } })
    this.setData({ goods: res })
  },
  // 点击 取消按钮
  handleCancel() {
    this.setData({
      inputValue: '',
      isFocus: false,
      goods: []
    })
  },
  // 防抖函数
  debounce(func, delay=1000) {
    let timer = null
    return function(...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
})
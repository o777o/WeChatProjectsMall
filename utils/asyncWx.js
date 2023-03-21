export const chooseAddress = function() {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
}

/**
 *   promise 形式 showModel
 *  @param { object } param0 参数
 * **/
export const showModel = ({ content }) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 *   promise 形式 showToast
 *  @param { object } param0 参数
 * **/
export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      mask: true
    })
  })
}

/**
 * promise 形式 login
 * @returns { Promise<{ code:string }> }
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * promise 形式的 小程序的微信支付
 * @param {object} pay 支付所必要的参数 
 * @returns { Promise }
 */
export const requestPayment = pay => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * @param {string} desc 声明获取用户个人信息后的用途，不超过30个字符
 * @returns { Promise }
 */
export const getUserProfile = desc => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * promise 形式的 小程序的上传文件
 * @param {object} params 
 * @returns { Promise }
 */
export const uploadFile = params => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      ...params,
      success: result => {
        resolve(result)
      },
      fail: error => {
        reject(error)
      }
    })
  })
}
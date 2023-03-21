let ajaxTimes = 0
export const request = params => {
	// 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
	const header = params.header || {}
	if (params.url.includes('/my/')) {
		// 拼接header 带上token
		header['Authorization'] = wx.getStorageSync('token')
	}

	ajaxTimes++
	// 显示加载中 效果
	wx.showLoading({
		title: '加载中',
		mask: true
	})
	// 定义公共的url
	let baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			header,
			url: baseUrl + params.url,
			success: (result) => {
				resolve(result.data.message)
			},
			fail: (err) => {
				reject(err)
			},
			complete() {
				if (!--ajaxTimes) {
					wx.hideLoading()
				}
			}
		})
	})
}
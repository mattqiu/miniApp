//app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
  },
  fetchApi(url, callback) {
		wx.request({
			url,
			data: {},
			header: {
				'content-type': 'application/json'
			},
      dataType:"json",
			success(res) {
				callback(null, res.data);
			},
			fail(e) {
				callback(e)
			}
		})
	},
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    img : "https://m.xidibuy.com:8000/image/",
    data: "https://m.xidibuy.com:8000/data/"

  }
})
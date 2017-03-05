//app.js
let extend = require('./utils/util.js').extend;

App({
  onLaunch() {
    this.loginOnLaunch();
    // this.getUserInfo();
  },

  // 取数据 默认get
  fetchApi(url, callback) {
    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          callback(res.data);
        }
      },
      fail(e) {
        console.error(url);
        console.error(e);
      }
    })
  },

  // 传数据 默认post
  postApi(url, data, callback) {
    let self = this;
    let session = wx.getStorageSync('3rd_session');
    if (session) {
      data = extend({}, { '3rd_session': session }, data);
      wx.request({
        url,
        data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success(res) {
          if (res.statusCode == 200) {
            callback(res.data);
          }
        },
        fail(e) {
          console.error(url);
          console.error(e);
        }
      })
    } else {
      self.checkSession();
    }
  },

  getUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('userRawInfo', res);
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: function (res) {
        // fail
      }
    })
  },

  // 登录
  login() {
    let self = this;
    wx.login({
      success(res) {
        if (res.code) {
          let url = self.globalData.dataRemote + 'weixin/session';
          let data = {
            code: res.code
          };
          wx.request({
            url,
            data,
            method: 'POST',
            success: function (resp) {
              if (resp.data.code == 0) {
                wx.setStorage({
                  key: '3rd_session',
                  data: resp.data.data,
                  success: function () {
                    wx.showToast({
                      title: '登陆成功!',
                      mask: true,
                      icon: 'success',
                      duration: 1000
                    })
                  }
                })
              }
            }
          })
        }
      }, fail(e) {
        wx.showModal({
          title: '',
          content: '登陆失败!请稍后重试！',
          showCancel: false
        })
        console.error(e);
      }
    });
  },


  checkSession(cb) {
    let self = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        if (wx.getStorageSync('3rd_session') == "") {
          wx.showModal({
            title: '提示',
            content: '尚未登录，请登录！',
            confirmText: '登录',
            success: function (res) {
              if (res.confirm) {
                self.login();
              }
            }
          })
        }else{
          cb && cb()
        }
      },
      fail: function () {
        //登录态过期
        //重新登录
        wx.showModal({
          title: '提示',
          content: '尚未登录，请登录！',
          confirmText: '登录',
          success: function (res) {
            if (res.confirm) {
              self.login();
            }
          }
        })
      }
    })
  },

  // 初次请求登录
  loginOnLaunch() {
    let self = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        if (wx.getStorageSync('3rd_session') == "") {
          wx.showModal({
            title: '提示',
            content: '尚未登录，请登录！',
            confirmText: '登录',
            success: function (res) {
              if (res.confirm) {
                self.login();
              }
            }
          })
        }
      },
      fail: function () {
        //登录态过期
        //重新登录
        wx.showModal({
          title: '提示',
          content: '尚未登录，请登录！',
          confirmText: '登录',
          success: function (res) {
            if (res.confirm) {
              self.login();
            }
          }
        })
      }
    })

  },

  globalData: {
    dataRemote: "https://wxapp.xidibuy.com/"
  }
})

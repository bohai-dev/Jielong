App({

  onLaunch: function () {

    // this.getPermissions()   //获取权限
    this.getUserInfo();


  },

  checkLogin: function () {
    var self = this
    var session = wx.getStorageSync("session");
    if (session) {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
          console.log("用户id：" + wx.getStorageSync("userId"));
        },
        fail: function () {
          //登录态过期
          self.login()  //重新登录
        }

      })
    } else {
      console.log('登录')
      self.login()
    }

  },

  //登录方法
  login: function () {
    var self = this;
    wx.login({
      success: function (res) {

        var code = res.code
        if (code) {
          console.log('获取用户登录凭证：' + code);
          //   console.log(self.globalData)
          var loginParams = { code: code };
          if (self.globalData.parentUserId) {
            loginParams.parentUserId = self.globalData.parentUserId;
          }
          // console.log(loginParams);
          // 发送 res.code 到后台登录
          wx.request({
            url: self.globalData.domain + '/user/login',
            data: loginParams,
            success: function (res) {
              console.log(res.data)
              var response = res.data;
              if (response.errorCode == 0) {   //登录成功
                var userId = response.data.userId;
                console.log(userId)
                wx.setStorageSync("session", response.data.sessionId)
                wx.setStorageSync("userId", userId)

                //插入用户信息
                console.log('插入用户信息')
                self.insertUserInfo();

              }

            },
            fail: function (error) {
              console.log(error)
            }
          })

        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
  },

  insertUserInfo: function () {
    var self = this;
    var data = {
      userId: wx.getStorageSync("userId"),
      nickName: this.globalData.userInfo.nickName,
      avatarUrl: this.globalData.userInfo.avatarUrl
    }
    console.log(data)
    wx.request({
      url: this.globalData.domain + '/userInfo/insert',
      method: 'POST',
      data: data,
      success: function (res) {
        var response = res.data;
        if (response.errorCode == 0) {
          console.log('插入信息成功');
          //  this.login();
        }
      },
      fail: function (err) {
      }

    })
  },
  showAutoModal: function (perssionName) {
    console.log('强行获取权限')
    var self = this
    wx.showModal({
      title: '微信授权',
      content: '允许获取你的公开信息(昵称、头像等)和位置',
      confirmText: '去授权',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (res) {
              console.log(res);
              if (!res.authSetting[perssionName]) {  //
                console.log('授权未成功')
                //递归获取权限,直到授权成功
                //self.showAutoModal(perssionName)
                if (perssionName == 'scope.userLocation') {
                  //获取用户信息
                  self.showAutoModal(perssionName)
                }
              } else {
                if (perssionName == 'scope.userInfo') {
                  //获取用户信息
                  self.getUserInfo()
                }
              }
            }
          })
        }
      }
    })
  },
  //授权
  getPermissions: function () {

    var self = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('没有授权个人信息')
          //获取个人信息
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log('授权成功')
              //获取用户信息
              self.getUserInfo()
            },
            fail() {  //授权失败
              console.log('授权失败')
              // self.showAutoModal('scope.userInfo')
            }
          })
        } else {
          //获取用户信息
          self.getUserInfo()
        }
        if (!res.authSetting['scope.userLocation']) {
          //获取位置权限
          wx.authorize({
            scope: 'scope.userLocation',
            fail() {  //授权失败,重新获取所有权限
              self.showAutoModal('scope.userLocation')
            }
          })
        }

      }
    })


  },
  getUserInfo: function () {
    var self = this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        self.globalData.userInfo = res.userInfo;
        self.checkLogin();
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },
     
  

  //全局数据
  globalData: {
    userInfo: null,
    domain: "http://47.88.54.113:8081",
    domainUpload: "https://upload.95cfuns.com/",
    xOssProcess: "?x-oss-process=image/resize,w_350,h_350",    
    swiperXOssProcess:"?x-oss-process=image/resize,w_750,h_320",     
  //  domain: "http://47.100.12.188:8081",
    // domain: "http://192.168.1.108:8081",
    classifyData:[],
    firstClassify:[],   //分类一级数据
    secondClassify:[],   //分类二级数据
    initClassify:[]
  }

})

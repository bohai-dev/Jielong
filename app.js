var coolsite360 = require('./coolsite/index.js');
App({
  coolsite360: coolsite360,

  onLaunch: function () {
   
    this.getPermissions()   //获取权限
   

    var session = wx.getStorageSync("session");
    if (session) {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
          console.log("用户id：" + wx.getStorageSync("userId"));
        },
        fail: function () {
          //登录态过期
          this.login()  //重新登录
        }

      })
    } else {
      console.log('登录')
      this.login()
    }


   
     this.getUserInfo()      //获取个人信息

  





  },

 

  //登录方法
  login: function () {
    var self = this
    wx.login({
      success: function (res) {

        var code = res.code
        if (code) {
          console.log('获取用户登录凭证：' + code);
          console.log(self.globalData)

          // 发送 res.code 到后台登录
          wx.request({
            url: self.globalData.domain + '/user/login',
            data: {
              code: code
            },
            success: function (res) {
              console.log(res.data)
              var response = res.data;
              if (response.errorCode == 0) {
                wx.setStorageSync("session", response.data.sessionId)
                wx.setStorageSync("userId", response.data.userId)
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

  showAutoModal: function (perssionName) {
    console.log('强行获取权限')
    var self=this
    wx.showModal({
      title: '微信授权',
      content: '允许获取你的公开信息(昵称、头像等)和位置',
      confirmText:'去授权',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (res) {


              if (!res.authSetting[perssionName] ) {  //
                 console.log('授权未成功')
                 //递归获取权限,直到授权成功
                 self.showAutoModal(perssionName)
              }
            }
          })
        }
      }
    })
  },
  //授权
  getPermissions:function(){
 
    var self = this
    wx.getSetting({
      success(res){
        if (!res.authSetting['scope.userInfo']){
            console.log('没有授权个人信息')
           //获取个人信息
           wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log('授权成功')
            },
            fail() {  //授权失败
              console.log('授权失败')
              self.showAutoModal('scope.userInfo')
            }
          })
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
   

  } ,
  getUserInfo: function () {
        var self = this
        wx.getUserInfo({
          success:function(res){
            self.globalData.userInfo = res.userInfo   
          },
          fail:function(res){
            console.log(res)
          }
        })

      },
     
  

  //全局数据
  globalData: {
    userInfo: null,
    domain: 'http://192.168.16.110:8080'
  }

})

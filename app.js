var coolsite360 = require('./coolsite/index.js');
App({
  coolsite360: coolsite360,

  onLaunch: function () {
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })
    

    var session = wx.getStorageSync("session");
    if(session){
       wx.checkSession({
         success: function () {
           //session 未过期，并且在本生命周期一直有效
           console.log("用户id："+wx.getStorageSync("userId"));
         },
         fail: function () {
           //登录态过期
           this.login()  //重新登录
        }

       })
    }else{
        console.log('登录')     
        this.login() 
    }


  this.getUserInfo()

    

  
  
    
  },


//登录方法
login:function(){
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
            var response=res.data;
            if(response.errorCode==0){
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

getUserInfo:function(){
  var self=this
 
  wx.getUserInfo({
    success: res => {
      console.log(res)     
      self.globalData.userInfo = res.userInfo      
    },
    fail:res=>{   //授权失败,重新获取权限
      wx.openSetting({
        success: function (res) {
          if (!res.authSetting["scope.userInfo"]) {
            //这里是授权成功之后 填写你重新获取数据的js
            self.globalData.userInfo = res.userInfo
          }
        }
      })
    }
  })
},
globalData: {
    userInfo: null,
    domain:'http://192.168.16.110:8080'
  }

})
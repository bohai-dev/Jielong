// pages/personal/mineProgramYard/miniProgramYard.js
var app = getApp();
var _this = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yardImgSrc: null, //小程序码路径
    // hasAuthAlbum:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    console.log(wx.getStorageSync("userId"))
    _this = this;
    _this.getProgramYard(wx.getStorageSync("userId"));

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 自定义事件  */
  //获取小程序码
  getProgramYard: function (userId) {
    console.log(userId);
    wx.request({
      url: app.globalData.domain + '/userInfo/selectQRcode?userId=' + userId,
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200 && res.data.errorCode == 0) {
          _this.setData({
            yardImgSrc: res.data.data
          })
        }
      }
    })
  },

  //点击保存
  previewYard: function () {
    wx.previewImage({
      urls: [_this.data.yardImgSrc],
    })

  },

  //长按保存图片
  saveToAlbum: function () {
    _this.getAuthorizeAlbum();

  },


  //是否授权访问相册
  getAuthorizeAlbum: function () {
    wx.showLoading({
      title: '保存中...',
    })
    wx.getSetting({
      success: function (res) {
        console.log(res)
        console.log(res.authSetting["scope.writePhotosAlbum"])
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              // console.log("允许访问相册成功！");
              _this.downloadSaveAlbum();
            },
            fail: function (res) {
              // console.log("不允许访问相册！");
              wx.hideLoading();
              _this.getOpenSettingAlbum();
            }
          })

        } else {
          _this.downloadSaveAlbum();
        }
      },
      fail: function () {
        wx.hideLoading();
        // console.log("setFailOFail");
      }
    })
  },

  //打开设置界面授权
  getOpenSettingAlbum: function () {
    wx.openSetting({
      success: function (res) {
        // console.log("成功打开授权设置！");
      },
    })
  },

  //保存到相册
  downloadSaveAlbum: function () {
    wx.downloadFile({
      url: _this.data.yardImgSrc,
      success: function (res) {
        console.log(res.tempFilePath)
        var downloadPath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: downloadPath,
          success: function () {
            wx.showModal({
              content: '成功保存二维码到相册!',
            })
          },
          complete: function (res) {
            wx.hideLoading();
          }
        })

      }, complete: function (res) {
        wx.hideLoading();
      }
    })


  }
})
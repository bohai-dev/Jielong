// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "add",
  /**
   * 页面的初始数据
   */

  data: {




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  onShareAppMessage: function (res) {
  },

  //以下为自定义点击事件
  //初始化数据
  initData: function (e) {
    wx.removeStorage({
      key: 'seleAddrKey',
      success: function (res) {
        console.log(res);
      },
    })
  },
  //获取登陆用户信息
  getUserInfo: function (res) {
    if (res.detail.rawData) {
      wx.showLoading({
        title:"数据加载中...",
        mask: true
      })
      if (!app.globalData.userInfo) {
        app.globalData.userInfo = JSON.parse(res.detail.rawData);
        app.login();
        setTimeout(function () {
          wx.navigateTo({
            url: '../release/release',
            complete: function () {
              wx.hideLoading();
            }
          })
        }, 2000)
      }else{
        wx.navigateTo({
          url: '../release/release',
          complete: function () {
            wx.hideLoading();
          }
        })
      }
    }else{

    }
  }

})


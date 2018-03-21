// pages/personal/address/address.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    console.log(app);
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/userAddress/selectByUserId',
      data: {
        userId: wx.getStorageSync("userId")
      },
      success: function (res) {
        console.dir(res);
        if (res.data.errorCode == 0) {
          console.dir(_this);
          _this.setData({ addressList: res.data.data })
          console.log(_this.data.addressList);

        }
      }
    })  
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
  // 删除自提点
  deleteAddr:function(e){
    console.log(e);

  }
 
})
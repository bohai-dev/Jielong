// pages/personal/mineJieLong/mineJieLong.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    isShow:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.initData();
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

  //自定义方法
  initData:function(){
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/jielong/selectByUserId',
      method: "GET",
      data: { userId: wx.getStorageSync("userId") },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200 && res.data.data.length) {
          _this.setData({
            data: res.data.data,
            isShow: true
          })
        } else {
          _this.setData({
            isShow: false
          })
        }
      },
      fail: function (err) {
        _this.setData({
          isShow: false
        })
      }
    })
  },
  //
  navToDetail:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../../detail/detail?id='+e.currentTarget.dataset.id +"&fromMine=1",
    })


  }
 

})
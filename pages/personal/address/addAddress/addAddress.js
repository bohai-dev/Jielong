// pages/personal/address/addAddress/addAddress.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrName:"地图定位",
    longitude:"",
    latitude:""
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
  // 保存信息
  formSubmit: function (e) {
    if(e.detail.value.detail){
    var data = {
      userId: wx.getStorageSync("userId"),
      name: this.data.addrName,
      detail: e.detail.value.detail,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }
    console.log(data);
    wx.request({
      url: app.globalData.domain + '/userAddress/insert',
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      data: data,
      success: function (res) {
        console.log(res);
        var data = res.data
        if (data.errorCode == 0) {
          console.log('插入地址成功');
          wx.showToast({
            title: '保存成功',
            success: function(){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      }
    })

    }else{
      wx.showModal({
        title: '请输入自提详细地址',
        showCancel:false
      })
    }
  },
  // 打开地图
  findAddress: function(e){
    var self = this;
    wx.chooseLocation({
      type:"wgs84",
      success:function(res){
        console.log(res);
        self.setData({
          addrName:res.name,
          longitude:res.longitude,
          latitude:res.latitude
          })
      },
      fail:function(err){
        console.log(err);
      }
    })
  }  
})
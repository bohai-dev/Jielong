// pages/personal/address/addAddress/addAddress.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrDetail:"",
    addrName:"地图定位",
    longitude:"",
    latitude:"",
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        addrDetail:options.detail,
        addrName:options.name,
        id:options.id
      })
    }
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
    var data = {
      id: this.data.id,
      userId: wx.getStorageSync("userId"),
      name: this.data.addrName,
      detail: e.detail.value.detail,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    };
    //修改信息
    if (e.detail.value.detail && this.data.id){
      wx.request({
        url: app.globalData.domain +'/userAddress/updateById',
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: data,
        success:function(res){
          var data = res.data
          if (data.errorCode == 0) {
            console.log('修改地址成功');
            wx.showToast({
              title: '保存成功',
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } 
        }
      })
    }
    // 新增信息
    else if(e.detail.value.detail){
    wx.request({
      url: app.globalData.domain + '/userAddress/insert',
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      data: data,
      success: function (res) {
        var data = res.data
        if (data.errorCode == 0) {
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
        self.setData({
          addrName:res.name,
          longitude:res.longitude,
          latitude:res.latitude
          })
      }
    })
  },
  // 删除自提点
  deleAddress:function(e){
    console.log(this)
    var _this = this;
    wx.showModal({
      title: '是否确认删除此自提点？',
      success: function (res) {
      if (res.confirm) {
      if (_this.data.id){
      wx.request({
        url: app.globalData.domain + '/userAddress/deleteById',
        data:{
          id: _this.data.id
        },
        success:function(res){
          console.log(res);
          if(res.data.errorCode == 0){
            wx.showToast({
              title: '删除成功',
              success:function(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        }
      })
    }
    }else{
       return;
        }
      }
    })
  }  
})
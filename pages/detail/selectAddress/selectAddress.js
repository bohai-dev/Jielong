// pages/detail/selectAddress/selectAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    selectId: ""        //选中的自提点
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.jsonStr);
    data.forEach(function(e){
      if(!e.selectVal){
        e.selectVal = false;
      }
    })
    this.setData({
      addressList:data
    })
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

  //确认自提点
  sureAddr:function(){
    var _this = this;
    if (_this.data.selectId){
      this.data.addressList.forEach(function(e){
        if (e.id == _this.data.selectId){
          var page = getCurrentPages();
          var prePage = page[page.length - 2];
          prePage.data.GoodsDetialList[2].mineName = "自提点：" + e.detail;
          prePage.setData({
            selectAddrId: _this.data.selectId,
            GoodsDetialList: prePage.data.GoodsDetialList,
            selectAddrDetail:e.detail
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })

    }
  },

  //切换自提点
  radioChange:function(e){
    this.data.selectId = e.detail.value;
  }

})
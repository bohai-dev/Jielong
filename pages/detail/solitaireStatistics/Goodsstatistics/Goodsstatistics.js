// pages/detail/solitaireStatistics/Goodsstatixtics/Goodsstatistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{
      pickBeans:[]
    },
    isShow:false,
    startTime:'',
    endTime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.item))
    this.initData(JSON.parse(options.item));
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

  //初始化数据
  initData:function(datas){
    console.log(datas)
    var _this = this;
    if(datas.pickBeans){
    datas.pickBeans.map(function(res,index){
      res.isShow = false;
      return res;
    })
    _this.setData({
      data:datas
    })
    }

  },

  //显示详细
  showDetail:function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    _this.data.data.pickBeans.map(function(res,resIndex){
      if (index == resIndex){
        res.isShow = !res.isShow;
      }
      return res;
    })
    
    this.setData({
      data: _this.data.data
      
    })
  }
})
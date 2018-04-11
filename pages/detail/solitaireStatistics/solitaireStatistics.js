// pages/detail/solitaireStatistics/solitaireStatistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pickerData:{
        s_startDate: "",
        s_endDate: "",
        e_startDate: "",
        e_endDate:"",
      },
      goodsList:[{
        title:"手机1",
        phone:"18333333333",
        num:"1",
        pirce:"1.00"
      }, {
        title: "手机2",
        people: "1",
        num: "1",
        pirce: "1.00"
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化时间
    this.initTime();
  
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

  //自定义事件
  //初始化时间
  initTime:function(){
    var oneYearTime = new Date(new Date().getTime() - 365*24*60*60*1000).toLocaleDateString();
    var todayTime = new Date().toLocaleDateString();
    this.setData({
      pickerData:{
        s_startDate: oneYearTime,
        s_endDate: todayTime,
        e_endDate: todayTime
      }
    })

  },
  //开始时间选择
  s_picker:function(e){
    var _this = this;
    this.setData({
      showStartDate: e.detail.value,
      pickerData: {
        s_startDate: _this.data.pickerData.s_startDate,
        s_endDate: _this.data.pickerData.s_endDate,
        e_endDate: _this.data.pickerData.e_endDate,
        e_startDate: e.detail.value,

      }
    })
  },
  //结束时间选择
  e_picker: function (e) {
    console.log(e)
    this.setData({
      showEndDate: e.detail.value
    })
  },
  //搜索
  searchByTime:function(e){
    console.log(this)
  },
  //查看具体的某个商品
  navToGoods:function(e){
    wx.navigateTo({
      url: './Goodsstatistics/Goodsstatistics',
    })
  }


})
// pages/detail/solitaireStatistics/solitaireStatistics.js
var app = getApp();

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
      goodsList:[],
      jieLongId:"",
      allPeople:null,
      allPrice:null,
      startGsTime:null,
      endGsTime:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化时间
    console.log(options)
    this.data.jieLongId = options.jieLongId;
    this.initTime();
    //初始化数据
    this.initData({ jielongId: this.data.jieLongId});
  
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
  initData: function (e){
    var _this = this;
    wx.showLoading({
      title: '数据搜索中...',
    })
    console.log(e)
    wx.request({
      url: app.globalData.domain + '/order/pickCount',
      method:"get",
      data:e,
      success:function(res){
        console.log(res)
        if(res.statusCode == 200 && res.data.data.length){
          _this.data.allPeople = null;
          _this.data.allPrice = null;
          res.data.data.forEach(function(ref){
            _this.data.allPeople += ref.joinPeopleSum;
            _this.data.allPrice += ref.moneySum;
          })
          _this.setData({
            goodsList:res.data.data,
            allPeople: _this.data.allPeople,
            allPrice: _this.data.allPrice
          })
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    })

  },

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
    var _this = this;
    if(!_this.data.showStartDate){
      wx.showToast({
        title: '请输入开始时间！',
        duration: 2000,
        icon: "none"
      })
    } else if(!_this.data.showEndDate) {
      wx.showToast({
        title: '请输入结束时间！',
        duration: 2000,
        icon: "none"
      })
    }else{
      _this.data.startGsTime = _this.data.showStartDate;
      _this.data.endGsTime = _this.data.showEndDate;
      var data = {
        jielongId: _this.data.jieLongId,
        startTime: _this.data.showStartDate,
        endTime: _this.data.showEndDate
      }
      _this.initData(data);
    }

  },
  //查看具体的某个商品
  navToGoods:function(e){
    var item = e.currentTarget.dataset.item;
    item.startTime = this.data.startGsTime;
    item.endTime = this.data.endGsTime;
    wx.navigateTo({
      url: './Goodsstatistics/Goodsstatistics?item='+ JSON.stringify(e.currentTarget.dataset.item),
    })
  }


})
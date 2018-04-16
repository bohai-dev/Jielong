// pages/detail/addrRemake/addrRemake.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    isShow:false,
    jieLongId:"",
    pickNum:false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化页面数据
    this.initData(options.jieLongId);

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

  //公共事件
  //多选框按钮
  initData: function (jieLongId){
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/order/selectPickOrder',
      method: "GET",
      data: {
        jielongId: jieLongId
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          _this.setData({
            items: res.data.data,
            jieLongId: jieLongId,
            pickNum: res.data.data.length
          })
        }

      }
    })
  },

  checkboxChange:function(e){
    var _this = this;
    // console.log(e.detail.value)
    // console.log(e.detail.value.length)
    // console.log(_this.data.items.length)
    if (e.detail.value.length == _this.data.items.length) {
      _this.setData({
        isShow: true
      })
    } else {
      _this.setData({
        isShow: false
      })
    }
    _this.data.items.forEach(function (res) {
      if (res.checked) {
        delete res.checked;
      }
    })
    if (e.detail.value.length){
      e.detail.value.forEach(function(res,index){
        _this.data.items =  _this.data.items.map(function (resItem) {
          if (resItem.id == res) {
            resItem.checked = "true";
          }
          return resItem;
        })
      })
      // console.log(_this.data.items)
    }
  },
  //全选
  checkAll:function(e){
    var _this = this;
    _this.data.isShow = !_this.data.isShow;
    if (_this.data.isShow) {
      _this.data.items.forEach(function (e) {
        if (!e.checked) {
          e.checked = "true"
        }
      })
      console.log(_this.data.items)
      _this.setData({
        items: _this.data.items,
        isShow: !e.currentTarget.dataset.show
      })
    } else {
      _this.data.items.forEach(function (e) {
        if (e.checked) {
          delete e.checked
        }
      })
      console.log(_this.data.items)
      _this.setData({
        items: _this.data.items,
        isShow: !e.currentTarget.dataset.show
      })
    }
  },

  //确认提货
  saveRemake:function(e){
    console.log(this)
    var _this = this;
    var jsonStr = [];
    _this.data.items.forEach(function (item) {
      if (item.checked) {
        jsonStr.push(item.orderNum);
      }
    })
    if(jsonStr.length){
    JSON.stringify(jsonStr);
    console.log(jsonStr)
    wx.request({
      url: app.globalData.domain + '/order/signPick',
      method:"POST",
      data:jsonStr,
      success:function(res){
        console.log(res)
        if(res.statusCode == 200){
          wx.showToast({
            title: '确认提货成功!',
            duration: 4000
          })
          _this.initData(_this.data.jieLongId);
        }else{
          wx.showToast({
            title: res.data.errorMessage || '确认提货失败!',
            duration: 4000,
            icon:"none"
          })
        }

      }
    })
    }else{
      wx.showToast({
        title: '请选择订单！',
        duration: 4000,
        icon: "none"
      })

    }
  }



})
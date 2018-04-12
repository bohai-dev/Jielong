// pages/detail/addrRemake/addrRemake.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }, {
        id: 4,
      }, {
        id: 5,
      },],
    isShow:false
  
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

  //公共事件
  //多选框按钮
  checkboxChange:function(e){
    var _this = this;
    console.log(e.detail.value)
    console.log(e.detail.value.length)
    console.log(_this.data.items.length)
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
        var indexNum = Number(res) - 1;
        if (_this.data.items[indexNum].id == res){
          _this.data.items[indexNum].checked = "true";
        }
      })
    }
  },
  //全选
  checkAll:function(e){
    console.log(e.currentTarget.dataset.show)
    var _this = this;
    _this.data.isShow = !_this.data.isShow;
    console.log(_this.data.isShow)
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


  //展开用户信息
  navToGoods:function(e){
    console.log(this)
  },

  //确认提货
  saveRemake:function(e){
    console.log(this)

  }



})
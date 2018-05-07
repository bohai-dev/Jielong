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
    pickNum:false,
    abcSort: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "N", "M", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  
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
    _this.data.jieLongId = jieLongId;
    wx.request({
      url: app.globalData.domain + '/order/selectPickOrder',
      method: "GET",
      data: {
        jielongId: jieLongId
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          //初始化自提
          // _this.formatData(res.data.data);
          _this.initAddr(_this.formatData(res.data.data),jieLongId);
        }
      }
    })
  },

  //格式化数据
  formatData:function(data){
    var arr = [];
    if(data.length){
      data.forEach(function(item,index){
        item[1][0].addrAndTime = item[0];
        item[1][0].addrAndTimeIndex = index;
        arr = arr.concat(item[1]);
      })
    }
    console.log(arr)
    return arr;
  },

  //初始化自提
  initAddr: function (data, jieLongId){
      console.log(data);
      var _this = this;
      var checkLength = 0;
      if(data.length){
        data.forEach(function(item,index,datas){
          if(item.state == 3){
            item.checked = true;
            checkLength++;
          }
        })
        if (checkLength == data.length){
          _this.data.isShow = true;
        }
      }
      _this.setData({
        items: data,
        jieLongId: jieLongId,
        pickNum: data.length,
        isShow: _this.data.isShow
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
          if (resItem.orderNum == res) {
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
    var _this = this;
    var jsonStr = [];
    _this.data.items.forEach(function (item) {
      var obj = {};
      if (item.checked) {
        obj.orderNum = item.orderNum;
        obj.state = 3;
      }else{
        obj.orderNum = item.orderNum;
        obj.state = 2;
      }
      jsonStr.push(obj);
    })
    if(jsonStr.length){
    console.log(jsonStr)
    var orderNumList = jsonStr
    wx.request({
      url: app.globalData.domain + '/order/signPick',
      method:"POST",
      data:{
        orderNumList
      },
      success:function(res){
        if(res.statusCode == 200){
          wx.showToast({
            title: '操作成功!',
            duration: 2000
          })
          // _this.initData(_this.data.jieLongId);
        }else{
          wx.showToast({
            title: res.data.errorMessage || '操作失败!',
            duration: 2000,
            icon:"none"
          })
        }

      }
    })
    }else{
      wx.showToast({
        title: '请选择订单！',
        duration: 2000,
        icon: "none"
      })

    }
  },
  // 导出订单
  downloadOrder:function(){
    var _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask:true
    })
    console.log(_this.data.jieLongId);
    wx.request({
      url: app.globalData.domain + '/downloadOrder?jielongId=' + _this.data.jieLongId,
      success:function(res){
        console.log(res)
        var domainUploadData = res.data;
        console.log(app.globalData.domainUpload + "/" + domainUploadData)
        wx.downloadFile({
          url: app.globalData.domainUpload + "/" + domainUploadData,
          success: function (res) {
            console.log(res)
            var filePath = res.tempFilePath
            // wx.saveFile({
            //   tempFilePath: filePath,
            //   success: function (res) {
            //     console.log(res)
            // var savedFilePath = res.savedFilePath
                wx.openDocument({
                  filePath: filePath,
                  success: function (res) {
                    console.log('打开文档成功');
                  },
                  complete: function (res) {
                    console.log(res)
                    wx.hideLoading();
                  }
                })
            //   }
            // })
          },
          complete: function (res) {
            console.log(res)
            setTimeout(function () {
              wx.hideLoading();
            }, 10000)
          }
        })
      },
      complete:function(res){
        console.log(res)
        setTimeout(function(){
          wx.hideLoading();
        },10000)
      }
    })
  }



})
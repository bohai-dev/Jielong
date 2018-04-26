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
      wx.setNavigationBarTitle({
        title: '编辑取货点及时间',
      })
      console.log(options)
      this.formatData(options);
      this.setData({
        addrDetail:options.detail,
        addrName:options.name,
        id:options.id,
        claimTime:options.claimTime
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
      this.initTime();
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
  //初始化时间
  initTime:function(res){
    var todayTime = new Date();
    todayTime = todayTime.getFullYear() + "-" + (todayTime.getMonth() + 1) + "-" + todayTime.getDate();
    var endTime = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    endTime = endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate();
    this.setData({
      startDateOne: todayTime,
      endDateOne: endTime,
    })
  },
  formatData:function(res){
    var detailTime = res.claimTime.split("至");
    if (detailTime.length == 2) {
      this.claimTimeOne = detailTime[0];
      this.claimTimeTwo = detailTime[1];
    } else {
      this.claimTimeOne = detailTime[0];
      this.claimTimeTwo = "";
    }
    this.setData({
      claimTimeOne: this.claimTimeOne,
      claimTimeTwo: this.claimTimeTwo,
    })
  },
  pickerOne:function(res){
    console.log(this.data.claimTimeTwo)
    console.log(res.detail.value)
    if (this.data.claimTimeTwo){
      var getClaimTimeOne = new Date(res.detail.value).getTime();
      var getClaimTimeTwo = new Date(this.data.claimTimeTwo).getTime();
      if (getClaimTimeTwo <= getClaimTimeOne){
        this.data.claimTimeTwo = "";
      }
    }
    this.setData({
      claimTimeOne: res.detail.value,
      startDateTwo: res.detail.value,
      claimTimeTwo: this.data.claimTimeTwo
    })
  },
  pickerTwo: function (res) {
    this.setData({
      claimTimeTwo: res.detail.value
    })
  },
  // 保存信息
  formSubmit: function (e) {
    if (!this.data.claimTimeOne){
      wx.showModal({
        title: '请填写取货起始时间',
        showCancel: false
      })
      return;
    }else if(!this.data.claimTimeTwo){
      wx.showModal({
        title: '请填写取货截止时间',
        showCancel: false
      })
      return;      
    }
    var data = {
      id: this.data.id,
      userId: wx.getStorageSync("userId"),
      name: this.data.addrName,
      detail: e.detail.value.detail,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      claimTime: this.data.claimTimeOne + "至" + this.data.claimTimeTwo
    };
    console.log(data)
    //修改信息
    if (e.detail.value.detail && this.data.id && data.claimTime){
      data.detail = data.detail + "***" + data.claimTime;
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
    else if(e.detail.value.detail && data.claimTime){
    data.detail = data.detail+"***"+data.claimTime;
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
      if(!data.detail){
        wx.showModal({
          title: '请填写详细的取货地址',
          showCancel: false
        })
      }else if(!data.claimTime){
        wx.showModal({
          title: '请填写取货时间',
          showCancel: false
        })
      }

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
    var _this = this;
    wx.showModal({
      title: '是否确认删除此取货点？',
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
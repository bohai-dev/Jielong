// pages/personal/address/addAddress/addAddress.js
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
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
    id:"",
    startYear:2018,
    endYear:3500,
    clickSureTime: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.setNavigationBarTitle({
        title: '编辑取货点及时间',
      })
      this.formatData(options);
      this.setData({
        addrDetail:options.detail,
        addrName:options.name,
        id:options.id,
        claimTime:options.claimTime
      })
    }
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var arr = [];
    var date = [0]
    arr[0] = this.getAllYMD();
    arr[1] = obj1.dateTimeArray[3];
    arr[2] = obj1.dateTimeArray[4];
    date[1] = obj1.dateTime[3];
    date[2] = obj1.dateTime[4];
    this.setData({
      dateTimeArray1: arr,
      dateTime1: date,
      dateTimeArray2: arr,
      dateTime2: date,
    });
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
  //初始化时间
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
  // 保存信息
  formSubmit: function (e) {
    var _this = this;
    _this.data.clickSureTime++
    console.log(_this.data.clickSureTime)
    if (_this.data.clickSureTime != 1) {
      return false;
    }
    console.log(e)    
    if (!e.detail.value.claimTimeOne){
      wx.showModal({
        content: '请填写取货起始时间',
      })
      _this.setData({
        clickSureTime: "0"
      })
      return;
    }else if(!e.detail.value.claimTimeTwo){
      wx.showModal({
        content: '请填写取货截止时间',
      })
      _this.setData({
        clickSureTime: "0"
      })
      return;      
    } else if (Date.parse(this.data.claimTimeOne) > Date.parse(this.data.claimTimeTwo)){
      wx.showModal({
        content: '取货截止时间不能小于取货起始时间',
      })
      _this.setData({
        clickSureTime: "0"
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
      claimTime: e.detail.value.claimTimeOne + "至" + e.detail.value.claimTimeTwo
    };
    console.log(data)
    wx.showLoading({
      title: '数据保存中...',
      mask:'true'
    })
    setTimeout(function () {
      wx.hideLoading();
      _this.setData({
        clickSureTime: "0"
      })
    }, 30000)
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
              mask:"true",
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } 
        },
        complete:function(res){
          wx.hideLoading();
          _this.setData({
            clickSureTime: "0"
          })
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
            mask: "true",
            success: function(){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
        _this.setData({
          clickSureTime: "0"
        })
      }
    })
    }else{
      wx.hideLoading();
      if(!data.detail){
        wx.showModal({
          title: '请填写详细的取货地址',
        })
      }else if(!data.claimTime){
        wx.showModal({
          title: '请填写取货时间',
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
              mask: "true",
              success:function(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            wx.showToast({
              title: res.data.errorMessage,
              mask: "true",
              icon:"none",
              duration:2500
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
  },
  changeDateTime1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    this.setData({ 
      dateTime1: e.detail.value,
      claimTimeOne: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]],
      dateTime2: e.detail.value,
       });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      claimTimeOne: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]]

    });
  },
  changeDateTime2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    this.setData({
      dateTime2: e.detail.value,
      claimTimeTwo: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]],
    });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    arr[e.detail.column] = e.detail.value;
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr,
      claimTimeTwo: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]] 
    });
  },
  getAllYMD:function(){
    var nowDate = new Date();
    var NowTimeHours = nowDate.getHours();
    var NowDayarr = [];
    var enddayarr = [];
    for (var i = 0; i < 365; i++) {
      if (i == 0 && NowTimeHours + 1 < 23) {
        NowDayarr[i] = new Date(nowDate.setDate(nowDate.getDate()));
      } else {
        NowDayarr[i] = new Date(nowDate.setDate(nowDate.getDate() + 1));
      }
      enddayarr[i] = NowDayarr[i].getFullYear() + "/" + dateTimePicker.withData(NowDayarr[i].getMonth() + 1) + "/" + dateTimePicker.withData(NowDayarr[i].getDate());
    }
    console.log(enddayarr);
    return enddayarr;
  }  
})
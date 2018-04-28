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
    endYear:3500
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
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    obj1.dateTimeArray.pop();
    obj1.dateTime.pop();
    console.log(obj1)
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTimeArray2: obj1.dateTimeArray,
      dateTime2: obj1.dateTime,
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
    console.log(e)    
    if (!e.detail.value.claimTimeOne){
      wx.showModal({
        title: '请填写取货起始时间',
        showCancel: false
      })
      return;
    }else if(!e.detail.value.claimTimeTwo){
      wx.showModal({
        title: '请填写取货截止时间',
        showCancel: false
      })
      return;      
    } else if (Date.parse(this.data.claimTimeOne) > Date.parse(this.data.claimTimeTwo)){
      wx.showModal({
        title: '取货截止时间不能小于取货起始时间',
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
      claimTime: e.detail.value.claimTimeOne + "至" + e.detail.value.claimTimeTwo
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
  },
  changeDateTime1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    this.setData({ 
      dateTime1: e.detail.value,
      claimTimeOne: dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]],
      dateTime2: e.detail.value,
       });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      claimTimeOne: dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]] 

    });
  },
  changeDateTime2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    this.setData({
      dateTime2: e.detail.value,
      claimTimeTwo: dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]],
    });
    this.setData({ dateTime2: e.detail.value });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr,
      claimTimeTwo: dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]] 
    });
  }   
})
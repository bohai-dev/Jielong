// pages/release/selectAddress/selectAddress.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalTitle: "新增取货点地址",
    judeAddEdit: "add",
    addressList: [],
    hiddenModal: false,
    addrName: "地图定位",
    addrDetail: "",
    longitude: "",
    latitude: "",
    id: "",
    claimTime:"",
    selectIdArr:[],
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2018,
    endYear: 3500,
    clickSureTime:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.jsonStr){
      console.log(options)
      this.setData({
        selectIdArr: options.jsonStr.split("-")
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
    var _this = this;
    wx.getStorage({
      key: 'seleAddrKey',
      success: function (res) {
        var addrParseJson = JSON.parse(res.data);
        _this.formatData(addrParseJson);
        _this.setData({
          addressList: addrParseJson
        })
      },
      fail: function (err) {
        wx.request({
          url: app.globalData.domain + '/userAddress/selectByUserId',
          data: {
            userId: wx.getStorageSync("userId")
          },
          success: function (res) {
            if (res.data.errorCode == 0) {
              for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].value = false;
                if (_this.data.selectIdArr.length) {
                  for (var j = 0; j < _this.data.selectIdArr.length; j++) {
                    if (res.data.data[i].id == _this.data.selectIdArr[j]){
                      res.data.data[i].value = true;
                    }
                  }
                }
              }
              _this.formatData(res.data.data);
              _this.setData({ addressList: res.data.data })
            }
            console.log(_this.data.addressList)
            var addrJson = JSON.stringify(_this.data.addressList);
            wx.setStorage({
              key: 'seleAddrKey',
              data: addrJson,
            })
          }
        })
      }
    })
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
  //选择自提点
  listenCheckboxChange: function (e) {
    var _this = this;
    var checkIndex = e.currentTarget.dataset.index;
    _this.data.addressList[checkIndex].value = !_this.data.addressList[checkIndex].value;
    var addrJson = JSON.stringify(_this.data.addressList);
    wx.setStorage({
      key: 'seleAddrKeyB',
      data: addrJson,
    })

  },
  //确认自提点
  sureAddr: function (e) {
    wx.getStorage({
      key: 'seleAddrKeyB',
      success: function (res) {
        var addrParseJson = JSON.parse(res.data);
        wx.setStorage({
          key: 'seleAddrKey',
          data: res.data,
          success: function (res) {
            wx.navigateBack({
              delta: "1"
            })
          }
        })
      }
    })

  },
  //新增自提点
  addAddr: function (e) {
    this.setData({
      modalTitle: "新增取货点地址",
      judeAddEdit: "add",
      addrName: "地图定位",
      addrDetail: "",
      longitude: "",
      latitude: "",
      id: "",
      hiddenModal: true,
      claimTime:"",
      claimTimeTwo:"",
      claimTimeOne:"",
      clickSureTime: "0"
    })
  },
  //修改自提点
  editAddr: function (e) {
    var _this = this;
    var addrParseJson = "";
    console.log(e);
    var _this = this;
    wx.getStorage({
      key: 'seleAddrKey',
      success: function (res) {
        addrParseJson = JSON.parse(res.data);
        var addrPJson = addrParseJson[e.currentTarget.dataset.index];
        _this.formatTime(addrPJson);
        _this.setData({
          modalTitle: "编辑取货点地址",
          judeAddEdit: "edit",
          id: addrPJson.id,
          addrName: addrPJson.name,
          addrDetail: addrPJson.detail,
          longitude: addrPJson.longitude,
          latitude: addrPJson.latitude,
          claimTime:addrPJson.claimTime,
          claimTimeOne: _this.data.claimTimeOne,
          claimTimeTwo: _this.data.claimTimeTwo,
          hiddenModal: true,
          clickSureTime: "0"
        })
      }
    });

  },
  //保存自提点
  listenerConfirm: function (e) {
    var _this = this;
    var self = e;
    _this.data.clickSureTime++
    console.log(_this.data.clickSureTime)
    if (_this.data.clickSureTime != 1){
      return false;
    }
    console.log(this)
    if (!this.data.claimTimeOne) {
      wx.showModal({
        content: '请填写取货起始时间',
        showCancel: false,
      })
      _this.setData({
        clickSureTime: "0"
      })
      return;
    } else if (!this.data.claimTimeTwo) {
      wx.showModal({
        content: '请填写取货截止时间',
        showCancel: false,
      })
        _this.setData({
          clickSureTime: "0"
        })
      return;
    } else if (Date.parse(this.data.claimTimeOne) > Date.parse(this.data.claimTimeTwo)) {
      wx.showModal({
        content: '取货截止时间不能小于取货起始时间',
        showCancel: false,
      })
        _this.setData({
          clickSureTime: "0"
        })
      return;
    }
    setTimeout(function () {
      var data = {
        id: _this.data.id,
        userId: wx.getStorageSync("userId"),
        name: _this.data.addrName,
        detail: _this.data.addrDetail,
        longitude: _this.data.longitude,
        latitude: _this.data.latitude,
        claimTime: _this.data.claimTimeOne + "至" + _this.data.claimTimeTwo
      };
      if(!data.detail){
        wx.showModal({
          title: '请输入取货详细地址',
          showCancel: false,
        })
          _this.setData({
            clickSureTime: "0"
          })
        return;
      }
        wx.showLoading({
          title: '数据保存中...',
          mask: 'true'
        })
        setTimeout(function(){
          wx.hideLoading();
          _this.setData({
            clickSureTime: "0"
          })
        },30000)
      if (_this.data.judeAddEdit == "add") {
        if (_this.data.addrDetail) {
          data.detail = data.detail +"***"+data.claimTime;
          wx.request({
            url: app.globalData.domain + '/userAddress/insert',
            method: 'POST',
            header: {
              "content-type": "application/json"
            },
            data: data,
            success: function (res) {
              _this.data.addrDetail = "";
              var data = res.data;
              if (data.errorCode == 0) {
                wx.showToast({
                  title: '保存成功',
                  mask: "true",
                  success: function () {
                _this.setData({
                  hiddenModal: false,
                })
                _this.toShow();
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
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '请输入取货详细地址',
            showCancel: false
          })
          _this.setData({
            clickSureTime: "0"
          })
        }
      } else {
        data.detail = data.detail + "***" + data.claimTime;
        wx.request({
          url: app.globalData.domain + '/userAddress/updateById',
          method: "POST",
          header: {
            "content-type": "application/json"
          },
          data: data,
          success: function (res) {
            var data = res.data;
            if (data.errorCode == 0) {
              _this.setData({
                hiddenModal: false,
              })
              _this.toShow();
              wx.showToast({
                title: '修改成功',
                mask: "true",
                success: function () {
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
      }
    }, 100)
  },
  //退出模态框
  listenerCancel: function (e) {
    this.setData({
      hiddenModal: false
    })
  },
  //获取详细地址
  getTextarea: function (e) {
    if (e.detail.value) {
      this.setData({
        addrDetail: e.detail.value
      })
    }
  },
  // 打开地图
  findAddress: function (e) {
    var self = this;
    wx.chooseLocation({
      type: "wgs84",
      success: function (res) {
        console.log(res);
        self.setData({
          addrName: res.name,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  //显示地址
  toShow: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/userAddress/selectByUserId',
      data: {
        userId: wx.getStorageSync("userId")
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          _this.formatData(res.data.data);       
          _this.setData({ addressList: res.data.data })
        }
        for (var i = 0; i < _this.data.addressList.length; i++) {
          _this.data.addressList[i].value = false;
        }
        var addrJson = JSON.stringify(_this.data.addressList);
        wx.setStorage({
          key: 'seleAddrKey',
          data: addrJson,
        })
      }
    })
  },
  //格式化数据
  formatData:function(res){
    console.log(res)
    res.map(function (item, index) {
      var detailTime = item.detail.split("***");
      if (detailTime.length == 2) {
        item.detail = detailTime[0];
        item.claimTime = detailTime[1];
      } else {
        item.detail = detailTime[0];
        item.claimTime = "";
      }
      return item;
    })
    return res;
  },
  formatTime: function (res) {
    var detailTime = res.claimTime.split("至");
    if (detailTime.length == 2) {
      this.claimTimeOne = detailTime[0];
      this.claimTimeTwo = detailTime[1];
    } else {
      this.claimTimeOne = "";
      this.claimTimeTwo = "";
    }
    this.setData({
      claimTimeOne: this.claimTimeOne,
      claimTimeTwo: this.claimTimeTwo,
    })
  },
  //初始化时间
  changeDateTime1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    this.setData({
      dateTime1: e.detail.value,
      claimTimeOne: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]] ,
      dateTime2: e.detail.value
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
      claimTimeTwo: dateArr[0][arr[0]] + " " + dateArr[1][arr[1]] + ":" + dateArr[2][arr[2]] 
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
  getAllYMD: function () {
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
    return enddayarr;
  } 
})
// pages/release/selectAddress/selectAddress.js
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
    selectIdArr:[]
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
      claimTime:""
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
          hiddenModal: true
        })
      }
    });

  },
  //保存自提点
  listenerConfirm: function (e) {
    var _this = this;
    var self = e;
    if (!this.data.claimTimeOne) {
      wx.showModal({
        title: '请填写取货起始时间',
        showCancel: false
      })
      return;
    } else if (!this.data.claimTimeTwo) {
      wx.showModal({
        title: '请填写取货截止时间',
        showCancel: false
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
          showCancel: false
        })
        return;
      }else if(!data.claimTime){
        wx.showModal({
          title: '请输入取货时间',
          showCancel: false
        })
        return;
      }
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
              var data = res.data
              if (data.errorCode == 0) {
                wx.showToast({
                  title: '保存成功',
                  success: function () {
                    _this.setData({
                      hiddenModal: false
                    })
                    _this.toShow();
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '请输入取货详细地址',
            showCancel: false
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
            var data = res.data
            if (data.errorCode == 0) {
              wx.showToast({
                title: '修改成功',
                success: function () {
                  _this.setData({
                    hiddenModal: false
                  })
                  _this.toShow();
                }
              })
            }
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
  initTime: function (res) {
    var todayTime = new Date();
    todayTime = todayTime.getFullYear() + "-" + (todayTime.getMonth() + 1) + "-" + todayTime.getDate();
    var endTime = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    endTime = endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate();
    this.setData({
      startDateOne: todayTime,
      endDateOne: endTime,
    })
  },
  pickerOne: function (res) {
    if (this.data.claimTimeTwo) {
      var getClaimTimeOne = new Date(res.detail.value).getTime();
      var getClaimTimeTwo = new Date(this.data.claimTimeTwo).getTime();
      if (getClaimTimeTwo <= getClaimTimeOne) {
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

})
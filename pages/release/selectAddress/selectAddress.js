// pages/release/selectAddress/selectAddress.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalTitle: "新增自提点地址",
    judeAddEdit: "add",
    addressList: [],
    hiddenModal: false,
    addrName: "地图定位",
    addrDetail: "",
    longitude: "",
    latitude: "",
    id: "",
    selectIdArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.jsonStr){
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
    var _this = this;
    wx.getStorage({
      key: 'seleAddrKey',
      success: function (res) {
        console.log(res)
        var addrParseJson = JSON.parse(res.data);
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
            console.log(_this.data.selectIdArr);
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
    console.log(_this)
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
      modalTitle: "新增自提点地址",
      judeAddEdit: "add",
      addrName: "地图定位",
      addrDetail: "",
      longitude: "",
      latitude: "",
      id: "",
      hiddenModal: true
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
        _this.setData({
          modalTitle: "编辑自提点地址",
          judeAddEdit: "edit",
          id: addrPJson.id,
          addrName: addrPJson.name,
          addrDetail: addrPJson.detail,
          longitude: addrPJson.longitude,
          latitude: addrPJson.latitude,
          hiddenModal: true
        })
      }
    });

  },
  //保存自提点
  listenerConfirm: function (e) {
    var _this = this;
    var self = e;
    setTimeout(function () {
      var data = {
        id: _this.data.id,
        userId: wx.getStorageSync("userId"),
        name: _this.data.addrName,
        detail: _this.data.addrDetail,
        longitude: _this.data.longitude,
        latitude: _this.data.latitude
      };
      console.log(_this)
      console.log(e)
      if (_this.data.judeAddEdit == "add") {
        if (_this.data.addrDetail) {
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
            title: '请输入自提详细地址',
            showCancel: false
          })
        }
      } else {
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
  }
})
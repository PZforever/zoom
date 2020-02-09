const util = require('../../../utils/request.js');
var app = getApp();
// pages/shelter/shelterDetail/shelterDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 服务信息id
    codeId: '',
    sanctuaryId:'',
    url:'',
    markers: [{
      iconPath: "../../../../img/mapAdd.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 50,
      height: 50
    }],
    longitude: '',
    latitude: '',
    shelterName: '',
    // 心理咨询信息
    message: '',
    list: [],
    address: '',
    // 定义时间times
    times: {
      day: '',
      hour: '',
      minute: '',
      second: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    _this.setData({
      codeId: options.id,
    });
    wx.getStorage({
      key: 'address',
      success: function (res) {
        // console.log(res.data)
        // 设置信息
        _this.setData({
          address: {
            name: res.data.name,
            address: res.data.address,
            leader: res.data.leader,
            phoneNumber: res.data.phoneNumber
          },
          markers: [{
            iconPath: "../../../../img/mapAdd.png",
            id: 0,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            width: 20,
            height: 30
          }],
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          sanctuaryId: res.data.id,
        })
      }
    })
  }, 
  confirmShelter:function(){
    var _this=this;
    app.globalData.shelter_name = _this.data.address.name
    app.globalData.shelter_phone = _this.data.address.phoneNumber
    app.globalData.listStatus[6].checked = true;
    app.globalData.sanctuaryApplication.sanctuary.id = _this.data.sanctuaryId
    app.globalData.listStatus[6].checked = true
    if (getApp().globalData.servicesArray.length == 0 || (getApp().globalData.servicesArray.length == 1 && getApp().globalData.servicesArray[0].service_name == '庇护所')) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 2
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
 
})
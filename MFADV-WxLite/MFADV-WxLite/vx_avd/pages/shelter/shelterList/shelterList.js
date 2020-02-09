// pages/shelter/shelterList/shelterList.js
const util = require('../../../utils/request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:'杭州',
    cityCode:'',
    sanctuariesList: [],
    pageNum:1,
    isMore: 0,
    isSend: 0,
    keyword: '',
    // 自定义弹框 
    animationData: {},

  }, 
  //打开庇护所详情页面
  selectShelter: function (e) {
    // console.log(e.currentTarget.dataset.address)
    wx.setStorage({
      key:"address",
      data:e.currentTarget.dataset.address
    })
    var code = e.currentTarget.dataset.shelterid
    app.globalData.sanctuaryApplication.sanctuary.id = e.currentTarget.dataset.shelterid
    //已选择的庇护所名称
    app.globalData.shelter_selected = e.currentTarget.dataset.address.name
    this.setData({
      shelter_selected_name: app.globalData.shelter_selected
    })
    wx.navigateTo({
      url: '/pages/shelter/shelterDetail/shelterDetail?id=1&&code=' + code,
    })
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    _this.getMessage();
  },
  getMessage: function () {
    wx.showLoading();
    
    var _this = this;
    util.POST('mobile/violentCase/sanctuary/list', app.globalData.loginInfo.token, {
      'keyword': _this.data.keyword,
      "pageNum": _this.data.pageNum++,
      "pageSize": '6' 
    }, function (res) {
      wx.hideLoading();
      // 判断交互是否正常
      console.log(res.data); 
      if (res.data.code == 200) {
        // res.data.result.sanctuaries.forEach(function(val){
        //   _this.data.sanctuariesList.push(val)
        // })
        _this.setData({
          sanctuariesList: _this.data.sanctuariesList.concat(res.data.result.sanctuaries),
          isMore: res.data.result.isMore ? 1 : 0,
          isSend: !_this.data.isSend
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },

  getMessage2: function () {
    wx.showLoading();
    var _this = this;
    util.POST('mobile/violentCase/sanctuary/list', app.globalData.loginInfo.token, {
      'keyword': _this.data.keyword,
      "pageNum": 1,
      "pageSize": '6'
    }, function (res) {
      wx.hideLoading();
      // 判断交互是否正常
      console.log(res.data);
      if (res.data.code == 200) {
        _this.setData({
          sanctuariesList:res.data.result.sanctuaries,
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },

  lower: function () {
    var _this=this;
    //滚动到底部的函数
    if (_this.data.isMore && _this.data.isSend) {
      _this.getMessage();
      _this.setData({
        isSend: !_this.data.isSend,
      })
    }
  },
  /**
   * 关键字搜索
   */
  searchIpt:function(e){ 
    var _this=this;
    this.setData({
      keyword: e.detail.value
    })
  },
  searchShelter:function(e){
    var _this = this;
    _this.getMessage2();
  },

  /**
   * 选择城市
   */
  // 关闭弹框
  _cancelEvent: function () {
    this.area.hideDialog();
  },
  // 确认地址
  _confirmEvent: function () {
    var _this = this;
    var address = _this.area.data.address;
    _this.setData({
      cityName: address.city.name,
      cityCode: address.city.code,
    })
    _this.area.hideDialog();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.area = this.selectComponent("#area");
  },
  openAddress: function () {
    this.area.showDialog();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shelter_selected_name: app.globalData.shelter_selected
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
  
})
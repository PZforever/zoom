const app = getApp();
const xhr = require('../../../utils/xhr.js');
const util = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      messageList:[],
      pageNum:1,
      pageSize: 10,
      isMore:true,
      clientHeight:''

  },

  //获取消息
  getMessage:function(){
    const _self = this;
    if (app.globalData.loginInfo == null) {
      return false
    }
    var data = JSON.stringify({ 
      pageNum: _self.data.pageNum++,
      pageSize: _self.data.pageSize 
      });
    var contentType = 'application/json';
    var method = 'POST';
    wx.showLoading();
    var API_MESSAGE = '/mobile/message/queryMessageByUserDetailId';
    var promise = new Promise((resolve, reject) => {
      xhr.wxRequest(API_MESSAGE, { data, contentType, method }, resolve, reject)
    })

    promise.then(res => {
      wx.hideLoading();
      if (res.data.code == "200") {
        _self.data.messageList = _self.data.messageList.concat(res.data.result.orangeDiaryGroups);
        _self.setData({
          messageList: _self.data.messageList,
          isMore: res.data.result.isMore
        })
       
     }else{
        util.remind(res.data.message);
     }
      
    }).catch(err => {
      console.log(err)
    })

  },
  //滚动加载
  scrollLoading:function(){
    const _self = this;
    //滚动到底部的函数
    if (_self.data.isMore){
      _self.getMessage();
      _self.setData({
        isMore: _self.data.isMore 
      })
    }
  },
  //获取系统信息
  getSystemInformation:function(){
    const _self = this;
    wx.getSystemInfo({
      success: function (res) {
        _self.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  readFn:function(e){
    const _self = this;
    var indexs = e.currentTarget.dataset.index
    if (_self.data.messageList[indexs].isRead == 0){
      _self.data.messageList[indexs].isRead = 1;
      _self.setData({
        messageList: _self.data.messageList
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage();
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
    this.getSystemInformation();
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
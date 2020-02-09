const app = getApp();
const xhr = require('../../../../utils/xhr.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageDetail:{},
    id:"",

  },
  getMessageDetail:function(){
    const _self = this;
    var data = JSON.stringify({
      id: _self.data.id
    });
    var contentType = 'application/json';
    var method = 'POST';
    wx.showLoading();
    var API_DETAIL = '/mobile/message/queryMessageById';
    var promise = new Promise((resolve, reject) => {
      xhr.wxRequest(API_DETAIL, { data, contentType, method }, resolve, reject)
    })

    promise.then(res => {
      if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return false;
      }

      if (res.data.code == "200") {
        _self.data.messageDetail = res.data.result.messageLog;
        _self.setData({
          messageDetail: _self.data.messageDetail
        })
        
      }else{
        util.remind(res.data.message);
      }
      wx.hideLoading();

    }).catch(err => {
      console.log(err)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _self = this;
    _self.data.id = options.id;
    _self.setData({
      id: options.id
    });
    
    _self.getMessageDetail();
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
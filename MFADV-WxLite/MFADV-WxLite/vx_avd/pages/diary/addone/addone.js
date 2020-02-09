// pages/diary/addOne/addone.js
const util = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
  
  intext: function (e) {
    this.setData({
      name: e.detail.value
    });
    // console.log(this.data.name)
  },
  // 确认按钮
  saveDiary:function(){
    var _that = this;
    if (_that.data.name == ""){
      util.remind("橙色日记组名不能为空！"); 
    }else{
      util.POST('mobile/orangeDiary/diaryGroup/save', getApp().globalData.loginInfo.token, {
        name: _that.data.name
      }, function (res) {
        //返回数据
        wx.navigateBack({
          delta: 1
        })
      })
    }
    
  }
})
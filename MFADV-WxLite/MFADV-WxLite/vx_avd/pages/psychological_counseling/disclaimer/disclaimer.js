// pages/login/disclaimer/disclaimer.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fill_info_type == '心理咨询'){
      this.setData({
        fill_info_type: options.fill_info_type,
        url: '/pages/fill_info/apply?fill_info_type=' + options.fill_info_type
      })
    } else {
      this.setData({
        fill_info_type: options.fill_info_type,
        url: '/pages/psychological_counseling/appointment/appointment?fill_info_type=' + options.fill_info_type
      })
    }
    
    if (getApp().globalData.diaryArray != "" ) {
      if (options.fill_info_type == '心理咨询') {
        this.setData({
          fill_info_type: options.fill_info_type,
          url: '/pages/fill_info/list/self/list?fill_info_type=' + options.fill_info_type
        })
      } else {
        this.setData({
          fill_info_type: options.fill_info_type,
          url: '/pages/psychological_counseling/appointment/appointment?fill_info_type=' + options.fill_info_type
        })
      }
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
 
  checkboxChange: function(e) {
    this.setData({ 
      checked:!this.data.checked 
    })
  },
  /**
   * 用户协议提交
   */
  submit:function (e) {
    
    // 判断是否同意协议
    if (this.data.checked) {
      app.globalData.agreeBol1=true;
      wx.redirectTo({
        url: this.data.url
      });
    }
  }
})
// pages/login/disclaimer/disclaimer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        checked:false,
        types:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.types = options.type;
    this.setData({
      types: options.type
    })
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
    var _self = this;
    // 判断是否同意协议
    if (this.data.checked) {
      wx.navigateTo({
        url: '/pages/login/signon/signon?type='+ _self.data.types
      });
    }
  }
})
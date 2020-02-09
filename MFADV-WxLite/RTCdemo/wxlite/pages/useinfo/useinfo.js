// pages/useinfo/useinfo.js
const util = require('../../common/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inPhone: "",
    actualName: "",
    idCard: "",

  },

  enterRoom: function () {
    wx.navigateTo({
      url: util.createURL("../main/main", { userName: this.data.actualName}),
    });
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      inPhone: options.inPhone || '',
      actualName: options.actualName || '',
      idCard: options.idCard || ''
    });
    //debugger;
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
  onShareAppMessage: function () {
  
  }
})
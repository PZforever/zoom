// pages/shelter/registrarIfn/registrarIfn.js
const util = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ['男', '女'],
    index: 0,
    name:'',
    phone:'',
    id_num:'',
    relationship:''
  },
/**
  *  选择性别
  */
  genderPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  nextBtn:function(){
    if (this.data.phone==''||this.data.name==''||this.data.id_num==''||this.data.relationship=='') {
      util.remind("信息填写不完整");
      return false;
    }
    wx.navigateTo({
      url: '/pages/shelter/applicantIfn/applicantIfn'
    })
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
  
})
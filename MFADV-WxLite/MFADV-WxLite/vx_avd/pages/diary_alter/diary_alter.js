const util = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupsName:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options.groupsName);
      this.setData({
        groupsName: options.groupsName,
        id: options.groupid
      })
      // console.log(this.data.id);
      // console.log(this.data.groupsName)
  },
  intext: function (e) {
    this.setData({
      groupsName: e.detail.value
    });
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
 
  // 确认按钮
  click: function () {
    var that = this;
    util.POST('mobile/orangeDiary/diaryGroup/update', getApp().globalData.loginInfo.token, {
      name: this.data.groupsName,
      id: this.data.id
    }, function (res) {
      //返回数据
    }
    )

  }
})
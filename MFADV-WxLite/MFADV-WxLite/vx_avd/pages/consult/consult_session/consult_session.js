// pages/online_counselling/intelligent_counselling/intelligent_counselling.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // closeBtn:function(){
  //   wx.navigateTo({
  //     url: 'pages/consult/disputes_list/disputes_list'
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*智能咨询URL */
    //自动咨询地址：/jsp/onlineService/mobileconsulte/online.html
    //var url = getApp().globalData.rootURL + 'session/toMobileSession';
    var url = getApp().globalData.rootURL + 'jsp/onlineService/mobileconsulte/online.jsp';
    if (options.disputesId && options.counselorId) {
      /* 人工咨询需要传disputesId和counselorId */
      url = getApp().globalData.rootURL + 'jsp/onlineService/mobileconsulte/onlineman.jsp' + '?disputesId=' + options.disputesId + '&counselorId=' + options.counselorId
    }
    console.log(url);
    this.setData({
      url: url
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
  
})
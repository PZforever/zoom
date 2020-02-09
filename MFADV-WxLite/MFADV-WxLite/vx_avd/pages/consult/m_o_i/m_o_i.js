// pages/online_counselling/m_o_i/m_o_i.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '智能咨询', value: 'intelligent', checked: 'true'},
      { name: '人工咨询', value: 'manual' }
    ],
    selectedItem: "intelligent"
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

  /**
   * 单选框变更
   */
  radioChange: function (e) {
    var items = this.data.items;
    var selectedItem = e.detail.value;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value;
    }

    this.setData({
      items: items,
      selectedItem: selectedItem
    });

  },

  /**
   * 页面提交
   */
  formSubmit: function (e) {
    var selectedItem = this.data.selectedItem;
    /*人工咨询首先数据事件详情 */
    var url = "/pages/consult/disputes/disputes";
    if (selectedItem == 'intelligent') {
      /*智能咨询直接调用咨询会话页面，不传任何参数，也不进行任何记录 */
      url = "/pages/consult/consult_session/consult_session"
    }
    
    wx.redirectTo({
      url: url,
    });
  }


})
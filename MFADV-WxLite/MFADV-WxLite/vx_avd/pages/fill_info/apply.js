// pages/fill_info/apply.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '申请人（本人）', value: 'self', checked: true },
      { name: '申请人（其他）', value: 'others'}
    ],
    url: '/pages/fill_info/list/self/list',
    fill_info_type : '',
  },

  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    if (e.detail.value == 'self') {
      app.globalData.apply_info.applyType = "ONESELF"
      app.globalData.applicantInfo.actualName = app.globalData.loginInfo.actualName
      app.globalData.applicantInfo.phone = app.globalData.loginInfo.phone
      app.globalData.applicantInfo.idCard = app.globalData.loginInfo.idCard
      app.globalData.applicantInfo.sex = app.globalData.loginInfo.sex
    }

    if (e.detail.value == 'others') {
      getApp().globalData.apply_info.applyType = "OTHER"
      app.globalData.registerInfo.actualName = app.globalData.loginInfo.actualName
      app.globalData.registerInfo.phone = app.globalData.loginInfo.phone
      app.globalData.registerInfo.idCard = app.globalData.loginInfo.idCard
      app.globalData.registerInfo.sex = app.globalData.loginInfo.sex
      app.globalData.applicantInfo.actualName = ''
      app.globalData.applicantInfo.phone = ''
      app.globalData.applicantInfo.idCard = ''
      app.globalData.applicantInfo.sex = ''
    }

    this.setData({
      radioItems: radioItems, 
      url: '/pages/fill_info/list/' + e.detail.value + '/list?fill_info_type=' + this.data.fill_info_type,
    });
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.fill_info_type)
    app.globalData.applicantInfo.actualName = app.globalData.loginInfo.actualName
    app.globalData.applicantInfo.phone = app.globalData.loginInfo.phone
    app.globalData.applicantInfo.idCard = app.globalData.loginInfo.idCard
    app.globalData.applicantInfo.sex = app.globalData.loginInfo.sex
    app.globalData.registerInfo.actualName = ''
    app.globalData.registerInfo.phone = ''
    app.globalData.registerInfo.idCard = ''
    app.globalData.apply_info.applyType = 'ONESELF'
    this.setData({
      fill_info_type: options.fill_info_type,
      url: '/pages/fill_info/list/self/list?fill_info_type=' + options.fill_info_type
    })

    if (this.data.fill_info_type == '心理咨询' ||this.data.fill_info_type == '庇护所' || this.data.fill_info_type == '心理咨询,庇护所' || this.data.fill_info_type == '庇护所,心理咨询') {
      app.globalData.order = false
    }else{
      app.globalData.order = true
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
  
})
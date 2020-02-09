// pages/psychological_counseling/appointment/appointment.js
const util = require('../../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orgs: [],
    org_ids: [],
    number: ['1人','2人','3人'],
    url: '/pages/psychological_counseling/counselor_list/counselor_list',
    // radioItems: [
    //   { name: '线上视频会谈', value: '0'},
    //   { name: '线下见面会谈', value: '1', checked: true},
    // ],
    orgs_index: 0,
    number_index: 0
  },

  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    getApp().globalData.psychologicalCounseling.reservationType = e.detail.value
    getApp().globalData.radioItems = radioItems
    this.setData({
      radioItems: radioItems,
    });
  },

  organizationAddressPickerSelected: function (e) {
    getApp().globalData.psychologicalCounseling.reservationOrg.id = this.data.org_ids[e.detail.value]
    getApp().globalData.orgs_index = e.detail.value
    this.setData({
      orgs_index: e.detail.value,
      url: '/pages/psychological_counseling/counselor_list/counselor_list?org_id=' + getApp().globalData.psychologicalCounseling.reservationOrg.id
    })
    console.log(getApp().globalData.psychologicalCounseling.reservationOrg.id)
  },

  numberPickerSelected: function (e) {
    this.setData({
      number_index: e.detail.value
    });
    getApp().globalData.number_index = e.detail.value
    getApp().globalData.psychologicalCounseling.number = ++e.detail.value
  },

  success: function (res) {
    var that = this
    var orgsArray = []
    var orgsIdArray = []
    var ary = res.data.result.orgs
    for (var j = 0; j < ary.length; j++) {
      orgsArray.push(ary[j].organizationName)
      orgsIdArray.push(ary[j].id)
    }
    if (orgsIdArray == []){
      orgsIdArray = [8001010000000002]
    }

    if (orgsArray == []) {
      orgsArray = ["杭州合欢心理咨询服务中心"]
    }

    if (getApp().globalData.psychologicalCounseling.reservationOrg.id == ''){
      getApp().globalData.psychologicalCounseling.reservationOrg.id = orgsIdArray[0]
    }
   
    that.setData({
      orgs: orgsArray,
      org_ids: orgsIdArray,
      url: '/pages/psychological_counseling/counselor_list/counselor_list?org_id=' + getApp().globalData.psychologicalCounseling.reservationOrg.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: '/pages/psychological_counseling/counselor_list/counselor_list?org_id=' + getApp().globalData.psychologicalCounseling.reservationOrg.id,
      psychologist: getApp().globalData.psychologist_name,
      radioItems: getApp().globalData.radioItems,
      orgs_index: getApp().globalData.orgs_index,
      number_index: getApp().globalData.number_index
    })
    console.log(this.data.url)
    var token = getApp().globalData.loginInfo.token
    var data = {
      keyword: "",
      pageSize: 10,
      pageNum: 1,
    }
    util.POST('mobile/violentCase/psychologicalCounseling/getOrgs', token, data, this.success)
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
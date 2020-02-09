// pages/shelter/claimant/claimant.js
// pages/shelter/applicantIfn/applicantIfn.js
const util = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '刘生',
    gender: '男',
    phone: '13819587467',
    idNum: '410621200009193844',
    gender: ['男', '女'],
    region: ['浙江省', '杭州市', '西湖区'],
    index: 0,
    nation:'',
    addressDetail:''
  },

  /*
  *选择性别
  */
  genderPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },

  /*
  *选择住址省市区
  */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  nextBtn:function(){
    // 判断姓名手机号
    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号填写错误");
      return false;
    }
    if (!util.checkId(this.data.idNum)) {
      util.remind("身份证号填写错误");
      return false;
    }
    if (this.data.nation=='') {
      util.remind("请填写民族");
      return false;
    }
    if (this.data.region=='') {
      util.remind("地址填写错误");
      return false;
    }
    if (this.data.addressDetail=='') {
      util.remind("请填写详细地址");
      return false;
    }
    wx.navigateTo({
      url: '/pages/shelter/shelterList/shelterList'
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
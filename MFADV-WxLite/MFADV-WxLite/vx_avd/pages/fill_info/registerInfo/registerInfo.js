// pages/fill_info/registerInfo/registerInfo.js
const util = require('../../../utils/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gender: ['女', '男'],
    index: 0,
    phone: '',
    id_num: '',
  },

  // relationTypePickerSelected: function (e) {
  //   app.globalData.relationTypeIndex = e.detail.value
  //   app.globalData.registerInfo.relationToApply = this.data.Code[e.detail.value]
  //   this.setData({
  //     relation_index: e.detail.value
  //   });
  // },

  //获取登记人姓名
  getName: function (e) {
    app.globalData.registerInfo.actualName = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },

  /**
  *  选择性别
  */
  genderPickerSelected: function (e) {
    app.globalData.registerInfo.sex = this.data.gender[e.detail.value]
    this.setData({
      index: e.detail.value
    });
  },

  //获取登记人手机号
  getPhone: function (e) {
    app.globalData.registerInfo.phone = e.detail.value;
    this.setData({
      phone:e.detail.value
    })
  },

  //获取登记人身份证号
  getIdCard: function (e) {
    app.globalData.registerInfo.idCard = e.detail.value
    this.setData({
      id_num: e.detail.value
    })
  },

  submit: function () {
    console.log(this.data.phone)
    if (!this.data.name) {
      util.remind("姓名不能为空");
      return false;
    }

    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号输入有误");
      return false;
    }

    if (!util.checkId(this.data.id_num)) {
      util.remind("身份证号输入有误");
      return false;
    }

    var _url = this.data.url

    if (this.data.name != null && util.checkPhone(this.data.phone) && 　util.checkId(this.data.id_num)) {
      app.globalData.listStatus[0].checked = true
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // success: function (res) {
  //   var RelationType = []
  //   var Code = []
  //   console.log(res.data.result.dicts)
  //   var Array = res.data.result.dicts
  //   for (var i = 0, len = Array.length; i < len; ++i) {
  //     RelationType.push(Array[i].name)
  //     Code.push(Array[i].code)
  //   }
  //   this.setData({
  //     RelationType: RelationType,
  //     Code: Code
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.apply_info.applyType == "OTHER") {
      this.setData({
        name: app.globalData.registerInfo.actualName,
        phone: app.globalData.registerInfo.phone,
        id_num: app.globalData.registerInfo.idCard,
      })
    }
    // var data = {
    //   type: 'relation'
    // }
    if (app.globalData.registerInfo.sex == "女") {
      this.setData({
        index: 0,
      })
    }
    if (app.globalData.registerInfo.sex == "男") {
      this.setData({
        index: 1,
      })
    }
    if (app.globalData.registerInfo.sex == ""){
      app.globalData.registerInfo.sex = "男"
      this.setData({
        index: 1,
      })
    }
    // util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, data, this.success)
    this.setData({
      gender: ['女', '男'],
      // relation_index: app.globalData.relationTypeIndex,
    })
    
    if (options.fill_info_type == '庇护申请'){
      this.setData({
        fill_info_type: options.fill_info_type,
        url: '/pages/shelter/applicantIfn/applicantIfn?fill_info_type=' + options.fill_info_type
      })
    }else{
      this.setData({
        fill_info_type: options.fill_info_type,
        url: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type
      })
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
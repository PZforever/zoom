// pages/psychological_counseling/counselor_list/counselor_list.js
const util = require('../../../utils/request.js');
const config = require('../../../utils/config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schedulesIndex: 0,
    img_url: config.API_HOST + "counselorAndMediators/",
    status: '',
    orgId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (!!options.org_id) {
      _this.data.orgId = options.org_id;
    }

    // _this.login();
    _this.getCams();
  },

  bindschedulesPickerChange: function (e) {
    var counselorItems = this.data.counselorItems
    getApp().globalData.psychologicalCounseling.psychologist.id = e.currentTarget.dataset.id
    getApp().globalData.psychologicalCounseling.appointmentDate = counselorItems[e.target.dataset.index].schedulesArray[e.detail.value]
    getApp().globalData.psychologicalCounseling.psychologicalSchedule.id = counselorItems[e.target.dataset.index].scheduleIdsArray[e.detail.value]
    for (var j = 0; j < counselorItems.length; j++) {
      counselorItems[j].status = e.target.dataset.index
    }
    counselorItems[e.target.dataset.index].status = e.target.dataset.index
    getApp().globalData.psychologist_index = e.target.dataset.index
    getApp().globalData.psychologist_name = counselorItems[e.target.dataset.index].actualName
    this.setData({
      counselorItems: counselorItems
    });
    app.globalData.listStatus[5].checked = true
    util.remind('预约成功')
  },

  getSchedules: function (counselorInfo) {
    var _that = this
    var _counselorItems = []
    var schedulesArray = []
    var scheduleIdsArray = []
    var token = getApp().globalData.loginInfo.token
    var data = {
      pageNum: 1,
      pageSize: 50,
      counselorId: counselorInfo.id
    }

    wx.request({
      url: config.API_HOST + "mobile/violentCase/psychologicalCounseling/getSchedules",//请求地址
      method: 'post',//请求方式
      data: data,//请求参数
      header: { "Content-Type": "application/json", 'token': token },
      success: function (res) {
        var schedules = res.data.result.schedules
        for (var j = 0; j < schedules.length; j++) {
          scheduleIdsArray.push(schedules[j].id)
          if (schedules[j].workType == 0) {
            schedulesArray.push(schedules[j].workDay + "上午")
            schedulesArray.push(schedules[j].workDay + "下午")
          }
          if (schedules[j].workType == 1) {
            schedulesArray.push(schedules[j].workDay + "上午")
          }
          if (schedules[j].workType == 2) {
            schedulesArray.push(schedules[j].workDay + "下午")
          }
        }

        var counselorItemsArray = _that.data.counselorItems
        var i = counselorInfo.index
        counselorItemsArray[i].schedulesArray = schedulesArray
        counselorItemsArray[i].scheduleIdsArray = scheduleIdsArray
        counselorItemsArray[i].schedulesIndex = 0
        counselorItemsArray[i].index = i

        _that.setData({
          counselorItems: counselorItemsArray
        })

        if (getApp().globalData.psychologist_index != null) {
          _that.data.counselorItems[app.globalData.psychologist_index].status = app.globalData.psychologist_index
          _that.setData({
            counselorItems: _that.data.counselorItems
          })
        }
      },
    })
  },

  submit: function () {
    // wx.showModal({
    //   title: '是否关联证据库中的已上传证据',
    //   content: '点击填表目录的证据上传选项，可选择新增上传证据或关联证据库中的已上传证据',
    //   confirmText: "是",
    //   cancelText: "否",
    //   success: function (res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/pages/completeData/evidenceUpload/uploadDatabaseSelect/uploadDatabaseSelect?from_service=1'
    //       })
    //     } else {

    if (getApp().globalData.servicesArray.length == 0 || (getApp().globalData.servicesArray.length == 1 && getApp().globalData.servicesArray[0].service_name == '心理咨询')) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 2
      })
    }
    
    //     }
    //   }
    // })
  },

  success: function (res) {
    var that = this
    var counselorArray = res.data.result.cams
    var _counselorItems = []
    that.setData({
      counselorItems: res.data.result.cams
    })

    for (var j = 0; j < counselorArray.length; j++) {
      counselorArray[j].index = j
      that.getSchedules(counselorArray[j])
    }
  },



  getCams: function () {
    var _this = this;
    var token = getApp().globalData.loginInfo.token
    var data = {
      keyword: "",
      pageSize: 20,
      pageNum: 1,
      orgId: _this.data.orgId
    }
    //获取机构列表
    util.POST('mobile/violentCase/psychologicalCounseling/getCams', token, data, this.success)
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
    this.getSystemInformation();
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

  //获取系统信息
  getSystemInformation: function () {
    const _self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        _self.setData({
          clientHeight: res.windowHeight - 60
        });
      }
    });
  },

  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    util.POST('mobile/login/signin', '', { 'phone': '15871775675', 'pwd': '12345678' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.data.orgId = "8001010000000002";
        _this.getCams();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})
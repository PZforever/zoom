const util = require('../../../utils/request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    pageSize: 10,
    isMore: true,
    /*咨询师列表 */
    counselors: [],
    sortAry: ['工作年限从长到短', '工作年限从短到长'],
    search: ''
  },
  //head搜索列表
  bindPickerChange: function (e) {//筛选
    console.log(e.detail.value)
    var value = e.detail.value+''
    this.setData({
      search: value
    })
    this.data.pageNum=0;
    this.data.counselors=[];
    this.getCounselors();
  },
  searchName: function (e) {//input.value
    // console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  searchBtn: function () {//点击按钮
    this.data.pageNum = 0;
    this.data.counselors = [];
    this.getCounselors();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("options", options);
    // this.login();
    var token = this.getToken();
    if (!token) {
      return;
    }

    if (!!options.disputesId) {
      this.data.disputesId = options.disputesId;
      // console.log("disputesId", options.disputesId);
    }
    else {
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: "请先录入事件详情！",
        success: function () {
          wx.redirectTo({
            url: '/pages/consult/disputes/disputes',
          });
        }
      })
      return;
    }

    // this.getCounselors();
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
    this.getCounselors();
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
    this.getCounselors();
  },

  /**
   * 用户点击右上角分享
   */
  

  /**
   * 获取咨询师列表，在加载和触底中调用
   */
  getCounselors: function () {
    var token = this.getToken();
    if (!token) {
      return;
    }

    var that = this;
    // if (!this.data.isMore) {
    //   return
    // }//判断有无下一页
    // console.log(this.data);
    var counselors = this.data.counselors;

    this.data.pageNum++;
    // console.log(this.data.pageNum);
    // console.log(this.data.pageSize);
    // console.log(this.data.search);
    wx.request({
      url: getApp().globalData.rootURL + 'mobile/consult/getCounselors',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        search: this.data.search
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      success: function (res) {
        //{"result":{"counselors":[{"actualName":"宁松","imgPhoto":"https://mf.dev.izern.cn:443/counselorAndMediators/10040-1.jpg","isLogin":"0","id":10040,"ability":"劳动争议、借贷纠纷、其他纠纷","job":"法律服务咨询师"}],"size":1445.0,"isMore":true},"code":"200","message":"查询成功"}
        var addCounselors = res.data.result.counselors
        // console.log(addCounselors);
        for (var i = 0; i < addCounselors.length; i++) {
          counselors.push(addCounselors[i])
        }
        that.setData({
          counselors: counselors,
          isMore: res.data.result.isMore
        });
        if (counselors.length == 0) {
          console.log(12)
          wx.showToast({
            title: '抱歉，查无此人！',
            icon: 'none',
            duration: 1500
          });
        }
      }
      // fail: function () {
      //   // fail
      // },
      // complete: function () {
      //   // complete
      // }
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    });
  },

  selectCounselor: function (e) {
    var token = this.getToken();
    if (!token) {
      return;
    }
    console.log('选中counselor：', e.currentTarget.dataset.counselor);
    var counselor = e.currentTarget.dataset.counselor;
    /*提交的内容 */
    var formData = { "disputesId": this.data.disputesId, "counselorId": counselor.id };
    wx.request({
      url: getApp().globalData.rootURL + 'mobile/consult/selectCounselor',
      data: formData,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        token: token
      },
      success: (res) => {
        this.selectCounselorSuccess(res);
      },
      fail: function (res) {
        wx.showModal({
          title: '错误',
          showCancel: false,
          content: JSON.stringify(res)
        })
      }
    })
  },

  /**
   * 选中咨询师成功应答事件
   */
  selectCounselorSuccess: function (res) {
    console.log(res.data);
    //{"result":{"disputesId":533,"sessionId":327,"counselorId":10017},"code":"200","message":"查询成功"}
    if (res.data.code == '200') {
      var result = res.data.result;
      var disputesId = result.disputesId;
      var counselorId = result.counselorId;
      wx.redirectTo({
        url: '/pages/consult/consult_session/consult_session?disputesId=' + disputesId + '&counselorId=' + counselorId
      });
    }
    else {
      console.log(res.data.message);
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: res.data.message
      })
    }
  },

  /**
   * 获取登录令牌
   */
  getToken: function () {
    if (!getApp().globalData.loginInfo || !getApp().globalData.loginInfo.token) {
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: "请先登录！",
        success: function () {
          wx.redirectTo({
            url: '/pages/login/login',
          });
        }
      })
      return null;
    }
    var token = getApp().globalData.loginInfo.token;
    return token;
  },

  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    util.POST('mobile/login/signin', '', { 'phone': '15928578507', 'pwd': '111111' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.getCounselors();
      } else {
        util.remind(res.data.message);
      }
    })
  }

})
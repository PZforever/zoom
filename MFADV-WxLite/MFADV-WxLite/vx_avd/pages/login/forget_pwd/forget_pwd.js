// pages/login/forget_pwd/forget_pwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "15928578507",
    validationBtnText: "发送验证码",
    counter: 0,
    countDownTimer: null
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
   * 验证码按钮计数器
   */
  countDown: function() {
    if (!this.data.counter) {
      this.data.countDownTimer && clearInterval(this.data.countDownTimer);
      this.setData({
        validationBtnText: `发送验证码`
      });
      return;
    }
    let counter = --this.data.counter;
    this.setData({
      counter,
      validationBtnText: `${counter}秒`
    });
  },
  /**
   * 发送验证码
   */
  getVerificationCode: function (e) {
    var formData = { "phone": this.data.phone };
    console.log('发送验证码：', formData);
    wx.request({
      url: getApp().globalData.rootURL + 'mobile/common/getVerificationCode',
      data: formData,
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.code == '200') {
          wx.showToast({
            title: '验证码发送成功！',
          });
          const timer = setInterval(() => {
            this.countDown();
          }, 1000);
          var counter = 60;
          this.setData({
            counter,
            validationBtnText: `${counter}秒`,
            countDownTimer: timer
          });
        }
        else {
          console.log(res.data.message);
          wx.showToast({
            title: res.data.message,
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    var formData = JSON.stringify(e.detail.value);
    console.log('忘记密码：', formData);
    wx.request({
      url: getApp().globalData.rootURL + 'mobile/login/forgetPassword',
      data: formData,
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          wx.showToast({
            title: '密码修改成功，请重新登录！',
          })
          /*跳到登录页面 */
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
        else {
          console.log(res.data.message);
          wx.showToast({
            title: res.data.message,
          })
        }
      }
    })
  }
})
// pages/login/signon_idcard/signon_idcard.js
const util = require('../../../utils/request.js');
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    area:'',
    address:''
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
    this.area = this.selectComponent("#area");
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
  
  // takePositiveSide: function () {
  //   this.setData({
  //     currentIdCardSide: 1,
  //     cameraVisible: true
  //   });
  // },
  // takeOtherSide: function () {
  //   this.setData({
  //     currentIdCardSide: 0,
  //     cameraVisible: true
  //   });
  // },
  // takePhoto: function () {
  //   const ctx = wx.createCameraContext()
  //   ctx.takePhoto({
  //     quality: 'lower',
  //     success: (res) => {
  //       if (this.data.currentIdCardSide === 1) {
  //         this.setData({
  //           positivePhoto: res.tempImagePath,
  //           cameraVisible: false
  //         });
  //         this.upload(res.tempImagePath, 'files[0]');
  //       } else if (this.data.currentIdCardSide === 0) {
  //         this.setData({
  //           otherPhoto: res.tempImagePath,
  //           cameraVisible: false
  //         });
  //         this.upload(res.tempImagePath, 'files[1]');
  //       }
  //     }
  //   })
  // },
  // error(e) {
  //   util.remind(e)
  // },
  // /*上传照片 */
  // upload: function(imagePath, imageName) {
  //   var phone = getApp().globalData.signonInfo.phone;//'15928578507';//
  //   wx.uploadFile({
  //     url: getApp().globalData.rootURL + 'mobile/login/registered/upload', 
  //     filePath: imagePath,
  //     name: imageName,
  //     formData: {
  //       'phone': phone
  //     },
  //     success: function (res) {
  //       var data = JSON.parse(res.data);
  //       if (data.code == '200') {
  //         var key = data.result.key;
  //         var value = data.result.value;
  //         if (key == "imgPositive"){
  //           getApp().globalData.signonInfo.imgPositive = value;
  //         }
  //         else{
  //           getApp().globalData.signonInfo.imgOther = value;
  //         }          
  //       }
  //       else{
  //         util.remind(data.message);
  //       }

  //     },
  //     fail: function (res) {
  //      util.remind(res);
  //     }
  //   })
  // },
  getArea:function(){
    this.area.showDialog();
  },
  _cancelEvent:function(){
    this.area.hideDialog();
  },
  _confirmEvent:function(){
    this.setData({
      address:this.area.data.address,
      area:this.area.data.address.province.name+','+this.area.data.address.city.name+','+this.area.data.address.area.name
    })
    this.area.hideDialog();
  },
  formSubmit: function (e) {
    // 判断表单内容是否填写
    if (e.detail.value.actualName==''||e.detail.value.address==''||e.detail.value.age==''||this.data.area=='') {
      util.remind("请完整填写信息");
      return false;
    }
    // if (!/^[1-9]\d$/.test(e.detail.value.age)) {
    //   util.remind("年龄格式不正确");
    //   return false;
    // }
    if (!util.checkId(e.detail.value.idCard)) {
      util.remind("身份证号填写错误");
      return false;
    }
    /*表单内容 */
    var formData= e.detail.value;
    var addressObj={areasCode:this.data.address.area.code}
    /*注册信息内容 */
    // var signonInfo = getApp().globalData.signonInfo;
    /*合并数据 */
    Object.assign(formData, addressObj);
    /*提交的内容 */
    // var formData = JSON.stringify(signonInfo);

    util.POST('mobile/user/toCertification',app.globalData.loginInfo.token,formData,function(res){
      if (res.data.code=="200") {
        util.remind("实名认证成功");
        console.log(res.data.result);
        app.globalData.loginInfo = res.data.result;
        // app.globalData.loginInfo.idCard = e.detail.value.idCard;
        // app.globalData.loginInfo.actualName = e.detail.value.actualName;
        setTimeout(function(){
            /*返回登录页面 */
            wx.navigateBack({
              delta:1
            })
        },500)
        
      }else{
        util.remind(res.data.message);
      }
    })
  }
})
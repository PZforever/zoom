//index.js
//获取应用实例
const util = require('../../../..//utils/request.js');
const app = getApp()
Page({
  data: {
    select:false,
    message:"",
    personal:"",
    id:""
  },
  onLoad: function (query) {
    this.setData({
      id:query.messageId
    })
    var _this=this;
    wx.getStorage({
      key: 'message',
      success: function(res) {
        console.log(res)
          _this.setData({
            message:res.data
          })
      } 
    })
    this.getMessage();
  },
  selectBtn:function(e){
    this.setData({
      select: e.currentTarget.id == 1?false:true
    })
  },
  getMessage:function(){
    var _this=this;
    util.POST("mobile/violentCase/getLitigant",app.globalData.loginInfo.token,{'violentCaseId':this.data.id,'type':'A'},function(res){
      _this.setData({
        personal:res.data.result
      })
    })
  }
})

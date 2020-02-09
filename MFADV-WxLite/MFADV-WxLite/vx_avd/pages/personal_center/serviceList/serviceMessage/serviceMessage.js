// pages/personal_center/serviceList/serviceList.js
const util = require('../../../../utils/request.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 服务信息id
    codeId:'',
    id:'',
    markers:[{
      iconPath: "../../../../img/mapAdd.png",
      id: 0,
      latitude:'',
      longitude:'', 
      width: 50,
      height: 50
    }],
    longitude:'',
    latitude:'',
    shelterName:'',
    // 心理咨询信息
    message:'',
    list:[],
    address:'',
    // 定义时间times
    times:{
      day:'',
      hour:'',
      minute:'',
      second:''
    },
    noContent:false,
    serviceNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      codeId:options.id,
      id:options.code
    });   
  },
  getMessage:function(url,id){
    wx.showLoading();
    var _this=this;
    util.POST(url,app.globalData.loginInfo.token,{id:id},function(res){
      wx.hideLoading();
      if (res.data.code==200) {
        // 判断是那种类型的
        if (_this.data.codeId==1) {
          _this.setData({
            address:res.data.result.sanctuaryApplication.sanctuary,
            markers:[{
              iconPath: "../../../../img/mapAdd.png",
              id: 0,
              latitude:res.data.result.sanctuaryApplication.sanctuary.latitude,
              longitude:res.data.result.sanctuaryApplication.sanctuary.longitude,
              width: 20,
              height: 30
            }],
            latitude:res.data.result.sanctuaryApplication.sanctuary.latitude,
            longitude:res.data.result.sanctuaryApplication.sanctuary.longitude,
            noContent:res.data.result.sanctuaryApplication.sanctuary?true:false,
            serviceNo:res.data.result.sanctuaryApplication.serviceNo
          })
        }else if(_this.data.codeId==2){
          res.data.result.psychologicalCounseling.violentMeettings.forEach(function(item){
            // 判断当前心理咨询的会议状态
            if (item.status=='03') {
              var time=util.downTime((item.endTime-item.orderTime)/1000,1);
              item.meetingHour=time.hour;
              item.meetingMin=time.minute;
            }else if (item.status=='00') {
              var timestamp=(item.orderTime-Date.parse(new Date()))/1000;
              var time=util.downTime(timestamp,1);
              item.meetingDay=time.day;
              item.meetingHour=time.hour;
              item.meetingMin=time.minute;
              item.meetingSec=time.second;
            }
            item.orderTime=util.setTime(item.orderTime,'-',true);
          })
          _this.setData({
            noContent:res.data.result.psychologicalCounseling.violentMeettings[0]?true:false,
            message:res.data.result.psychologicalCounseling.violentMeettings
          })
        }else if(_this.data.codeId==3){
          
        }else if(_this.data.codeId==4){
          res.data.result.personalSafetyProtectionOrder.progresses.forEach(function(item){
              item.createTime=util.setTime(item.createTime,'-');
          })
          _this.setData({
            noContent:res.data.result.personalSafetyProtectionOrder.progresses[0]?true:false,
            list:res.data.result.personalSafetyProtectionOrder.progresses
          })
        }
      }else{
        util.remind(res.data.message);
      }
    })
  },
  markertap:function() {
     wx.openLocation({
        name:this.data.address.name,
        latitude: Number(this.data.latitude),
        longitude: Number(this.data.longitude),
        scale: 28
      })
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
    //判断页面title
    if (this.data.codeId==1) {
      wx.setNavigationBarTitle({
        title: '庇护所详情信息'
      })
      // 请求函数
      this.getMessage('mobile/violentCase/getAsylumApplication',this.data.id);
    }else if(this.data.codeId==2){
      wx.setNavigationBarTitle({
        title: '心理专家服务'
      })
      // 请求函数
     this.getMessage('mobile/violentCase/getPsychologicalCounseling',this.data.id);
    }else if(this.data.codeId==3){
      wx.setNavigationBarTitle({
        title: '当前页面'
      })
      // 请求函数
     this.getMessage('mobile/violentCase/getAsylumApplication',this.data.id);
    }else{
      wx.setNavigationBarTitle({
        title: '服务详情'
      })
      // 请求函数
      this.getMessage('mobile/violentCase/getPersonalSafetyProtectionOrder',this.data.id);
    }
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
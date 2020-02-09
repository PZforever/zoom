// pages/personal_center/serviceList/serviceList.js
const util = require('../../../utils/request.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageNum:1, 
    isMore:0,
    isSend:0,
    keyword:'全部',
    keyCode:'all',
    searchName:'',
    search:''//搜索
  }, 
  //  sousuo1搜索
  searchName: function (e) {
    this.setData({
      searchName: e.detail.value
    })
    if (e.detail.value==''){
      this.getMessage();
    }
  },
  searchBtn: function (e) {
    this.setData({
      search: this.data.searchName
    });
    this.data.pageNum = 1;
    this.data.list = [];
    this.getMessage(); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.login();
    this.getMessage();
  },

  getMessage:function(){
    wx.showLoading();
    var _this=this;
    util.POST('mobile/violentCase/list', app.globalData.loginInfo.token, { 'keyword': this.data.keyCode, 'pageNum': this.data.pageNum++, 'pageSize': '10', 'search': this.data.search},function(res){
      // 判断交互是否正常
      wx.hideLoading();
      if (res.data.code==200) {
        // 修改时间戳格式
        res.data.result.violentCases.forEach(function(item){
          item.createTime=util.setTime(item.createTime,'/',true);
        })
        _this.setData({
          list:_this.data.list.concat(res.data.result.violentCases),
          isMore:res.data.result.isMore?1:0,
          isSend:!_this.data.isSend
        })
      }else{
        util.remind(res.data.message);
      }
    })
  },
  low:function(){
    //滚动到底部的函数
    if (this.data.isMore&&this.data.isSend) {
      this.getMessage();
      this.setData({
        isSend:!this.data.isSend 
      })
    }
  }, 
  //打开详情页面
  openBtn:function(event){
   if (!event.currentTarget.dataset.item.isInDetails){
     return false;
   } 
    wx.navigateTo({
      url: '/pages/personal_center/serviceList/serviceMessage/serviceMessage?id='+event.currentTarget.id+'&code='+event.currentTarget.dataset.content.id
    })
  },
  openMessage:function(event){
    // 存储信息
    wx.setStorage({
      key:"message",
      data:event.currentTarget.dataset.content
    })
    if (event.currentTarget.id==1) {
      wx.navigateTo({
        url:"/pages/personal_center/serviceList/serviceGuard/serviceGuard?messageId="+event.currentTarget.dataset.messageid
      })
    }else if(event.currentTarget.id==2){
      wx.navigateTo({
        url:"/pages/personal_center/serviceList/serviceMsg/serviceMsg?messageId="+event.currentTarget.dataset.messageid
      })
    }
  },
  // 时间筛选
  selectTime:function(){
    var _this=this;
    var time=['一周', '一个月', '三个月','全部'];
    var times=['week','month','season','all'];
    wx.showActionSheet({
      itemList: time,
      success: function(res) {
        _this.setData({
          keyword:time[res.tapIndex],
          keyCode:times[res.tapIndex],
          list:[],
          pageNum:1,
          isMore:0,
          isSend:0
        });
        _this.data.search = '';
        _this.getMessage();
      },
      fail: function(res) {
        // console.log(res.errMsg)
      }
    })
  },
  // 获取时间框信息
  getTime:function(){

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


  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    util.POST('mobile/login/signin', '', { 'phone': '15871775675', 'pwd': '12345678' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.getMessage();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})
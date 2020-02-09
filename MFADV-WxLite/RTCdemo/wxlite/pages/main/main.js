// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: 0,
    tapTime: '',		// 防止两次点击操作间隔太快
    entryInfos: [
      { icon: "../Resources/liveroom.png", title: "直播体验室", navigateTo: "../liveroom/roomlist/roomlist" },
      { icon: "../Resources/doubleroom.png", title: "双人音视频", navigateTo: "../doubleroom/roomlist/roomlist" },
      { icon: "../Resources/multiroom.png", title: "多人音视频", navigateTo: "../multiroom/roomlist/roomlist" },
      { icon: "../Resources/vodplay.png", title: "点播播放器", navigateTo: "../vodplay/vodplay" },
      { icon: "../Resources/push.png", title: "RTMP推流", navigateTo: "../push/push" },
      { icon: "../Resources/play.png", title: "直播播放器", navigateTo: "../play/play" },
      { icon: "../Resources/rtplay.png", title: "低延时播放", navigateTo: "../rtplay/rtplay" }
      // { icon: "../Resources/wawaplay@2x.png", title: "在线抓娃娃", navigateTo: "../wawaplayer/wawaroomlist/wawaroomlist" }
    ]
  },

  onEntryTap: function (e) {
    if (this.data.canShow) {
    // if(1) {
      // 防止两次点击操作间隔太快
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
      var toUrl = this.data.entryInfos[e.currentTarget.id].navigateTo;
      console.log(toUrl);
      wx.navigateTo({
        url: toUrl,
      });
      this.setData({ 'tapTime': nowTime });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
        showCancel: false
      });
    }
  },
  onRole1:function(e){
    wx.navigateTo({
      url: '../ROLE1/ROLE1'
    })
  },
  onRole3:function(e){
    wx.navigateTo({
      url: '../ROLE3/ROLE3'
    })
  },
  onRole6:function(e){
    wx.navigateTo({
      url: '../ROLE6/ROLE6'
    })
  },
  onTestPush:function(e){
    wx.navigateTo({
      url: '../RTC/rtc'
    })
  },
  onTwo: function () {
    wx.navigateTo({
      url: '../RTCTwo/two',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
  },
  onLoad:function(){
    // wx.connectSocket({
    //   url: 'ws://' +'122.112.210.226:28888'+'/'+'meeting/'+"test01"
    // })

    // wx.onSocketMessage(function (res) {
    //   console.log('收到服务器内容：' + res.data)
    //   var len=[1,2];
    //   var json = JSON.parse(res.data)
    //   if(json.msg){
    //     console.log("true");
    //   }
    //   for(var j=0;j<len.length;j++){
    //     console.log(len[j]);
    //   }
    // })

    
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    if(!wx.createLivePlayerContext) {
      setTimeout(function(){
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      },0);
    } else {
      // 版本正确，允许进入
      this.data.canShow = 1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("onHide");

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");
    return {
      title: '腾讯视频云',
      path: '/pages/main/main',
      imageUrl: '../Resources/share.png'
    }
  }
})
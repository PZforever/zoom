// pages/rtplay/rtplay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    videoContext: {},

    fullScreen: false,
    playUrl: "",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,
  },

  onScanQR: function () {
    this.stop();
    this.createContext();
    console.log("onScaneQR");
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        self.setData({
          playUrl: res.result
        })
      }
    })
  },

  onNewUrlClick: function () {
    var self = this;

    wx.request({
      url: 'https://lvb.qcloud.com/weapp/utils/get_test_rtmpaccurl',
      success: (res) => {
        // if (res.data.returnValue != 0) {
        //   wx.showToast({
        //     title: '获取播放地址失败',
        //   })
        //   return;
        // }

        var playUrl = res.data['url_rtmpacc'];

        console.log(playUrl);
        self.setData({
          playUrl: playUrl
        })

        wx.showToast({
          title: '获取地址成功',
        })
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '网络或服务器异常',
        })
      }
    })
  },

  onPlayClick: function () {

    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0 && url.indexOf("liveplay") != -1) {
    } else {
      wx.showModal({
        title: '提示',
        content: '非加速播放地址，请点击右上角New按钮获取播放地址',
        showCancel: false
      });
      return;
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }

    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },

  onPlayEvent: function (e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '拉流多次失败',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function () {
    this.setData({
      playing: false,
      playUrl: "",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function () {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
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
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
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
    this.stop();

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
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
  onShareAppMessage: function () {
    return {
      title: '低延时播放',
      path: '/pages/rtcplay/rtcplay',
      imageUrl: '../Resources/share.png'
    }
  }
})
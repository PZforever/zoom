const util = require('../../utils/request.js');
const QQMAP = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp();
var wxMap = new QQMAP({
  key: 'JIFBZ-AW4W3-GGK3O-YJIEC-LUZOK-VXFXA'
  // key: 'JVLBZ-Y4M3D-RQO4D-HF7UI-6YVJ5-HYBT5'
});  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[], 
    isPrivacy:0,
    state: '公开',
    tabs: ["安全", "隐患", "冲突","紧张"],
    title: "",
    address: "正在获取当前位置...",
    tagType: 2,
    remark: "",
    groupId: 0,
    attachements:[],
    orangeDiaryAttachmentList: [{
      url: "",
      imgName: "头像"
    }]
  },
  title:function(e){
    this.setData({ //日记标题
      title: e.detail.value
    })
  },
  remark: function (e) {
    this.setData({ //日记标题
     remark: e.detail.value
    })
  },
  // 标记的颜色
  tabClick: function (e) {
    this.setData({
      tagType: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this; 
    app.globalData.orangeDiaryUpLoad = [];
    this.setData({
      groupId: options.groupId
    })
    console.log(options.groupId)
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wxMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (res) {
            console.log(res)
            var address = res.result.address;
            _that.setData({
              address: address
            })
            console.log(_that.data.address);
          },
          fail: function (res) {
            console.log(res)
            _that.setData({
              address: "网络错误，请从新加载"
            })
          }
        });
      },
      fail: function (res) {
        _that.setData({
          address: "您未授权获取位置或网络未连接"
        })
      }
    })
    // console.log(this.data.address);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var _that = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=JIFBZ-AW4W3-GGK3O-YJIEC-LUZOK-VXFXA&get_poi=1";
    //     // wx.request(getAddressUrl, "get", "", function (ops) {
    //     //   console.log(JSON.stringify(ops)); 
    //     // })
    //     wx.request({
    //       url: getAddressUrl, //仅为示例，并非真实的接口地址
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success: function (res) {
    //         console.log(res.data)
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     _that.setData({
    //       address: "您未授权获取位置或网络未连接"
    //     })
    //   }
    // })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */ 
  onShow: function () {
    // console.log(app.globalData.orangeDiaryUpLoad);//类型传值
    var _that = this; 
    var attachements = app.globalData.orangeDiaryUpLoad;
    var list = [];
    for (var i = 0; i <attachements.length; i++) {
      attachements[i].isFold = false;
      if (attachements[i].children.length>0){
        for(var j=0;j<attachements[i].children.length;j++){
          var listUp = {
            "type": attachements[i].code,
            "imgName": attachements[i].children[j].name,
            "url": attachements[i].children[j].url
          }
          list.push(listUp);
        }
      }
    }
    // console.log(list);
    _that.setData({
      attachements: attachements,
      list:list
    });
    // console.log(attachements);
  },
  /**
   * 折叠展开
   */
  flodFn: function (e) {
    const _self = this;
    var index = e.currentTarget.dataset.index;
    // console.log(e); console.log(_self.data.attachements);
    if (_self.data.attachements[index].isFold == true) {
      _self.data.attachements[index].isFold = false
    } else {
      _self.data.attachements[index].isFold = true;
    }
    _self.setData({
      attachements: _self.data.attachements
    });
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
  // 图片预览删除事件
  imgClose: function (e) {
    var _that = this;
    var aInd = e.currentTarget.dataset.attachmentindex;
    var cInd = e.currentTarget.dataset.childindex;
    var attachements = this.data.attachements;
    // console.log(attachements); console.log(aInd);console.log(cInd);
    attachements[aInd].children.splice(cInd, 1);
    app.globalData.orangeDiaryUpLoad = attachements;
    var list = [];
    for (var i = 0; i < attachements.length; i++) {
      attachements[i].isFold = true;
      if (attachements[i].children.length > 0) {
        for (var j = 0; j < attachements[i].children.length; j++) {
          var listUp = {
            "type": attachements[i].code,
            "imgName": attachements[i].children[j].name,
            "url": attachements[i].children[j].url
          }
          list.push(listUp);
        }
      }
    }
    _that.setData({
      list:list,
      attachements: attachements
    })
  },
  // 隐私设置
  open:function(e){
    var that = this;
    if (e.detail.value){
      that.setData({
        isPrivacy:1,
        state:'隐私'
      })
    }else{
      that.setData({
        isPrivacy:0,
        state:'公开'
      })
    }
  },
  //提交
  submit: function () {
    var _that = this;
    var _true = 0;
    var token = getApp().globalData.loginInfo.token;
    if (_that.data.title == "") {
      util.remind("橙色日记标题不能为空！");
      return
    }
    // console.log(_that.data.list)
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      duration: 10000//loading时间
    });
    util.POST('mobile/orangeDiary/insert/save', getApp().globalData.loginInfo.token, {
      title: _that.data.title,
      address: _that.data.address,
      tagType: _that.data.tagType,
      remark: _that.data.remark,
      isPrivacy: _that.data.isPrivacy,
      groupId: _that.data.groupId,
      address: _that.data.address,
      orangeDiaryAttachmentList: _that.data.list
    }, function (res) {
      // console.log(res);
      app.globalData.orangeDiaryUpLoad=[];
      wx.showToast({
        title: "操作成功！",
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
    );
  }
})
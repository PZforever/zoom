// pages/diary_article/diary_article.js
var arr = getCurrentPages();
const app = getApp();
const util = require('../../utils/request.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: { 
    isPrivacy: 0,
    state: '公开',
    isApply:'',
    stated:false,
    tabs: ["安全", "隐患", "冲突", "紧张"],
    activeIndex: 1,
    title:'',
    remark:'',
    address:'',
    id:'',
    groupid:'',
    list:[],//新上传文件
    listTow:[],//已有文件
    showList:[],
    attachements:[]
  },
  title: function (e) {
    // console.log(e.detail.value)
    this.setData({ //日记标题
      title: e.detail.value
    })
  },
  remark: function (e) {
    // console.log(e.detail.value)
    this.setData({ //日记标题
      remark: e.detail.value
    })
  },
  // 标记的颜色
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    // console.log(e.currentTarget.id)
  },
  // 跳转到上传页面
  articleUpload:function(){
    wx.navigateTo({
      url: 'articleUpload/articleUpload'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    app.globalData.orangeDiaryUpLoad = [];
    this.setData({
      id: options.id,
      groupid: options.groupid
    });
    var that = this;
    util.POST('mobile/orangeDiary/queryAttachmentPage', getApp().globalData.loginInfo.token, {
      id: this.data.id
    }, function (res) {
      // console.log(res.data.dict)
      var jpg = res.data.result.orangeDiary.orangeDiaryAttachmentList
      for (var i = 0; i < jpg.length; i++) {
        jpg[i].suffix = jpg[i].url.substr(jpg[i].url.length - 4)
      }
      that.setData({
        isApply: res.data.result.orangeDiary.isApply,
        address: res.data.result.orangeDiary.address,
        title: res.data.result.orangeDiary.title,
        remark: res.data.result.orangeDiary.remark,
        isPrivacy: res.data.result.orangeDiary.isPrivacy,
        activeIndex: res.data.result.orangeDiary.tagType,
        showList: res.data.dict
      });//返回数据
      if (res.data.result.orangeDiary.isPrivacy == 1) {
        that.setData({ state: '隐私', stated: true })
      };
      for (var a = 0; a < that.data.showList.length;a++){
        that.data.showList[a].isHedden=false;
      }
      var lengths = that.data.showList;
      var listTow = that.data.listTow;
      for (var i = 0; i < lengths.length;i++){
        for (var g = 0; g < lengths[i].url.length; g++){
          var imgUp = {
            "type": lengths[i].url[g].type,
            "imgName": lengths[i].url[g].imgName,
            "url": lengths[i].url[g].url
          }
          listTow.push(imgUp);
        }
        // console.log(listTow)
      }
      that.setData({
        listTow: listTow,
        showList:that.data.showList
      })
    }
    )
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
    // console.log(app.globalData.orangeDiaryUpLoad);
    var _that = this;
    var attachements = app.globalData.orangeDiaryUpLoad;
    var list = [];
    for (var i = 0; i < attachements.length; i++) {
      attachements[i].isFold = false;
      if (attachements[i].children.length > 0) {
        for (var j = 0; j < attachements[i].children.length; j++) {
          var listUp = {
            "type": attachements[i].code,
            "imgName": attachements[i].children[j].url,
            "url": attachements[i].children[j].name
          }
          list.push(listUp);
        }
      }
    }
    // console.log(list);
    _that.setData({
      attachements: attachements,
      list: list
    })
  },
  /**
   * 折叠展开
   */
  flodFn: function (e) {
    const _self = this;
    var index = e.currentTarget.dataset.index;
    if (_self.data.attachements[index].isFold == true) {
      _self.data.attachements[index].isFold = false
    } else {
      _self.data.attachements[index].isFold = true;
    }
    _self.setData({
      attachements: _self.data.attachements
    });
  },
  oldFlodFn:function(e){
    const _self = this;
    var index = e.currentTarget.dataset.index;
    if (_self.data.showList[index].isHidden == true) {
      _self.data.showList[index].isHidden = false
    } else {
      _self.data.showList[index].isHidden = true;
    }
    _self.setData({
      showList: _self.data.showList
    });
  },
  // 图片预览删除事件
  imgClose:function(e){
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
      list: list,
      attachements: attachements
    })
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
  open: function (e) {
    // console.log(e.detail.value)
    // console.log(this.data.showList)
    var that = this;
    if (e.detail.value) {
      that.setData({
        isPrivacy: 1,
        stated: true,
        state: '隐私'
      })
      // console.log(this.data.isPrivacy)
    } else {
      that.setData({
        isPrivacy: 0,
        stated: false,
        state: '公开'
      })
      // console.log(this.data.isPrivacy)
    }
  },
  // 删除
  deleteUploadHistory:function(e){
    var _that = this;
    var listTow = _that.data.listTow;//已经存在的
    var listIndex = e.currentTarget.dataset.list;
    var urlIndex = e.currentTarget.dataset.urlindex;;//索引
    var imgId = e.currentTarget.dataset.id;//ID
    var showList = _that.data.showList;//展示的列表
    // console.log(listIndex); console.log(urlIndex); console.log(listTow); console.log(showList) 
    wx.showModal({
      title: '确认删除',
      content: '删除请点击确认，返回请点击取消',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          var token = getApp().globalData.loginInfo.token;
          wx.request({
            url: getApp().globalData.rootURL + 'mobile/orangeDiary/update/deleteAttachment',
            data: {
              attachsRemove: imgId,
              id: _that.data.id
            },
            method: 'DELETE',
            header: {
              'token': token
            },
            success: function (res) {
              // console.log(res.data);
              for (var i = 0; i < showList.length;i++){
                if (i == listIndex){
                  showList[listIndex].url.splice(urlIndex, 1);
                }
              };
              _that.setData({
                showList:showList
              });
              var listTow = [];
              for (var i = 0; i < _that.data.showList.length; i++) {
                for (var g = 0; g < _that.data.showList[i].url.length; g++) {
                  var imgUp = {
                    "type": _that.data.showList[i].url[g].type,
                    "imgName": _that.data.showList[i].url[g].imgName,
                    "url": _that.data.showList[i].url[g].url
                  }
                  listTow.push(imgUp);
                }
              }
              _that.setData({
                listTow: listTow
              })
            }
          })
        } else {
          // console.log('up')
        }
      }
    })
  },
  //提交
  submit: function () {
     var _that = this;
     var token = getApp().globalData.loginInfo.token;
     var list = _that.data.list;
     var listTow = _that.data.listTow;
     if (_that.data.title == ""){
       util.remind("橙色日记标题不能为空！"); 
        return
     }
     for(var j=0;j<list.length;j++){
       listTow.push(list[j])
     }
    //  console.log(listTow);
     wx.showToast({
       title: '正在上传...',
       icon: 'loading',
       duration: 10000//loading时间
     });
     util.POST('mobile/orangeDiary/update/save', getApp().globalData.loginInfo.token, {
       title: _that.data.title,
       address: _that.data.address,
       tagType: _that.data.activeIndex,
       remark: _that.data.remark,
       isPrivacy: _that.data.isPrivacy,
       id: _that.data.id,
       orangeDiaryAttachmentList: listTow
     }, function (res) {
       app.globalData.orangeDiaryUpLoad = [];
       wx.showToast({
         title: "操作成功！",
         complete: function () {
           wx.navigateBack({
             delta: 1
           })
         }
       })
     }
     )
  }
})
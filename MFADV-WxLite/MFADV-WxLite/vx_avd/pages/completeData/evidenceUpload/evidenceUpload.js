const util = require('../../../utils/request.js');
const config = require('../../../utils/config.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uploadType: ['证据库上传', '本地上传'],
    attachments: [],
    serviceId: '',
    allFiles: '',
    violentCaseAttachmentId: '',
    clientHeight: '',
    uploadUrl: '',
    /*选择资料库动作的URL */
    databaseUrl: '/pages/completeData/evidenceUpload/uploadDatabaseSelect/uploadDatabaseSelect',
    evidenceCode: "",
    evidenceCodeName: "",
    // 初始上传文件参数
    count: 0,
    // 录音文件
    list: [],
    // 储存零时选择录音文件
    lists: [],
    maskShow: false,
    audioNames: [],
    uploadAudioName:'',
    theFilePath:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _self = this;
    // _self.setData({
    //   allFiles: !!options.allFiles
    // });
    this.getSystemInformation();
    if (!!options.allFiles) {
      _self.setData({
        allFiles: !!options.allFiles,
        uploadUrl: 'mobile/violentCase/uploadDatabase',
        serviceId: ""
      });
      _self.getMessageAll();
    } else {
      if (typeof options.caseId != "undefined") {
        console.log("来自补全资料...", options, _self.data.evidenceCode);
        var serviceId = options.caseId;
        _self.setData({
          uploadUrl: 'mobile/violentCase/uploadAttachmentForUpdate',
          serviceId: serviceId,
          databaseUrl: _self.data.databaseUrl + "&serviceId=" + serviceId,
        });
        _self.getMessage();
      } else {
        // console.log("typeof options.caseId == \"undefined\"");
        /* 如果附件列表是空才初始化 */
        if (!app.globalData.newEventEvidenceType || app.globalData.newEventEvidenceType.length == 0) {
          console.log("self.getDicts()...");
          _self.getDicts();
        }
        _self.setData({
          uploadUrl: 'mobile/violentCase/uploadAttachmentForInsert',
          serviceId: ''
        });
        _self.unloadEvidenceRefresh();
      }
    }
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
    var _self=this;
    console.log(_self.data.attachments);
    // if (!_self.data.allFiles) {}
    _self.unloadEvidenceRefresh();
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

  /**准备上传 */
  preUpload: function () {

  },

  /**
   * 有CaseId时获取列表（补全资料上传）
   */
  getMessage: function () {
    var _self = this;
    util.POST('mobile/violentCase/getAttachments', app.globalData.loginInfo.token, {
      "violentCaseId": _self.data.serviceId
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        _self.data.attachments = res.data.result.attachments;
        for (var i = 0; i < _self.data.attachments.length; i++) {
          _self.data.attachments[i].isFold = true;
        }
        /*请求数据 */
        _self.setData({
          attachments: _self.data.attachments
        })
      } else {
        util.remind("获取数据失败！");
      }
    });

  },
  /**
   * 资料库获取上传列表
   */
  getMessageAll: function () {
    var _self = this;
    util.POST('mobile/violentCase/attachment/list', app.globalData.loginInfo.token, {
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        _self.data.attachments = res.data.result.attachments;
        for (var i = 0; i < _self.data.attachments.length; i++) {
          _self.data.attachments[i].isFold = true;
        }
        /*请求数据 */
        _self.setData({
          attachments: _self.data.attachments
        })
      } else {
        util.remind("获取数据失败！");
      }
    });

  },

  /**
   * 折叠展开
   */
  flodFn: function (e) {
    // console.log(e);
    const _self = this;
    var index = e.currentTarget.dataset.index;
    if (_self.data.attachments[index].isFold == true) {
      _self.data.attachments[index].isFold = false
    } else {
      _self.data.attachments[index].isFold = true;
    }
    _self.setData({
      attachments: _self.data.attachments
    });
  },
  // 关闭弹框
  btnHide: function () {
    this.setData({
      maskShow: false
    })
  },
  // 确认录音
  btnShow: function () {
    this.setData({
      maskShow: false,
      tempFilePaths: this.data.lists
    })
    console.log(this.data.tempFilePaths)
    // 开始上传录音文件
    this.wxUploadFile(this.data.evidenceCode, this.data.evidenceCodeName);
  },
  checkboxChange: function (e) {
    // 存储零时选择的文件
    this.setData({
      lists: e.detail.value,
      audioNames: []
    })
    for (var j = 0; j < e.detail.value.length; j++) {  
      for (var i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].tempFilePath == e.detail.value[j]) {
          this.data.audioNames.push(this.data.list[i].audioName)
        }
      }
    }

    this.setData({
      audioNames: this.data.audioNames
    })
  },
  //存在caseId 的情况删除证据
  deleteUploadHistory: function (e) {
    const _self = this;
    _self.data.violentCaseAttachmentId = e.currentTarget.dataset.param;
    var attachmentIndex = e.currentTarget.dataset.attachmentindex;
    var childIndex = e.currentTarget.dataset.childindex;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          if (_self.data.serviceId != "") {
            util.POST('mobile/violentCase/deleteAttachment', app.globalData.loginInfo.token, {
              "violentCaseId": _self.data.serviceId,
              "violentCaseAttachmentId": _self.data.violentCaseAttachmentId
            }, function (res) {

              if (res.data.code == '200') {
                wx.showToast({
                  title: '操作成功！',
                })

                _self.data.attachments[attachmentIndex].children.splice(childIndex, 1);
                app.globalData.newEventEvidenceType[attachmentIndex].children.splice(childIndex, 1)
                /*请求数据 */
                _self.setData({
                  attachments: _self.data.attachments
                })

              } else {
                util.remind("操作失败！");
              }
            });
          } else {
            _self.data.attachments[attachmentIndex].children.splice(childIndex, 1);
            app.globalData.newEventEvidenceType[attachmentIndex].children.splice(childIndex, 1)

            /*请求数据 */
            _self.setData({
              attachments: _self.data.attachments
            })
          }

        } else if (res.cancel) {

        }
      }
    })
  },

  // 资料库删除
  deleteUploadHistory1: function (e) {
    // console.log(e);
    const _self = this;
    _self.data.violentCaseAttachmentId = e.currentTarget.dataset.param;
    var attachmentIndex = e.currentTarget.dataset.attachmentindex;
    var childIndex = e.currentTarget.dataset.childindex;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          util.POST('mobile/violentCase/deleteDatabaseAttachment', app.globalData.loginInfo.token, {
            "violentCaseAttachmentId": _self.data.violentCaseAttachmentId
          }, function (res) {

            if (res.data.code == '200') {
              wx.showToast({
                title: '操作成功！',
              })

              _self.data.attachments[attachmentIndex].children.splice(childIndex, 1);

              /*请求数据 */
              _self.setData({
                attachments: _self.data.attachments
              })

            } else {
              util.remind("操作失败！");
            }
          });

        } else if (res.cancel) {

        }
      }
    })

  },

  //获取证据类型
  getDicts: function () {
    const _self = this;
    util.POST("/mobile/common/getDicts", "", {
      "type": "evidence_type"
    }, function (res) {
      if (res.data.code == "200") {
        _self.data.attachments = res.data.result.dicts;
        for (var i = 0; i < _self.data.attachments.length; i++) {
          _self.data.attachments[i].children = [];
        }
        app.globalData.newEventEvidenceType = _self.data.attachments;
        _self.setData({
          attachments: _self.data.attachments,
        })

      } else {
        util.remind("获取证据类型失败！");
      }
    })
  },

  //新建事件服务证据上传后刷新
  unloadEvidenceRefresh: function () {
    const _self = this;
    _self.setData({
      attachments: app.globalData.newEventEvidenceType
    })
  },

  //下载
  downLoadFiles: function (e) {
    const _self = this;
    var token = '';
    var violentCaseUrl = e.currentTarget.dataset.param;
    if (violentCaseUrl.indexOf('https://') == -1) {
      violentCaseUrl = config.API_HOST + "lawCaseAttachment/" + violentCaseUrl;
    }
    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    wx.showLoading();
    wx.downloadFile({
      url: violentCaseUrl,
      header: {
        'token': token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var tempFilePaths = res.tempFilePath;
          var imageArray = tempFilePaths.split(".");
          var lengths = imageArray.length - 1;
          //保存图片
          if (imageArray[lengths] == "png" || imageArray[lengths] == "PNG" || imageArray[lengths] == "jpg" || imageArray[lengths] == "JPG" || imageArray[lengths] == "jpeg" || imageArray[lengths] == "JPEG" || imageArray[lengths] == "GIF" || imageArray[lengths] == "gif" || imageArray[lengths] == "PSD" || imageArray[lengths] == "psd" || imageArray[lengths] == "TIFF" || imageArray[lengths] == "tiff" || imageArray[lengths] == "eps" || imageArray[lengths] == "EPS") {

            wx.saveImageToPhotosAlbum({
              filePath: tempFilePaths,
              success(res) {
                util.remind("下载成功，请到手机相册中查看！");

              },
              fail(res) {
                console.log(res);
              }
            })
            //保存视频
          } else if (imageArray[lengths] == "mp4" || imageArray[lengths] == "avi" || imageArray[lengths] == "mov" || imageArray[lengths] == "mkv" || imageArray[lengths] == "rmvb" || imageArray[lengths] == "flv" || imageArray[lengths] == "rm") {
            wx.saveVideoToPhotosAlbum({
              filePath: tempFilePaths,
              success(res) {
                util.remind("下载成功，请到手机相册中查看！");
              },
              fail(res) {
                console.log(res);
              }
            })
          } else {
            //除图片其他文件保存到本地
            wx.saveFile({
              tempFilePath: tempFilePaths,
              success: function (res) {
                var savedFilePath = res.savedFilePath
                util.remind("下载成功，请到手机中查看！");

                wx.openDocument({
                  filePath: savedFilePath,
                  success: function (res) {

                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }
            })
          }

        }
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        util.remind(res.errMsg);
      }

    })
  },
  //获取系统信息
  getSystemInformation: function () {
    const _self = this;
    wx.getSystemInfo({
      success: function (res) {
        _self.setData({
          clientHeight: res.windowHeight - 16
        });
      }
    });
  },
  /**
   * 选择上传类似
   */
  uploadTypePickerSelected: function (e) {
    var _this = this;
    var typeItem = e.currentTarget.dataset.typeItem;
    _this.setData({
      evidenceCode: typeItem.code,
      evidenceCodeName: typeItem.name
    });
    if (e.detail.value == "0") {
      wx.navigateTo({
        url: _this.data.databaseUrl,
      });
    }
    else {
      _this.uploadFile();
    };
  },

  upload2Database: function (e) {
    var _self = this;
    var typeItem = e.currentTarget.dataset.typeItem;
    _self.setData({
      evidenceCode: typeItem.code,
      evidenceCodeName: typeItem.name
    });
    this.uploadFile(_self.data.tempFilePaths);
  },

  uploadFile: function () {
    var _self = this;
    var token = '';
    var evidenceCode = _self.data.evidenceCode;
    var evidenceCodeName = _self.data.evidenceCodeName;

    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    if (_self.data.evidenceCode == "") {
      util.remind("请选择证据类型！");
      return false
    }
    if (evidenceCode == "ET0010") {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          _self.data.tempFilePaths = [];
          _self.data.tempFilePaths.push(res.tempFilePath);
          _self.wxUploadFile(evidenceCode, evidenceCodeName);
        },
        fail: function (res) {
          // console.log(res);
        }
      })
    } else if (evidenceCode == "ET0011") {
      // 读取本地缓存，查看录音的路径
      wx.getStorage({
        key: 'list',
        success: function (res) {
          // 判断是否存在录音
          if (!res.data[0]) {
            util.remind("暂无录音");
          } else {
            // 存在录音显示弹框
            res.data.forEach(function (item) {
              item.checked = false;
            })
            _self.setData({
              list: res.data,
              maskShow: true
            })
            // _self.data.tempFilePaths = [];
            // res.data.forEach(function (item) {
            //   _self.data.tempFilePaths.push(item.tempFilePath);
            // })
            // _self.wxUploadFile(evidenceCode, evidenceCodeName);
          }
        },
        fail: function () {
          util.remind("暂无录音");
        }
      })
    } else {
      wx.chooseImage({
        success: function (res) {
          _self.data.tempFilePaths = res.tempFilePaths;
          _self.wxUploadFile(evidenceCode, evidenceCodeName);
        },
        complete: function (res) {
          //console.log(res);
        },
        fail: function (res) {
          // console.log(res);
        },
      })

    }
  },

  //上传文件方法
  wxUploadFile: function (evidenceCode, evidenceCodeName) {
    var _self = this;
    var token = '';
    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    wx.showLoading();
    // 检测同一文件上传次数
    var num = 0;
    // 递归上传文件
    this.sendFile(_self, num, evidenceCode, evidenceCodeName);
    return false;

    for (var y = 0; y < _self.data.tempFilePaths.length; y++) {
      if (_self.data.tempFilePaths.length - 1 == y) {
        _self.data.backTo = true;
      }
      var url = getApp().globalData.rootURL + _self.data.uploadUrl;
      
      if (evidenceCode == "ET0011" && _self.data.audioNames.length != 0) {
        _self.setData({
          uploadAudioName: _self.data.audioNames[y]
        })
      } else {
        _self.setData({
          uploadAudioName: ''
        })
      }
      if (_self.data.tempFilePaths.length != 0){
        _self.setData({
          theFilePath: _self.data.tempFilePaths[y]
        })
      }else{
        _self.setData({
          theFilePath: ''
        })
        util.remind('无文件上传');
        return false;
      }
      wx.uploadFile({
        url: url,
        filePath: _self.data.theFilePath,
        name: 'file',
        formData: {
          'type': evidenceCode,
          'name': _self.data.uploadAudioName,
          'violentCaseId': _self.data.serviceId
        },
        header: {
          'token': token,
        },
        success: function (res) {
          console.info(res);
          var data = JSON.parse(res.data);
          var uploadFileNameOne = [];
          var uploadFileNameTwo = [];
          if (data.code == "200") {
            console.info(!_self.data.allFiles);

            if (!_self.data.allFiles) {
              if (_self.data.serviceId == "") {
                console.log("本地上传成功...");
                app.globalData.listStatus[8].checked = true //将列表中上传证据的状态改成已完成
                uploadFileNameOne = data.result.attachements[0].url.split("/");
                uploadFileNameTwo = uploadFileNameOne[1].split(".");
                var evidenceTypeLength = app.globalData.newEventEvidenceType.length;
                for (var i = 0; i < evidenceTypeLength; i++) {
                  if (app.globalData.newEventEvidenceType[i].code == evidenceCode) {
                    app.globalData.newEventEvidenceType[i].children.push({
                      "createTime": "",
                      "name": data.result.attachements[0].name,
                      "url": data.result.attachements[0].url,
                      "delFlag": "0",
                      "type": evidenceCode,
                      "id": "",
                      "md5": uploadFileNameTwo[0]
                    });
                  }
                }

                _self.unloadEvidenceRefresh();
              }
              else {
                _self.getMessage();
              }
            }
            else {
              console.log("资料库上传成功...");
              _self.getMessageAll();
            }

            wx.hideLoading();
            wx.showToast({
              title: "操作成功！",
              complete: function () {

              }
            })

          } else {
            util.remind(data.message);
          }
        },
        fail: function (res) {
          var data = JSON.parse(res.data);
          util.remind("操作失败" + data.message);
        }
      })

    }
  },
  // 上传的递归函数
  sendFile: function (_self, num, evidenceCode, evidenceCodeName) {
    if (evidenceCode == "ET0011" && _self.data.audioNames.length != 0){
      _self.setData({
        uploadAudioName: _self.data.audioNames[_self.data.count]
      })
    }else{
      _self.setData({
        uploadAudioName:''
      })
    }
    if (_self.data.tempFilePaths.length != 0) {
      _self.setData({
        theFilePath: _self.data.tempFilePaths[_self.data.count]
      })
    } else {
      _self.setData({
        theFilePath: ''
      })
      util.remind('无文件上传');
      return false;
    }
    // 执行上传文件
    wx.uploadFile({
      url: getApp().globalData.rootURL + _self.data.uploadUrl,
      filePath: _self.data.theFilePath,
      name: 'file',
      formData: {
        'type': evidenceCode,
        'name': _self.data.uploadAudioName,
        'violentCaseId': _self.data.serviceId
      },
      header: {
        'token': app.globalData.loginInfo.token,
      },
      success: function (res) {
        // console.log(res)
        var data = JSON.parse(res.data);
        var uploadFileNameOne = [];
        var uploadFileNameTwo = [];
        if (data.code == "200") {
          if (!_self.data.allFiles) {
            if (_self.data.serviceId == "") {
              app.globalData.listStatus[8].checked = true //将列表中上传证据的状态改成已完成
              uploadFileNameOne = data.result.attachements[0].url.split("/");
              uploadFileNameTwo = uploadFileNameOne[1].split(".");
              var evidenceTypeLength = app.globalData.newEventEvidenceType.length;
              for (var i = 0; i < evidenceTypeLength; i++) {
                if (app.globalData.newEventEvidenceType[i].code == evidenceCode) {
                  app.globalData.newEventEvidenceType[i].children.push({
                    "createTime": "",
                    "name": data.result.attachements[0].name,
                    "url": data.result.attachements[0].url,
                    "delFlag": "0",
                    "type": evidenceCode,
                    "id": "",
                    "md5": uploadFileNameTwo[0]
                  });
                }
              }
              num = 0;
              _self.unloadEvidenceRefresh();
              if (_self.data.count == _self.data.tempFilePaths.length - 1) {
                util.remind("文件上传完毕");
                _self.setData({
                  count: 0
                })
                return false;
              }
              _self.data.count = _self.data.count + 1;
              _self.setData({
                count: _self.data.count
              })
              _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
            } else {
              num = 0;
              _self.unloadEvidenceRefresh();
              if (_self.data.count == _self.data.tempFilePaths.length - 1) {
                util.remind("文件上传完毕");
                _self.getMessage();
                _self.setData({
                  count: 0
                })
                return false;
              }
              _self.data.count = _self.data.count + 1;
              _self.setData({
                count: _self.data.count
              })
              _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
            }
          } else {
            num = 0;
            _self.unloadEvidenceRefresh();
            if (_self.data.count == _self.data.tempFilePaths.length - 1) {
              util.remind("文件上传完毕");
              _self.getMessageAll();
              _self.setData({
                count: 0
              })
              return false;
            }
            _self.data.count = _self.data.count + 1;
            _self.setData({
              count: _self.data.count
            })
            _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
            console.log("资料库上传成功...");

          }
          wx.hideLoading();
          wx.showToast({
            title: "操作成功！",
            complete: function () {

            }
          })
        } else {
          if (_self.data.count == _self.data.tempFilePaths.length - 1) {
            util.remind("文件上传完毕");
            _self.getMessageAll();
            _self.setData({
              count: 0
            })
            return false;
          }
          _self.data.count = _self.data.count + 1;
          _self.setData({
            count: _self.data.count
          })
          _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
          util.remind(data.message);
        }
      },
      fail: function (res) {
        num++;
        _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
        if (num == 4) {
          util.remind("该文件已超过最大上传次数，跳过该文件");
          _self.setData({
            count: _self.data.count++
          })
          _self.sendFile(_self, num, evidenceCode, evidenceCodeName);
        }
        // var data = JSON.parse(res.data);
        // util.remind("操作失败" + data.message);
      }
    })
  },
  /**
   * 分类点击变色
   */
  headClick: function (e) {
    var _self = this;
    var typeItem = e.currentTarget.dataset.typeItem;
    // console.log("点击头部...", typeItem);
    for (var i = 0; i < _self.data.attachments.length; i++) {
      if (_self.data.attachments[i].code == typeItem.code) {
        _self.data.attachments[i].selected = true;
        _self.data.databaseUrl = '/pages/completeData/evidenceUpload/uploadDatabaseSelect/uploadDatabaseSelect?evidenceCode' + typeItem.code
      }
      else {
        _self.data.attachments[i].selected = false;
        _self.data.databaseUrl = '/pages/completeData/evidenceUpload/uploadDatabaseSelect/uploadDatabaseSelect?evidenceCode' + '='+typeItem.code
      }
    }

    _self.setData({
      attachments: _self.data.attachments,
      databaseUrl: _self.data.databaseUrl
    })
  },

  selectorTap: function (e) {
    console.log("selectorTap", e);
  },

  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    // util.POST('mobile/login/signin', '', { 'phone': '15871775675', 'pwd': '12345678' }, function (res) {
    util.POST('mobile/login/signin', '', { 'phone': '15928578507', 'pwd': '11111111' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.getMessageAll();
        // _this.getMessage();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})
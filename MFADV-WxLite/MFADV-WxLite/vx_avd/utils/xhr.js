var app = getApp()

function wxRequest(url, config, resolve, reject) {
  
  let data = config.data,
      contentType = config.contentType,
      method = config.method,
      token = '';
  if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    }
      
  wx.request({
    url: app.globalData.rootURL + url,
    data: data,
    method: method,
    header: {
      'content-type': contentType,
      'token':token
    },
    success: (data) => resolve(data),
    fail: (err) => reject(err)
  })
}

module.exports = {
  wxRequest: wxRequest
}
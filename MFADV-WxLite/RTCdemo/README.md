#腾讯云音视频多人会话解决方案部署指引

腾讯云提供了全套技术文档和源码来帮助您快速构建一个音视频小程序，但是再好的源码和文档也有学习成本，为了尽快的能调试起来，我们还提供了一个免费的一键部署服务：您只需轻点几下鼠标，就可以在自己的账号下获得一个音视频小程序，同时附送一台拥有独立域名的测试服务器，让您可以在 5 分钟内快速构建出自己的测试环境。

## 一、通过微信公众平台授权登录腾讯云

打开[微信公众平台](https://mp.weixin.qq.com)注册并登录小程序，按如下步骤操作：

1. 单击左侧菜单栏中的【设置】。
2. 单击右侧 Tab 栏中的【开发者工具】。
3. 单击【腾讯云】，进入腾讯云工具页面，单击【开通】。
4. 使用小程序绑定的微信扫码即可将小程序授权给腾讯云，开通之后会自动进去腾讯云微信小程序控制台，显示开发环境已开通，此时可以进行后续操作。

> **注意：**
>
> 此时通过小程序开发者工具查看腾讯云状态并不会显示已开通，已开通状态会在第一次部署开发环境之后才会同步到微信开发者工具上。

![进入微信公众平台后台](https://mc.qcloudimg.com/static/img/a3ca2891b23cfce7d3678cd05a4e14fe/13.jpg)

![开通腾讯云](https://mc.qcloudimg.com/static/img/53e34b52e098ee3a0a02ecc8fbb68a54/14.jpg)

![腾讯云微信小程序控制台](https://mc.qcloudimg.com/static/img/032d0b2b99dfcfdf4234db911e93b60f/15.png)

## 二、免费开通腾讯云服务
### 1.开通直播服务
#### 1.1 申请开通视频直播服务
进入[直播管理控制台](https://console.cloud.tencent.com/live)，如果服务还没有开通，则会有如下提示:
![](https://mc.qcloudimg.com/static/img/c40ff3b85b3ad9c0cb03170948d93555/image.png)
点击申请开通，之后会进入腾讯云人工审核阶段，审核通过后即可开通。


#### 1.2 配置直播码
直播服务开通后，进入[直播控制台>>直播码接入>>接入配置](https://console.cloud.tencent.com/live/livecodemanage) 完成相关配置，即可开启直播码服务：
![](https://mc.qcloudimg.com/static/img/32158e398ab9543b5ac3acf5f04aa86e/image.png)
点击**确定接入**按钮即可。

#### 1.3 获取直播服务配置信息
从直播控制台获取bizid、pushSecretKey，后面配置服务器会用到：
![](https://mc.qcloudimg.com/static/img/2e8c581554c8d790e2b0a212d14d0d46/image.png)

#### 1.4 申请开通微信直播服务【重要】
目前需要人工审核开通，可以提工单或客服电话（400-9100-100）联系我们，商务同学会提供开通方法。

### 2. 开通云通信服务
#### 2.1 申请开通云通讯服务
进入[云通讯管理控制台](https://console.cloud.tencent.com/avc)，如果还没有服务，直接点击**直接开通云通讯**按钮即可。新认证的腾讯云账号，云通讯的应用列表是空的，如下图：
![](https://mc.qcloudimg.com/static/img/c033ddba671a514c7b160e1c99a08b55/image.png)

点击**创建应用接入**按钮创建一个新的应用接入，即您要接入腾讯云IM通讯服务的App的名字，我们的测试应用名称叫做“RTMPRoom演示”，如下图所示：
![](https://mc.qcloudimg.com/static/img/96131ecccb09ef06e50aa0ac591b802d/yuntongxing1.png)

点击确定按钮，之后就可以在应用列表中看到刚刚添加的项目了，如下图所示：
![](https://mc.qcloudimg.com/static/img/168928a60c0b4c07a2ee2c318e0b1a62/yuntongxing2.png)

#### 2.2 配置独立模式
上图的列表中，右侧有一个**应用配置**按钮，点击这里进入下一步的配置工作，如下图所示。
![](https://mc.qcloudimg.com/static/img/3e9cd34ca195036e21cb487014cc2c81/yuntongxing3.png)

#### 2.3 获取云通讯服务配置信息
从直播控制台获取SdkAppid、accountType、privateKey、administrator，后面配置服务器会用到：
![](https://mc.qcloudimg.com/static/img/f3e0576d89d044a4ee452f8ba0c231ae/yuntongxing4.png)

从验证方式中下载公私钥，解压出来将private_key用文本编辑器打开，如：
```bash
-----BEGIN PRIVATE KEY-----
MIGHAgEAsUj5ep7r9TVxTrZiSpXQKhRANCAASuxr7AJGiXRqGpiO7pPrLAchyORc
Y5uWCqVm+QFTn0H+ZcHP93ss3OhgZKh8pq+g7X26dW5fQkiSH1PXG/FY
zbTbMHaWCqVm+QFTn0H+QKhRANCAASuxr7AJGiXRqGpiO7pPr7jTFTmg
-----END PRIVATE KEY-----
```

将其转换成字符串形式如下所示，后面在server配置文件中使用：

```bash
"-----BEGIN PRIVATE KEY-----\r\n"+
"MIGHAgEAsUj5ep7r9TVxTrZiSpXQKhRANCAASuxr7AJGiXRqGpiO7pPrLAchyORc\r\n"+
"Y5uWCqVm+QFTn0H+ZcHP93ss3OhgZKh8pq+g7X26dW5fQkiSH1PXG/FY\r\n"+
"zbTbMHaWCqVm+QFTn0H+QKhRANCAASuxr7AJGiXRqGpiO7pPr7jTFTmg\r\n"+
"-----END PRIVATE KEY-----\r\n"
```
## 三、安装微信小程序开发工具

下载并安装最新版本的[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，使用小程序绑定的微信号扫码登录开发者工具。

![微信开发者工具](https://mc.qcloudimg.com/static/img/4fd45bb5c74eed92b031fbebf8600bd2/1.png)

## 四、下载 Demo 

访问 [SDK+Demo](https://cloud.tencent.com/document/product/454/7873#XiaoChengXu)，获取小程序 Demo 和后台源码。

## 五、上传和部署代码

1. 打开第三步安装的微信开发者工具，点击【小程序项目】按钮。
2. 输入小程序 AppID，项目目录选择上一步下载下来的代码目录，点击确定创建小程序项目。
3. 再次点击【确定】进入开发者工具。

  > **注意：** 
  >
  > 目录请选择 `RTMPRoom` 根目录。包含有 `project.config.json`，请不要只选择 `wxlite` 目录！

  ![上传代码](https://mc.qcloudimg.com/static/img/fd7074730e5b37af8a4d86dc8125d120/xiaochengxustart.png)

  ![开发者工具](https://mc.qcloudimg.com/static/img/f14303d2aa1a0d4609a4d679bf1b761a/image.png)

4. 打开 Demo 代码中 `server` 目录下的 `config.js` 文件，将其中的 `bizid`、`pushSecretKey`、`APIKey`、`sdkAppID`、`accountType`、`administrator`、`privateKey`配置成上述直播服务及云通信服务里生成的值，并**保存**。

  ![修改 MySQL 密码](https://mc.qcloudimg.com/static/img/5a11569b0d8eb50e3ff93ed7f4714bfb/image.png)

5. 点击界面右上角的【腾讯云】图标，在下拉的菜单栏中选择【上传测试代码】。

  ![上传按钮](https://mc.qcloudimg.com/static/img/8480bbc02b097bac0d511c334b731e12/5.png)

6. 选择【模块上传】并勾选全部选项，然后勾选【部署后自动安装依赖】，点击【确定】开始上传代码。

  ![选择模块](https://mc.qcloudimg.com/static/img/d7ff3775c77a662e9c18807916ab8045/6.png)

  ![上传成功](https://mc.qcloudimg.com/static/img/a78431b42d0edf0bddae0b85ef00d40f/7.png)

7. 上传代码完成之后，点击右上角的【详情】按钮，接着选择【腾讯云状态】即可看到腾讯云自动分配给你的开发环境域名：

  ![查看开发域名](https://mc.qcloudimg.com/static/img/f7549e6b1f6f5f9690c910957082f49c/%7B04138BF0-C29C-4A8B-A494-89E072C84B38%7D.png)

8. 完整复制（包括 `https://`）开发环境 request 域名，然后在编辑器中打开 `wxlite/config.js` 文件，将复制的域名填入 `url` 中并保存，保存之后编辑器会自动编译小程序，左边的模拟器窗口即可实时显示出客户端的 Demo：

  ![修改客户端配置](https://mc.qcloudimg.com/static/img/227e5b6de550496e6841ff0053644e15/image.png)

9. 在模拟器中编译运行点击多人音视频进入，在右侧的console里面可以看到登录成功的log表示配置成功。 

  ![登录测试](https://mc.qcloudimg.com/static/img/536b77d25e5927690bcb93632a528470/image.png)

## 六、项目结构  
```
RTMPRoom
├── README.md
├── server               //后台代码目录，具体请参见服务端项目结构介绍
├── wxlite               //腾讯视频云小程序目录
├── ├── pages            //腾讯视频云小程序界面主目录
├── ├── ├── main         //腾讯视频云小程序主界面
├── ├── ├── liveroom     //腾讯视频云小程序直播体验室
├── ├── ├── ├────roomlist//腾讯视频云小程序直播体验室列表界面
├── ├── ├── ├────room    //腾讯视频云小程序直播体验室直播界面
├── ├── ├── doubleroom   //腾讯视频云小程序双人音视频
├── ├── ├── ├────roomlist//腾讯视频云小程序双人音视频在线列表
├── ├── ├── ├────room    //腾讯视频云小程序双人音视频视频聊天界面
├── ├── ├── multiroom    //腾讯视频云小程序多人音视频
├── ├── ├── ├────roomlist//腾讯视频云小程序多人音视频在线列表
├── ├── ├── ├────room    //腾讯视频云小程序多人音视频视频聊天界面
├── ├── ├── cameraview   //腾讯视频云小程序双人、多人聊天推流自定义组件
├── ├── ├── play         //腾讯视频云小程序播放界面
├── ├── ├── push         //腾讯视频云小程序推流界面
├── ├── ├── rtpplay      //腾讯视频云小程序低延时播放界面
├── ├── ├── vodplay      //腾讯视频云小程序点播播放界面
├── ├── ├── Resources    //腾讯视频云小程序资源目录
├── ├── lib              //小程序使用的通用库目录
├── ├── utils            //腾讯视频云小程序界工具库目录
├── ├── ├── rtcroom.js   //腾讯视频云小程序双人、多人音视频库文件
├── ├── ├── liveroom.js  //腾讯视频云小程序单向音视频库文件
└── └── config.js        //配置文件，主要配置后台服务器地址
```

## 常见问题 FAQ
##### 1. 运行小程序进入多人音视频看不到画面?
  - 请确认使用手机来运行，微信开发者工具内部的模拟器目前还不支持直接运行
  - 请确认小程序基础库版本 wx.getSystemInfo 可以查询到该信息，1.7.0 以上的基础库才支持音视频能力。
  - 请确认小程序所属的类目，由于监管要求，并非所有类目的小程序都开发了音视频能力，已支持的类目请参考 [DOC](http://panshi.isd.com/helpCenterNew/helpManager/article#/doc/454/12518)。
  - 如有更多需求，或希望深度合作，可以提工单或客服电话（400-9100-100）联系我们。
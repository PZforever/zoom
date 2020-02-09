const config = require('../config')
const md5 = require('md5');

/**
 * 后台自动分配id，当前游标位置。
 */
var ids = {}
ids.user = 0;
ids.room = 0;

/**
 * 生成加速拉流播放地址
 */
function genAcceleratePlayUrl(userid, txTime) {
  var liveCode = config.live.bizid + '_' + userid;

  var txSecret = md5(config.live.pushSecretKey + liveCode + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase());

  var ext = "?" + "bizid=" + config.live.bizid + "&txSecret=" + txSecret + "&txTime=" + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase();

  var push_url = "rtmp://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode + ext;
  return push_url;

}

/**
 * 生成推流地址
 */
function genPushUrl(userid, txTime) {
  var liveCode = config.live.bizid + '_' + userid;

  var txSecret = md5(config.live.pushSecretKey + liveCode + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase());

  var ext = "?" + "bizid=" + config.live.bizid + "&txSecret=" + txSecret + "&txTime=" + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase();

  var push_url = "rtmp://" + config.live.bizid + ".livepush.myqcloud.com/live/" + liveCode + ext;
  return push_url;

}

/**
 * 生成混流地址
 */
function genMixedPlayUrl(userid, stream_type) {
  var liveCode = config.live.bizid + '_' + userid;
  return "https://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode + ".flv";
}

/**
 * 生成一组播放地址
 */
function genPlayURLs(userid, txTime)
{
  var liveCode = config.live.bizid + '_' + userid;

  var txSecret = md5(config.live.pushSecretKey + liveCode + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase());

  var ext = "?" + "bizid=" + config.live.bizid + "&txSecret=" + txSecret + "&txTime=" + parseInt(txTime.getTime() / 1000).toString(16).toUpperCase();

  var ret = {};
  ret.url_play_flv = "http://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode + ".flv";
  ret.url_play_rtmp = "rtmp://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode;
  ret.url_play_hls = "http://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode + ".m3u8";
  ret.url_play_acc = "rtmp://" + config.live.bizid + ".liveplay.myqcloud.com/live/" + liveCode + ext;
  return ret;
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * 随机生成room_id
 */
function genRoomIdByRandom() {
  return "room_" + (S4() + S4() + "_" + S4());
}

/**
 * 随机生成user_id
 */
function genUserIdByRandom() {
  return "user_" + (S4() + S4() + "_" + S4());
}


/**
 * 自增生成userid
 */
function genUserId() {
  ids.user++;
  var txTime = new Date();
  return "user_" + txTime.getTime().toString() + "_" + ids.user.toString();
}


/**
 * 自增生成roomid
 */
function genRoomId() {
  ids.room++;
  var txTime = new Date();
  return "room_" + txTime.getTime().toString() + "_" + ids.room.toString();
}

module.exports = {
  genAcceleratePlayUrl,
  genPushUrl,
  genMixedPlayUrl,
  genPlayURLs,
  genUserId,
  genRoomId,
  genUserIdByRandom
}
const config = require('../config');
const roommgr = require('../logic/double_room_mgr')
const immgr = require('../logic/im_mgr')
const liveutil = require('../logic/live_util.js')
const log = require('../log')


module.exports = async (ctx, next) => {
  if (!ctx.request.body || !ctx.request.body.userIDPrefix) {
    ctx.body = roommgr.getErrMsg(1);
    log.logErrMsg(ctx, ctx.body.message, 0);
    return;
  }

  var ret = roommgr.getErrMsg(0);
  ret.userID = liveutil.genUserId();
  ret.sdkAppID = config.im.sdkAppID;
  ret.accType = config.im.accountType;
  ret.userSig = immgr.getSig(ret.userID);
  ctx.body = ret;
  log.logResponse(ctx, 0);
}
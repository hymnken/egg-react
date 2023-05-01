const Controller = require("egg").Controller;
const md5 = require("md5");
const dayjs = require("dayjs");
class UserController extends Controller {
  // 注册接口
  async register() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const user = await ctx.service.user.getUser(params.username);
    if (user) {
      ctx.body = {
        status: 500,
        errMsg: "用户已存在",
      };
      return;
    }
    const result = await ctx.service.user.addUser({
      ...params,
      // 隐式加密 只有开发人员才知道后面加了个hymnken
      password: md5(params.password + app.config.salt),
      createTime: ctx.helper.time(),
    });
    if (result) {
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(result.dataValues, ["password"]),
          createTime: ctx.helper.timeStamp(result.createTime),
        },
      };
    } else {
      ctx.body = {
        status: 500,
        errMsg: "注册用户失败",
      };
    }
  }

  // 登录接口
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const user = await ctx.service.user.getUser(username, password);
    if (user) {
      ctx.session.userId = user.id;
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(user.dataValues, ["password"]),
          createTime: ctx.helper.timeStamp(user.createTime),
        },
      };
    } else {
      ctx.body = {
        status: 500,
        errMsg: "该用户不存在",
      };
    }
  }
}

module.exports = UserController;

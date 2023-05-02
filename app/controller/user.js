const Controller = require("egg").Controller;
const md5 = require("md5");
const dayjs = require("dayjs");
class UserController extends Controller {
  async jwtSign() {
    const { ctx, app } = this;
    const username = ctx.request.body.username;
    const token = app.jwt.sign(
      {
        username,
      },
      app.config.jwt.secret
    );
    ctx.session[username] = 1;
    return token;
  }
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
      const token = await this.jwtSign();
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(result.dataValues, ["password"]),
          createTime: ctx.helper.timeStamp(result.createTime),
          token,
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
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const user = await ctx.service.user.getUser(username, password);
    if (user) {
      const token = await this.jwtSign();
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(user.dataValues, ["password"]),
          createTime: ctx.helper.timeStamp(user.createTime),
          token,
        },
      };
    } else {
      ctx.body = {
        status: 500,
        errMsg: "该用户不存在或者密码错误,请仔细检查",
      };
    }
  }
  // 用户详情接口
  async detail() {
    const { ctx } = this;
    const user = await ctx.service.user.getUser(ctx.username);
    if (user) {
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
  async logout() {
    const { ctx } = this;
    try {
      ctx.session[ctx.username] = null;
      ctx.body = {
        status: 200,
        data: "ok",
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        errMsg: "退出登录失败",
      };
    }
  }
}

module.exports = UserController;

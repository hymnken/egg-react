const Controller = require("egg").Controller
const md5 = require("md5");
const BaseController = require("./base");
class UserController extends BaseController {
  async jwtSign() {
    const { ctx, app } = this;
    // const username = ctx.request.body.username;
    const username = ctx.params("username");
    const token = app.jwt.sign(
      {
        username,
      },
      app.config.jwt.secret
    );
    // ctx.session[username] = 1;
    await app.redis.set(username, token, "EX", app.config.redisExpire);
    return token;
  }
  parseResult(ctx, result) {
    return {
      ...ctx.helper.unPick(result.dataValues, ["password"]),
      createTime: ctx.helper.timeStamp(result.createTime),
    };
  }

  // 注册接口
  async register() {
    const { ctx, app } = this;
    const params = ctx.params();
    const user = await ctx.service.user.getUser(params.username);
    if (user) {
      this.error("用户已经存在");
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
      this.success({
        ...this.parseResult(ctx, result),
        token,
      });
    } else {
      this.error("注册用户失败");
    }
  }
  // 登录接口
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.params();
    const user = await ctx.service.user.getUser(username, password);
    if (user) {
      const token = await this.jwtSign();
      this.success({
        ...this.parseResult(ctx, user),
        token,
      });
    } else {
      this.error("该用户不存在");
    }
  }
  // 用户详情接口
  async detail() {
    const { ctx } = this;
    const user = await ctx.service.user.getUser(ctx.username);
    if (user) {
      this.success({
        ...this.parseResult(ctx, user),
      });
    } else {
      this.error("该用户不存在");
    }
  }
  async logout() {
    const { ctx } = this;
    try {
      ctx.session[ctx.username] = null;
      this.success("ok");
    } catch (error) {
      this.error("登出失败");
    }
  }
  async edit() {
    const { ctx } = this;
    const result = ctx.service.user.editUser({
      ...ctx.params(),
      updateTime:ctx.helper.time()
    })
    this.success(result)
  }
}

module.exports = UserController;

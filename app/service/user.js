const Service = require("egg").Service;
const md5 = require("md5");
class UserService extends Service {
  // 查询用户信息
  async getUser(username, password) {
    try {
      const { ctx, app } = this;
      const _where = password
        ? { username, password: md5(password + app.config.salt) }
        : { username };
      const result = await ctx.model.User.findOne({
        where: _where
      });
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  // 添加用户
  async addUser(params) {
    try {
      const { ctx } = this;
      const result = await ctx.model.User.create(params);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
module.exports = UserService;

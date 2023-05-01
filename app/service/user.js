const Service = require("egg").Service;
class UserService extends Service {
  // 查询用户信息
  async getUser(username) {
    try {
      const { ctx } = this;
      const result = await ctx.model.User.findOne({
        where: {
          username,
        },
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

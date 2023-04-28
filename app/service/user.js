"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  // 查询所有
  async lists() {
    try {
      const { app } = this;
      const res = await app.mysql.select('user');
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async detail(id) {
    return {
      id,
      name: "john",
      age: 18,
    };
  }
}

module.exports = UserService;

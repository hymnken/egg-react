"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  // 查询所有
  async lists() {
    try {
      const { app } = this;
      const res = await app.mysql.select("user");
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 查询单条
  async detail2(id) {
    try {
      const { app } = this;
      const res = await app.mysql.get("user", { id });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 新增数据
  async add(params) {
    try {
      const { app } = this;
      const res = await app.mysql.insert("user",params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
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

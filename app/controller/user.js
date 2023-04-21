const Controller = require("egg").Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    // eslint-disable-next-line quotes
    // ctx.body = "user index";

    await ctx.render('user.html', {
      id: 100,
      name: 'admin',
      lists: [
        'java',
        'php',
        'ts'
      ]
    })
  }

  async lists() {
    const { ctx } = this;
    // eslint-disable-next-line quotes
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    ctx.body = [{ id: 123 }];
  }

  async detail() {
    const { ctx } = this;
    //   console.log(ctx.query)
    // ctx.body = "detail";
    const res = await ctx.service.user.detail(10)
    console.log(res);
    ctx.body = res;
  }

  async add() {
    const { ctx } = this;
    const rule = {
      name: { type: "string" },
      age: { type: "number" },
    };
    ctx.validate(rule)
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }
}

module.exports = UserController;

const  Controller  = require("egg").Controller

class BaseController extends Controller {
  success(data = {}) {
    const { ctx, app } = this;
    ctx.body = {
      status: 200,
      data,
    };
  }

  error(errMsg = "") {
    const { ctx, app } = this;
    ctx.body = {
      status: 500,
      errMsg,
    };
  }
}

module.exports = BaseController;
